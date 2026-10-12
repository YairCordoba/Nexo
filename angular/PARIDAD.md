# Registro de paridad de la migración

Base revisada: `3193a640dec25bebdf1e837553a978339da4e5d0`, contenido de `origin/main` integrado en la rama local. Fecha: 11 de octubre de 2026. La referencia de estas pruebas es el prototipo actual; no constituye una nueva auditoría del archivo Figma.

## Correspondencia de vistas

| Prototipo HTML                 | Ruta Angular    | Componente         | Comportamiento conservado                           |
| ------------------------------ | --------------- | ------------------ | --------------------------------------------------- |
| `/index.html`                  | `/`             | HomeComponent      | Noticia destacada, tres tarjetas, enlaces y pie     |
| `/src/pages/noticias.html`     | `/noticias`     | NewsComponent      | Orden por fecha, filtros y búsqueda existente       |
| `/src/pages/detalle.html?id=1` | `/detalle?id=1` | DetailComponent    | Lectura, imagen, relacionadas y regreso al listado  |
| `/src/pages/favoritos.html`    | `/favoritos`    | FavoritesComponent | Guardar, retirar y persistir noticias               |
| `/src/pages/contacto.html`     | `/contacto`     | ContactComponent   | Nombre, correo, mensaje y confirmación simulada     |
| `/src/pages/admin.html`        | `/admin`        | AdminComponent     | Estadísticas, creación, edición y eliminación local |

Los enlaces HTML anteriores también redirigen a las rutas Angular y conservan sus parámetros. Cabecera, pie y tarjetas se reutilizan como componentes. El detalle y la administración conservan la ausencia de pie. En móvil, contacto conserva la cabecera y oculta su pie, conforme al último cambio de main.

## Estilos

| Origen                    | Destino                                                       | Criterio                                                                         |
| ------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `src/css/styles.css`      | `angular/src/styles.css` y CSS de inicio/pie                  | Tokens, fuentes y reglas generales globales; presentación específica encapsulada |
| `src/css/components.css`  | CSS de cabecera, tarjetas, detalle, contacto y administración | Cada componente es responsable de su geometría                                   |
| `src/css/responsive.css`  | Media queries globales y de cada componente                   | Se conserva el breakpoint de 699 px                                              |
| `src/assets` y `src/data` | Assets de Angular desde enlaces relativos                     | Se mantienen exactamente los recursos de la referencia                           |

Los hosts usan `display: contents` para que la introducción de componentes no agregue cajas al layout. Las reglas compartidas de botones, campos, retículas, feedback y foco permanecen globales. El logo del pie tiene sus propios estilos porque los de la cabecera están encapsulados.

## Funcionalidad y diferencias justificadas

- Las claves de caché y favoritos se mantienen, pero el navegador separa el almacenamiento por puerto. No se espera compartir los cambios entre las dos URLs.
- Crear/editar valida también texto compuesto únicamente por espacios. Contacto conserva mínimos de 3 y 10 caracteres y formato de correo.
- El menú activo se actualiza después de navegar mediante una señal vinculada a `NavigationEnd`. La navegación usa Angular Router y no recarga el documento.
- Los fallos de carga muestran feedback, en vez de dejar una pantalla cargando indefinidamente.
- Los comentarios son breves, en español y describen decisiones concretas. No contienen emojis ni encabezados decorativos.

## Límites heredados

Administración y favoritos persisten solo en el navegador. Contacto no envía mensajes a un servidor. Administración muestra tres noticias recientes; favoritos muestra hasta tres. Los estados editoriales se calculan desde la marca destacada y el índice, no desde un flujo real de publicación. Comercio no aparece entre los filtros visibles y la búsqueda permanece oculta. No se añadió autenticación porque no existe en el prototipo.

## Verificación

La suite de Playwright compara seis vistas a 390, 768 y 1280 px: geometría con tolerancia de 2 px, tipografía, colores, bordes, texto y desbordamiento. Guarda capturas completas de ambas versiones y mediciones JSON como adjuntos del reporte HTML. Los escenarios funcionales comprueban navegación SPA, menú activo, filtros, favoritos, validación de contacto y CRUD con recarga.

Resultado: 28 pruebas aprobadas; 18 comparaciones de paridad y 10 escenarios funcionales. La compilación de producción verifica TypeScript y las plantillas Angular con opciones estrictas y terminó correctamente.

Para comparar la presentación final se precargan las fuentes antes de permitir la respuesta del JSON en ambas aplicaciones. Esto evita que el cálculo único del detalle HTML mida una fuente provisional. Las imágenes con carga diferida se cargan en el entorno de pruebas antes de capturar. Estas medidas no modifican el código del prototipo. Angular, además, recalcula el detalle al cargar las fuentes, cambiar noticia o redimensionar la ventana mediante un observador que se libera al destruir el componente.

| Validación                                               | Resultado                                         |
| -------------------------------------------------------- | ------------------------------------------------- |
| Seis vistas a 390, 768 y 1280 px                         | 18 casos aprobados, tolerancia geométrica de 2 px |
| Menú activo móvil y navegación sin recarga               | Aprobado                                          |
| Filtros y favoritos persistentes                         | Aprobado                                          |
| Contacto: datos inválidos, válidos y espacios            | Aprobado                                          |
| Administración: crear, editar, eliminar y recargar       | Aprobado                                          |
| Enlaces HTML anteriores y cambio de detalle              | Aprobado                                          |
| ID inexistente y error del JSON                          | Aprobado                                          |
| Caché corrupta y una sola carga del catálogo entre rutas | Aprobado                                          |
| Imagen ausente con respaldo local                        | Aprobado                                          |
| Detalle al cambiar entre móvil, tablet y escritorio      | Aprobado, sin superposición de lectura            |
| Revisión independiente de Angular y documentación        | Sin hallazgos bloqueantes                         |

Capturas: `test-results/parity-paridad-{vista}-{ancho}px/original.png` y `angular.png`. Reporte con mediciones y capturas: `playwright-report/index.html`, disponible mediante `npx playwright show-report`. Las capturas de inicio móvil y noticias de escritorio también se inspeccionaron visualmente. Las pruebas validan las propiedades y elementos registrados; no certifican igualdad píxel por píxel de todo el sitio.
