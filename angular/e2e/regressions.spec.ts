import { test, expect, Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { News } from '../src/app/core/news.model';

const base = process.env.ANGULAR_URL || 'http://localhost:4200';
const records: News[] = JSON.parse(
  readFileSync(resolve(__dirname, '../../src/data/noticias.json'), 'utf8'),
);

async function seed(page: Page, news = records) {
  await page.route('**/src/data/noticias.json', (route) => route.fulfill({ json: news }));
}

async function openFavorites(page: Page) {
  await page.goto(base + '/favoritos');
  await expect(page.locator('#favoritesTitle')).toBeVisible();
}

for (const width of [390, 1280]) {
  test(`todos los favoritos, edición y eliminación sincronizadas a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    page.on('dialog', (dialog) => dialog.accept());
    await seed(page);
    await page.goto(base + '/noticias');
    await expect(page.locator('.news-card')).toHaveCount(records.length);
    for (const record of records) await page.locator(`.btn-fav[data-id="${record.id}"]`).click();
    await openFavorites(page);
    await expect(page.locator('.news-card')).toHaveCount(records.length);
    await expect(page.locator('.news-card').first()).toHaveAttribute(
      'data-id',
      String(records.at(-1)!.id),
    );
    await page.reload();
    await expect(page.locator('.news-card')).toHaveCount(records.length);
    await page.goto(base + '/admin');
    await expect(page.locator('.admin-row')).toHaveCount(records.length);
    await expect(page.locator('#statFavorites')).toHaveText('12');
    const old = page.locator('.admin-row[data-id="1"]');
    await old.getByRole('button', { name: 'Editar', exact: true }).click();
    await expect(page.locator('#titulo')).toBeFocused();
    await expect(page.locator('#titulo')).toBeInViewport();
    await page.locator('#titulo').fill('Noticia antigua editada');
    await page.locator('#btnSubmitAdmin').click();
    await expect(page.locator('.admin-row[data-id="1"] .admin-row__date')).toHaveText(
      '01 SEP 2026',
    );
    await openFavorites(page);
    await expect(page.locator('.news-card[data-id="1"] .news-card__title')).toHaveText(
      'Noticia antigua editada',
    );
    await page.reload();
    await expect(page.locator('.news-card[data-id="1"] .news-card__title')).toHaveText(
      'Noticia antigua editada',
    );
    await page.goto(base + '/admin');
    await page
      .locator('.admin-row[data-id="1"]')
      .getByRole('button', { name: 'Eliminar', exact: true })
      .click();
    await expect(page.locator('.admin-row')).toHaveCount(11);
    await expect(page.locator('#statNews')).toHaveText('11');
    await expect(page.locator('#statFavorites')).toHaveText('11');
    await page.reload();
    await expect(page.locator('.admin-row[data-id="1"]')).toHaveCount(0);
    await openFavorites(page);
    await expect(page.locator('.news-card')).toHaveCount(11);
    await expect(page.locator('.news-card[data-id="1"]')).toHaveCount(0);
    for (const record of records.filter((n) => n.id !== 1))
      await page.locator(`.btn-fav[data-id="${record.id}"]`).click();
    await expect(page.locator('#mensajeVacioFavs')).toBeVisible();
    await expect(page.locator('.news-card')).toHaveCount(0);
    await page.goto(base + '/detalle?id=1');
    await expect(page.locator('.feedback-error')).toHaveText('Noticia no encontrada.');
  });
}

for (const timezoneId of ['America/Bogota', 'America/Los_Angeles', 'UTC', 'Pacific/Kiritimati']) {
  test(`fechas de calendario iguales en tarjetas, detalle y administración: ${timezoneId}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ timezoneId });
    const page = await context.newPage();
    const fixtures = [
      { ...records[0], fecha: '2026-09-01' },
      { ...records[1], fecha: '2024-02-29' },
      { ...records[2], fecha: '2025-12-31' },
    ];
    await seed(page, fixtures);
    await page.goto(base + '/noticias');
    const expected = new Map([
      [1, '01 SEP 2026'],
      [2, '29 FEB 2024'],
      [3, '31 DIC 2025'],
    ]);
    for (const [id, date] of expected)
      await expect(page.locator(`.news-card[data-id="${id}"] .news-card__meta`)).toHaveText(date);
    await page.locator('.btn-fav[data-id="1"]').click();
    await openFavorites(page);
    await expect(page.locator('.news-card__meta')).toHaveText('01 SEP 2026');
    await page.goto(base + '/admin');
    for (const [id, date] of expected)
      await expect(page.locator(`.admin-row[data-id="${id}"] .admin-row__date`)).toHaveText(date);
    for (const [id, date] of expected) {
      await page.goto(base + `/detalle?id=${id}`);
      await expect(page.locator('.detail-meta')).toContainText(date);
    }
    await context.close();
  });
}

