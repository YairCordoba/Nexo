import { test, expect, Page } from '@playwright/test';

const oldBase = process.env.LEGACY_URL || 'http://localhost:3000';
const newBase = process.env.ANGULAR_URL || 'http://localhost:4200';
const routes = [
  ['inicio', '/index.html', '/'],
  ['noticias', '/src/pages/noticias.html', '/noticias'],
  ['detalle', '/src/pages/detalle.html?id=1', '/detalle?id=1'],
  ['favoritos', '/src/pages/favoritos.html', '/favoritos'],
  ['contacto', '/src/pages/contacto.html', '/contacto'],
  ['admin', '/src/pages/admin.html', '/admin'],
] as const;

async function settle(page: Page) {
  await page.locator('main').waitFor();
  await page.waitForFunction(() => !document.body.innerText.includes('Cargando'));
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.querySelectorAll('img').forEach((image) => (image.loading = 'eager'));
    await Promise.all(Array.from(document.images).map((image) => image.decode().catch(() => {})));
  });
}

async function measure(page: Page) {
  return page.evaluate(() => {
    const selectors = [
      'body',
      'header',
      '.navbar',
      'main',
      'h1',
      '.news-card',
      '.contact-form',
      '.admin-stats',
      '.detail-copy',
      '.detail-text',
      '.detail-related',
      '.detail-back',
      'footer',
    ];
    return selectors.flatMap((selector) =>
      Array.from(document.querySelectorAll(selector)).flatMap((element, index) => {
        const rect = element.getBoundingClientRect();
        const css = getComputedStyle(element);
        if (!rect.width || !rect.height) return [];
        return [
          {
            key: `${selector}:${index}`,
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            fontSize: css.fontSize,
            fontFamily: css.fontFamily,
            color: css.color,
            background: css.backgroundColor,
            borderRadius: css.borderRadius,
            text: element.matches('h1, .news-card')
              ? (element as HTMLElement).innerText.replace(/\s+/g, ' ').trim()
              : '',
          },
        ];
      }),
    );
  });
}

// Se comparan posiciones con 2 px de margen por redondeo de fuentes y navegador.
for (const width of [390, 768, 1280]) {
  for (const [name, legacy, angular] of routes) {
    test(`paridad ${name} ${width}px`, async ({ browser }, testInfo) => {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
      });
      const oldPage = await context.newPage();
      const newPage = await context.newPage();
      // La vista antigua calcula posiciones una vez; precargar las fuentes evita medir tipografía provisional.
      for (const page of [oldPage, newPage]) {
        await page.route('**/src/data/noticias.json', async (route) => {
          await page.evaluate(async () => {
            await Promise.all(
              ['Inter', 'Newsreader'].flatMap((family) =>
                [400, 500, 600, 700].map((weight) =>
                  document.fonts.load(`${weight} 16px ${family}`),
                ),
              ),
            );
          });
          await route.continue();
        });
      }
      const errors: string[] = [];
      newPage.on('pageerror', (error) => errors.push(error.message));
      await Promise.all([oldPage.goto(oldBase + legacy), newPage.goto(newBase + angular)]);
      const readySelector =
        name === 'inicio' || name === 'noticias'
          ? '.news-card'
          : name === 'admin'
            ? '.admin-row'
            : name === 'detalle'
              ? 'h1'
              : null;
      if (readySelector)
        await Promise.all([
          oldPage.locator(readySelector).first().waitFor(),
          newPage.locator(readySelector).first().waitFor(),
        ]);
      await Promise.all([settle(oldPage), settle(newPage)]);
      const [baseline, migrated] = await Promise.all([measure(oldPage), measure(newPage)]);
      await testInfo.attach('mediciones', {
        body: JSON.stringify({ baseline, migrated }, null, 2),
        contentType: 'application/json',
      });
      for (const [page, label] of [
        [oldPage, 'original'],
        [newPage, 'angular'],
      ] as const) {
        const screenshotPath = testInfo.outputPath(`${label}.png`);
        await page.screenshot({ fullPage: true, path: screenshotPath });
        await testInfo.attach(label, {
          path: screenshotPath,
          contentType: 'image/png',
        });
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        ).toBeTruthy();
      }
      expect(migrated.map((item) => item.key)).toEqual(baseline.map((item) => item.key));
      for (const source of baseline) {
        const target = migrated.find((item) => item.key === source.key)!;
        for (const field of ['x', 'y', 'width', 'height'] as const)
          expect(
            Math.abs(source[field] - target[field]),
            `${source.key} ${field}`,
          ).toBeLessThanOrEqual(2);
        for (const field of [
          'fontSize',
          'fontFamily',
          'color',
          'background',
          'borderRadius',
          'text',
        ] as const)
          expect(target[field], `${source.key} ${field}`).toEqual(source[field]);
      }
      await context.close();
      expect(errors).toEqual([]);
    });
  }
}
