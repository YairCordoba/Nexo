# Requisitos - Plataforma Web de Noticias

**Proyecto:** Nexo Noticias
**Responsable de la revisión:** Camilo Andres Escobar Mazo
**Correo:** camilo.escobar2@utp.edu.co
**Fuente:** *Orientaciones para las entregas del módulo Front End*, agosto de 2026

## 1. Propósito y alcance

Este documento consolida únicamente los requisitos contenidos en las orientaciones del tutor. Las ideas y tecnologías recomendadas se presentan por separado para no confundirlas con obligaciones de la entrega.

La aplicación será una plataforma web de noticias educativas, tecnológicas, turísticas o comerciales. Permitirá explorar noticias, consultar su detalle y realizar interacciones básicas de favoritos, contacto y gestión de contenido.

## 2. Actores

- **Usuario:** explora noticias, consulta detalles, gestiona favoritos y utiliza el formulario de contacto.
- **Responsable de contenido:** crea y elimina noticias mediante el mini CRUD. Las orientaciones no exigen autenticación ni administración de roles.

## 3. Requisitos funcionales

| ID | Requisito | Criterio de aceptación |
| :--- | :--- | :--- |
| RF-01 | El sistema debe mostrar un catálogo de noticias mediante tarjetas. | Cada tarjeta presenta imagen, nombre o título, descripción breve y una acción para ver más. |
| RF-02 | El usuario debe poder consultar el detalle de una noticia. | El detalle muestra información completa, imagen representativa y una acción para agregar a favoritos o contactar. |
| RF-03 | El usuario debe poder gestionar noticias favoritas. | El usuario puede guardar noticias y visualizar su lista personalizada. Los datos se conservan mediante `localStorage` o `sessionStorage`. |
| RF-04 | La aplicación debe disponer de una página de inicio. | El Home incluye header con menú, bienvenida, noticias destacadas, llamados a la acción y footer con información general. |
| RF-05 | La aplicación debe disponer de una página de contacto. | El formulario valida campos obligatorios y un correo válido; después de un envío aceptado muestra confirmación. |
| RF-06 | La aplicación debe ofrecer gestión básica de noticias. | El mini CRUD permite crear nuevas noticias y eliminar noticias existentes. |
| RF-07 | El prototipo funcional debe cargar las noticias dinámicamente. | En la semana 5, las noticias se obtienen desde un archivo JSON local y se representan en la interfaz. |

## 4. Requisitos no funcionales y técnicos

| ID | Requisito | Entrega asociada |
| :--- | :--- | :--- |
| RNF-01 | La interfaz debe mantener un diseño moderno, intuitivo y coherente entre sus vistas. | Semanas 3, 5 y 7. |
| RNF-02 | La maquetación aprobada debe corresponder con el desarrollo posterior. | Semanas 5 y 7. |
| RNF-03 | El prototipo debe organizar por separado los archivos HTML, CSS, JavaScript, imágenes y demás recursos necesarios. | Semana 5. |
| RNF-04 | El código fuente debe estar estructurado y comentado. | Semanas 5 y 7. |
| RNF-05 | Las páginas deben poder visualizarse desde navegadores web. | Semanas 5 y 7. |
| RNF-06 | La entrega final debe incorporar uso básico de Angular mediante componentes y binding. | Semana 7. |
| RNF-07 | La aplicación final debe publicarse en GitHub Pages, Netlify, Vercel u otro servidor gratuito. | Semana 7. |

## 5. Entregables

### Entrega 1 - Maquetación, semana 3

- Mockups del aplicativo en Figma u otra herramienta.
- Diseño de Home, listado de noticias, detalle y contacto.
- Descripción de la funcionalidad y los elementos de cada vista.
- Documento final en PDF siguiendo normas APA.
- Mockups incluidos dentro del informe.
- Referencias bibliográficas y conclusiones.

Las cuatro vistas anteriores son las maquetas expresamente solicitadas. Favoritos y mini CRUD deben describirse como funcionalidades; sus pantallas pueden añadirse si el equipo decide mostrar esos recorridos, pero no sustituyen las cuatro vistas obligatorias.

### Entrega 2 - Prototipo funcional, semana 5

- Desarrollo con HTML, CSS y JavaScript.
- Renderizado dinámico de noticias desde JSON.
- Funcionalidad de favoritos.
- Formulario con validaciones.
- Código estructurado y repositorio en GitHub.
- Documento PDF que incluya la maquetación, el código fuente y la URL accesible del repositorio.
- Tabla de contenido, referencias bibliográficas y conclusiones.

### Entrega 3 - Entrega final, semana 7

- Aplicación funcional completa.
- Implementación básica de Angular con componentes y binding.
- Código organizado y documentado.
- Aplicación desplegada y URL del proyecto incluida en el informe.
- Documento final en PDF bajo normas APA con funcionamiento y tecnologías utilizadas.
- Tabla de contenido, referencias bibliográficas y conclusiones.
- Video explicativo de máximo tres minutos mediante enlace de YouTube.

## 6. Recomendaciones de las orientaciones

Los siguientes elementos aparecen como ideas o tecnologías recomendadas. Son útiles, pero no deben presentarse como requisitos obligatorios sin confirmación del tutor:

- Utilizar Figma para la maquetación.
- Incorporar un encabezado atractivo con el nombre del aplicativo.
- Usar un menú claro de al menos cinco páginas.
- Añadir testimonios o una sección informativa.
- Mantener visible la información de contacto.
- Utilizar Bootstrap o Tailwind CSS.
- Usar un archivo JSON local y `localStorage` o `sessionStorage`.

## 7. Trazabilidad de la maquetación

| Vista obligatoria | Requisitos representados |
| :--- | :--- |
| Home | RF-01 y RF-04. |
| Listado de noticias | RF-01 y RF-07. |
| Detalle | RF-02 y RF-03. |
| Contacto | RF-05. |

## 8. Elementos no exigidos por las orientaciones

Las siguientes funciones pueden considerarse mejoras futuras, pero no forman parte del alcance obligatorio identificado en la fuente:

- Búsqueda de noticias.
- Filtros interactivos por categoría.
- Edición de noticias.
- Creación oculta mediante la palabra `nexoadd`.
- Autenticación o gestión de roles.
- Backend o base de datos remota.

Si el equipo decide conservar alguna de estas funciones, debe documentarla como propuesta propia sin modificar ni renumerar los requisitos anteriores.