test('la creación cerca de medianoche usa el día local', async ({ browser }) => {
  const context = await browser.newContext({ timezoneId: 'America/Bogota' });
  const page = await context.newPage();
  page.on('dialog', (dialog) => dialog.accept());
  await page.clock.setFixedTime(new Date('2026-10-12T02:30:00Z'));
  await seed(page);
  await page.goto(base + '/admin');
  await page.locator('#btnNuevaNoticia').click();
  for (const field of ['titulo', 'autor', 'resumen', 'contenido'])
    await page.locator('#' + field).fill('Noticia local');
  await page.locator('#btnSubmitAdmin').click();
  await expect(page.locator('.admin-row[data-id="13"] .admin-row__date')).toHaveText('11 OCT 2026');
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('nexoNoticiasBD')!).find((n: News) => n.id === 13).fecha,
    ),
  ).toBe('2026-10-11');
  await context.close();
});

test('últimas noticias ordena el JSON desordenado y resuelve empates por id', async ({ page }) => {
  await seed(page, [
    { ...records[3], fecha: '2030-04-12', destacada: true },
    { ...records[1], fecha: '2030-04-12' },
    { ...records[2], fecha: '2029-12-31' },
    { ...records[0], fecha: '2026-01-01' },
  ]);
  await page.goto(base + '/');
  await expect(page.locator('.news-card')).toHaveCount(3);
  expect(
    await page
      .locator('.news-card')
      .evaluateAll((items) => items.map((i) => Number(i.getAttribute('data-id')))),
  ).toEqual([4, 2, 3]);
  await page.reload();
  await expect(page.locator('.news-card')).toHaveCount(3);
  expect(
    await page
      .locator('.news-card')
      .evaluateAll((items) => items.map((i) => Number(i.getAttribute('data-id')))),
  ).toEqual([4, 2, 3]);
});

test('crear y editar una noticia actualiza la portada', async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept());
  await seed(page);
  await page.goto(base + '/admin');
  await page.locator('#btnNuevaNoticia').click();
  for (const field of ['titulo', 'autor', 'resumen', 'contenido'])
    await page.locator('#' + field).fill('Nueva noticia de portada');
  await page.locator('#btnSubmitAdmin').click();
  await page.goto(base + '/');
  await expect(page.locator('.news-card').first()).toHaveAttribute('data-id', '13');
  await page.goto(base + '/admin');
  await page
    .locator('.admin-row[data-id="13"]')
    .getByRole('button', { name: 'Editar', exact: true })
    .click();
  await page.locator('#titulo').fill('Portada actualizada');
  await page.locator('#btnSubmitAdmin').click();
  await page.goto(base + '/');
  await expect(page.locator('.news-card').first().locator('.news-card__title')).toHaveText(
    'Portada actualizada',
  );
});

test('búsqueda visible, acentos, combinación con Comercio y recarga del filtro', async ({
  page,
}) => {
  await seed(page);
  await page.goto(base + '/noticias');
  const search = page.getByRole('searchbox', { name: 'Buscar noticias' });
  await expect(search).toBeVisible();
  expect((await search.boundingBox())!.width).toBeGreaterThan(200);
  await search.fill(' EDUCACION ');
  await expect(page.locator('.news-card')).toHaveCount(3);
  await search.clear();
  await page.getByRole('button', { name: 'Comercio', exact: true }).click();
  await expect(page.locator('.news-card')).toHaveCount(3);
  await page.reload();
  await expect(page.locator('.category-tag.active')).toHaveText('Comercio');
  await expect(page.locator('.news-card')).toHaveCount(3);
  await search.fill('criptomonedas');
  await expect(page.locator('.news-card')).toHaveCount(1);
  await search.fill('sin coincidencias');
  await expect(page.locator('#mensajeVacio')).toBeVisible();
  await search.clear();
  await page.getByRole('button', { name: 'Todas', exact: true }).click();
  await expect(page.locator('.news-card')).toHaveCount(12);
});

