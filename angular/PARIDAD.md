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

Administración y favoritos persisten solo en el navegador. Contacto no envía mensajes a un servidor y ahora lo indica explícitamente. No se añadió autenticación porque no existe en el prototipo.

La revisión funcional posterior elimina los límites de tres registros en administración y favoritos, los estados editoriales ficticios y la búsqueda oculta. Añade Comercio al filtro y enlaces a favoritos y gestión en la cabecera. Las fechas se interpretan como días de calendario, sin desplazamiento por zona horaria; últimas noticias se ordena por fecha descendente, con id descendente para resolver empates. Las estadísticas reflejan noticias, categorías y favoritos reales.

Estas correcciones cambian intencionalmente el contenido y la altura de algunas vistas. Las comparaciones actuales verifican estilos compartidos y geometría de cabecera y título, no la reproducción de los errores del prototipo. La cabecera colapsa antes de 900 px para acomodar sus seis enlaces; las demás adaptaciones mantienen sus breakpoints.

## Verificación

La suite de Playwright compara seis vistas a 390, 768 y 1280 px: geometría compartida con tolerancia de 2 px, tipografía, colores, bordes y desbordamiento. Guarda capturas completas de ambas versiones y mediciones JSON como adjuntos del reporte HTML. Los escenarios funcionales comprueban navegación SPA, menú activo, filtros, favoritos, validación de contacto y CRUD con recarga. Las regresiones amplían la cobertura a los doce registros, cuatro zonas horarias, creación cerca de medianoche, catálogo vacío, cancelación de eliminación y anchos de 320 a 1280 px.

Resultado histórico de la migración: 28 pruebas aprobadas. La suite ampliada tiene 43 casos: 18 comparaciones visuales, 10 escenarios funcionales y 15 regresiones. La compilación de producción verifica TypeScript y las plantillas Angular con opciones estrictas. Los enlaces HTML estáticos se prueban contra el build, además de las rutas internas de Angular.

La revisión funcional del 11 de octubre obtuvo 43 casos aprobados en desarrollo y 43 contra el build de Pages. Se ejecutaron controles negativos contra la versión publicada anterior: las pruebas detectaron los problemas de favoritos, fechas y orden de últimas noticias. Esto valida los escenarios cubiertos, no garantiza ausencia absoluta de cualquier defecto ni constituye una certificación de rendimiento o accesibilidad.

La validación posterior en GitHub Pages detectó una carrera con la carga inicial del JSON: crear antes de terminar la lectura podía perder el registro. Administración ahora bloquea la creación hasta tener el catálogo disponible. Una regresión con la respuesta retenida verifica el bloqueo y la persistencia al recargar; la suite pasa a 44 casos.

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
