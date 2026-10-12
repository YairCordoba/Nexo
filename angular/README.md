# Nexo en Angular

Migración de las seis vistas del prototipo HTML a Angular 22.2.2. Requiere Node 26 y npm. La versión anterior se conserva en la raíz del repositorio para comparar su presentación y funcionamiento.

## Ejecución

Desde esta carpeta:

```sh
npm ci
npm start
```

Angular queda en http://localhost:4200. Para abrir la versión anterior, ejecutar `python3 -m http.server 3000` desde la raíz de Nexo: http://localhost:3000.

```sh
npm run build
npx playwright install chromium
npm run test:e2e
npx playwright show-report
```

Las pruebas requieren ambos servidores activos. El resultado de producción queda en `dist/nexo/browser`. Los recursos compartidos se incluyen mediante los enlaces relativos `public/src/assets` y `public/src/data`; el build copia su contenido. Así ambas aplicaciones usan el mismo JSON, imágenes y fuentes, sin duplicarlos.

## Organización

- `src/app/app.routes.ts`: rutas y carga de cada vista.
- `src/app/core`: modelo de noticia y servicio de datos, caché y favoritos.
- `src/app/shared`: cabecera, pie y tarjeta de noticias.
- `src/app/pages`: inicio, noticias, detalle, favoritos, contacto y administración.
- `src/styles.css`: fuentes, tokens, reset, tipografía, botones, campos y reglas de layout compartidas.
- Los CSS de cada componente contienen sus reglas visuales y adaptaciones móviles. La encapsulación de Angular evita que esas reglas afecten otras vistas.
- `e2e`: pruebas de comportamiento y comparación con el prototipo.

Las plantillas usan interpolación, property binding, event binding, `@if` y `@for`. Los formularios reactivos validan los campos antes de procesarlos. El servicio y los componentes usan señales para actualizar la interfaz después de una interacción; los parámetros `id` y `categoria` se leen mediante el router.

## GitHub Pages

`npm run build:pages` genera el sitio con base `/Nexo/`. En producción las rutas usan fragmentos (`#/noticias`, `#/detalle?id=1`) para que los enlaces y la recarga funcionen en un servidor estático. El desarrollo local conserva las rutas habituales. El build también genera redirecciones para los enlaces HTML anteriores, conservando sus parámetros. El workflow `.github/workflows/angular-pages.yml` compila con Node 26 y publica desde `main`. Un administrador debe configurar Pages con origen GitHub Actions y permitir esa rama en el entorno `github-pages`.

## Persistencia

El JSON local proporciona las noticias iniciales. Las modificaciones y favoritos se conservan en `localStorage`, sin escribir al archivo JSON. El contacto confirma la validación de los datos y aclara que no envía correo. Los puertos 3000 y 4200 tienen almacenamiento separado: para comparar una operación hay que realizarla en ambas versiones.

Las regresiones cubren todos los favoritos y registros administrativos, edición y eliminación con persistencia, fechas de calendario en cuatro zonas horarias, orden cronológico de últimas noticias, búsqueda y filtros, navegación móvil y formularios. Las comparaciones visuales conservan los estilos compartidos del prototipo; no exigen reproducir sus errores funcionales. Para comprobar también los enlaces HTML estáticos, indicar `PAGES_URL` al ejecutar las pruebas contra el build servido localmente.

La documentación de decisiones y comprobaciones está en `PARIDAD.md`. Los comentarios en el código se limitan a rutas, almacenamiento y decisiones de presentación que no se deducen del nombre de una función.
