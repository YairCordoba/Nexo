import { test, expect } from '@playwright/test';

const base = process.env.ANGULAR_URL || 'http://localhost:4200';

test('menú móvil, enlaces activos y navegación sin recargar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(base);
  await page.evaluate(
    () => ((window as unknown as { navigationMarker: number }).navigationMarker = 42),
  );
  await page.locator('#navToggle').click();
  await expect(page.locator('#navToggle')).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#navLinks').getByRole('link', { name: 'Noticias', exact: true }).click();
  await expect(page).toHaveURL(/\/noticias$/);
  await expect(page.locator('#navLinks a.active')).toHaveText('Noticias');
  expect(
    await page.evaluate(() => (window as unknown as { navigationMarker: number }).navigationMarker),
  ).toBe(42);
});

test('filtrar noticias, guardar favorito y persistir al recargar', async ({ page }) => {
  await page.goto(base + '/noticias');
  await page.getByRole('button', { name: 'Tecnología', exact: true }).click();
  await expect(page.locator('.news-card')).not.toHaveCount(0);
  const title = await page.locator('.news-card__title').first().innerText();
  await page.locator('.btn-fav').first().click();
  await expect(page.locator('.btn-fav').first()).toHaveAttribute('aria-pressed', 'true');
  await page.goto(base + '/favoritos');
  await expect(page.locator('.news-card__title').first()).toHaveText(title);
  await page.reload();
  await expect(page.locator('.news-card__title').first()).toHaveText(title);
  await page.locator('.btn-fav').first().click();
  await expect(page.locator('#mensajeVacioFavs')).toBeVisible();
});

test('contacto rechaza datos inválidos y confirma datos válidos', async ({ page }) => {
  await page.goto(base + '/contacto');
  await page.locator('#nombre').fill('A');
  await page.locator('#correo').fill('incorrecto');
  await page.locator('#mensaje').fill('Corto');
  await page.locator('#formContacto button[type=submit]').click();
  await expect(page.locator('#mensajeExito')).not.toBeVisible();
  await page.locator('#nombre').fill('Camilo Escobar');
  await page.locator('#correo').fill('camilo@example.com');
  await page.locator('#mensaje').fill('Consulta universitaria para validar el formulario.');
  await page.locator('#formContacto button[type=submit]').click();
  await expect(page.locator('#mensajeExito')).toBeVisible();
});

test('administración crea, edita y elimina con persistencia local', async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept());
  await page.goto(base + '/admin');
  await page.locator('#btnNuevaNoticia').click();
  await page.locator('#btnSubmitAdmin').click();
  await expect(page.locator('#formAdminPanel')).toBeVisible();
  await page.locator('#titulo').fill('Noticia de prueba universitaria');
  await page.locator('#autor').fill('Estudiante');
  await page.locator('#resumen').fill('Resumen de prueba para comprobar el registro.');
  await page
    .locator('#contenido')
    .fill('Contenido de prueba para comprobar la persistencia de noticias.');
  await page.locator('#btnSubmitAdmin').click();
  let row = page.locator('.admin-row').filter({ hasText: 'Noticia de prueba universitaria' });
  await expect(row).toBeVisible();
  await page.reload();
  await expect(row).toBeVisible();
  await row.hover();
  await row.getByRole('button', { name: 'Editar' }).click();
  await page.locator('#titulo').fill('Noticia universitaria editada');
  await page.locator('#btnSubmitAdmin').click();
  row = page.locator('.admin-row').filter({ hasText: 'Noticia universitaria editada' });
  await expect(row).toBeVisible();
  await row.hover();
  await row.getByRole('button', { name: 'Eliminar' }).click();
  await expect(row).toHaveCount(0);
  await page.reload();
  await expect(row).toHaveCount(0);
});

