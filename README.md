# Nexo Noticias

Proyecto web académico tipo periódico digital enfocado en: Educación, Tecnología, Turismo y Comercio.

## Características

- **Diseño Editorial:** Interfaz neutra, limpia y profesional.
- **Responsivo:** Adaptable a dispositivos móviles, tablets y escritorios.
- **Vistas Completas:** Inicio, Listado de Noticias, Detalle, Favoritos, Contacto y un módulo de Administración.
- **Datos y caché:** Carga inicial desde `src/data/noticias.json`, caché en memoria por página y caché persistente versionada en `localStorage`.
- **Imágenes editoriales:** Fotografías stock descargadas y servidas localmente en `src/assets/images/stock/`; las fuentes y licencia están documentadas en `SOURCES.md`.
- **Tipografías locales:** Inter y Newsreader se sirven desde `src/assets/fonts/` para evitar dependencias de red durante el render inicial.
- **Alcance de entrega:** esta rama implementa el prototipo de HTML, CSS y JavaScript; Angular corresponde a la entrega final.

## Estructura de Directorios

\`\`\`text
nexo-noticias/
├── index.html          # Página principal
├── src/
│   ├── assets/images/  # Recursos visuales locales
│   ├── css/            # Hojas de estilo
│   ├── js/             # Lógica de la aplicación
│   ├── data/           # Archivo JSON con datos
│   └── pages/          # Vistas (noticias, contacto, detalle, etc.)
└── docs/               # Documentación y mockups (Draw.io)
\`\`\`

## Cómo Ejecutar

Para un funcionamiento correcto (debido al uso de `fetch()` para el JSON), se requiere abrir el proyecto mediante un servidor local.

**Usando VS Code:**
1. Instala la extensión **Live Server**.
2. Haz clic derecho sobre `index.html` y selecciona **Open with Live Server**.

**Usando Python (sin dependencias adicionales):**
1. Ejecuta `python3 -m http.server 3000` en la carpeta raíz del proyecto.
2. Abre [http://localhost:3000](http://localhost:3000).

**Usando Node.js:**
1. Ejecuta `npx serve .` en la carpeta raíz del proyecto.
2. Abre la URL proporcionada en tu navegador.

## Alcance de la segunda entrega

Esta versión corresponde al prototipo funcional de la semana 5: HTML, CSS y JavaScript, carga dinámica desde `src/data/noticias.json`, favoritos persistidos en `localStorage`, formulario de contacto con validaciones y gestión básica de noticias. La migración a Angular corresponde a la entrega final de la semana 7.

## Autor

Proyecto desarrollado como demostración académica para cumplir con los requerimientos de Ingeniería de Requisitos y Diseño de Interfaz.