test('desde contacto móvil se accede a favoritos y gestión, Escape devuelve el foco', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seed(page);
  await page.goto(base + '/contacto');
  await page.locator('#navToggle').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#navToggle')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#navToggle')).toBeFocused();
  await page.locator('#navToggle').click();
  await page.locator('#nombre').click();
  await expect(page.locator('#navToggle')).toHaveAttribute('aria-expanded', 'false');
  for (const [label, route] of [
    ['Favoritos', '/favoritos'],
    ['Gestión', '/admin'],
  ]) {
    await page.locator('#navToggle').click();
    await page.locator('#navLinks').getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(route + '$'));
    await expect(page.locator('#navLinks a.active')).toHaveText(label);
    await expect(page.locator('#navToggle')).toHaveAttribute('aria-expanded', 'false');
  }
});

test('catálogo vacío no queda cargando y permite crear la primera noticia', async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept());
  await seed(page, []);
  await page.goto(base + '/');
  await expect(page.locator('#heroFeaturedNews')).toContainText('No hay noticias disponibles.');
  await page.goto(base + '/noticias');
  await expect(page.locator('#mensajeVacio')).toBeVisible();
  await page.goto(base + '/admin');
  await expect(page.locator('#statNews')).toHaveText('00');
  await page.locator('#btnNuevaNoticia').click();
  for (const field of ['titulo', 'autor', 'resumen', 'contenido'])
    await page.locator('#' + field).fill('Primera noticia');
  await page.locator('#btnSubmitAdmin').click();
  await expect(page.locator('.admin-row[data-id="1"]')).toBeVisible();
  await page.goto(base + '/');
  await expect(page.locator('.news-card')).toHaveCount(1);
});

test('menú y formulario conservan espacio usable entre 320 y 1280 px', async ({
  page,
}, testInfo) => {
  await seed(page);
  await page.goto(base + '/contacto');
  await expect(page.locator('.contact-form')).toBeVisible();
  for (const width of [320, 390, 699, 700, 768, 899, 900, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        page.evaluate(() => {
          const navbar = document.querySelector('.navbar')!.getBoundingClientRect();
          const actions = document.querySelector('.nav-actions')!.getBoundingClientRect();
          const form = document.querySelector('.contact-form')!.getBoundingClientRect();
          const layout = document.querySelector('.contact-layout')!.getBoundingClientRect();
          return (
            actions.right <= navbar.right &&
            (innerWidth >= 700 || Math.abs(form.width - layout.width) <= 1) &&
            document.documentElement.scrollWidth <= innerWidth + 1
          );
        }),
      )
      .toBeTruthy();
    await testInfo.attach(`contacto-${width}px`, {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  }
});

test('enlaces HTML anteriores funcionan en el build de Pages', async ({ page }) => {
  const pages = process.env.PAGES_URL;
  test.skip(!pages, 'Se verifica también contra el build estático de producción.');
  for (const route of ['noticias', 'detalle', 'favoritos', 'contacto', 'admin']) {
    const query = route === 'detalle' ? '?id=1' : route === 'noticias' ? '?categoria=Comercio' : '';
    const response = await page.goto(pages + 'src/pages/' + route + '.html' + query);
    expect(response!.status()).toBe(200);
    await expect(page).toHaveURL(new RegExp('#/' + route));
    await expect(page.locator('h1')).toBeVisible();
    if (route === 'noticias')
      await expect(page.locator('.category-tag.active')).toHaveText('Comercio');
  }
});

test('cancelar una eliminación conserva la noticia y sus favoritos', async ({ page }) => {
  page.on('dialog', (dialog) => dialog.dismiss());
  await seed(page);
  await page.goto(base + '/noticias');
  await page.locator('.btn-fav[data-id="1"]').click();
  await page.goto(base + '/admin');
  await page
    .locator('.admin-row[data-id="1"]')
    .getByRole('button', { name: 'Eliminar', exact: true })
    .click();
  await expect(page.locator('.admin-row')).toHaveCount(12);
  await expect(page.locator('#statFavorites')).toHaveText('01');
  await page.reload();
  await expect(page.locator('.admin-row[data-id="1"]')).toBeVisible();
  await openFavorites(page);
  await expect(page.locator('.news-card[data-id="1"]')).toBeVisible();
});