test('enlaces antiguos conservan parámetros y el detalle cambia dentro de la SPA', async ({
  page,
}) => {
  await page.goto(base + '/src/pages/detalle.html?id=1');
  await expect(page).toHaveURL(/\/detalle\?id=1$/);
  const firstTitle = await page.locator('h1').innerText();
  await page.evaluate(
    () => ((window as unknown as { navigationMarker: number }).navigationMarker = 42),
  );
  await page.locator('.detail-related .news-card__action').first().click();
  await expect(page.locator('h1')).not.toHaveText(firstTitle);
  expect(
    await page.evaluate(() => (window as unknown as { navigationMarker: number }).navigationMarker),
  ).toBe(42);
  await page.goto(base + '/src/pages/noticias.html?categoria=Tecnología');
  await expect(page).toHaveURL(/\/noticias\?categoria=Tecnolog/);
  await expect(page.locator('.category-tag.active')).toHaveText('Tecnología');
});

test('detalle inexistente y error del JSON tienen mensajes visibles', async ({ page }) => {
  await page.goto(base + '/detalle?id=999999');
  await expect(page.locator('.feedback-error')).toContainText('Noticia no encontrada');
  await page.evaluate(() => localStorage.clear());
  await page.route('**/src/data/noticias.json', (route) =>
    route.fulfill({ status: 503, body: 'No disponible' }),
  );
  await page.goto(base + '/noticias');
  await expect(page.locator('[role=alert]')).toContainText('No se pudo cargar');
});

test('caché corrupta se recupera y catálogo se carga una sola vez entre rutas', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('nexoNoticiasBD', '{invalido');
    localStorage.setItem('nexoNoticiasFavoritos', '{invalido');
  });
  let requests = 0;
  page.on('request', (request) => {
    if (request.url().endsWith('/src/data/noticias.json')) requests++;
  });
  await page.goto(base + '/noticias');
  await expect(page.locator('.news-card').first()).toBeVisible();
  await page.locator('.news-card__action').first().click();
  await expect(page.locator('h1')).toBeVisible();
  await page.locator('.detail-back').click();
  await expect(page.locator('.news-card').first()).toBeVisible();
  expect(requests).toBe(1);
  expect(
    await page.evaluate(() => Array.isArray(JSON.parse(localStorage.getItem('nexoNoticiasBD')!))),
  ).toBeTruthy();
});

test('imagen ausente usa el recurso local de respaldo', async ({ page }) => {
  await page.route('**/src/data/noticias.json', async (route) => {
    const response = await route.fetch();
    const news = await response.json();
    news[0].imagen = '/imagen-ausente.jpg';
    await route.fulfill({ json: news });
  });
  await page.goto(base + '/detalle?id=1');
  await expect(page.locator('.detail-media img')).toHaveAttribute('src', /educacion\.jpg$/);
  await expect
    .poll(() =>
      page.locator('.detail-media img').evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
});

test('formularios rechazan espacios y no guardan registros vacíos', async ({ page }) => {
  await page.goto(base + '/contacto');
  await page.locator('#nombre').fill('   ');
  await page.locator('#correo').fill('camilo@example.com');
  await page.locator('#mensaje').fill('            ');
  await page.locator('#formContacto button[type=submit]').click();
  await expect(page.locator('#errorNombre')).toBeVisible();
  await expect(page.locator('#errorMensaje')).toBeVisible();
  await expect(page.locator('#mensajeExito')).not.toBeVisible();
  await page.goto(base + '/admin');
  await page.locator('#btnNuevaNoticia').click();
  for (const field of ['titulo', 'autor', 'resumen', 'contenido'])
    await page.locator('#' + field).fill('   ');
  const count = await page.evaluate(
    () => JSON.parse(localStorage.getItem('nexoNoticiasBD')!).length,
  );
  await page.locator('#btnSubmitAdmin').click();
  await expect(page.locator('#formAdminPanel')).toBeVisible();
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('nexoNoticiasBD')!).length),
  ).toBe(count);
});

test('detalle mantiene lectura sin superposición al cambiar el ancho', async ({ page }) => {
  await page.goto(base + '/detalle?id=1');
  for (const width of [390, 768, 1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(async () =>
        page.evaluate(() => {
          const copy = document.querySelector('.detail-copy')!.getBoundingClientRect();
          const text = document.querySelector('.detail-text')!.getBoundingClientRect();
          const related = document.querySelector('.detail-related')!.getBoundingClientRect();
          return text.top >= copy.bottom && (!related.width || related.top >= text.bottom);
        }),
      )
      .toBeTruthy();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    ).toBeTruthy();
  }
});
