# Nexo Noticias

Proyecto web académico tipo periódico digital enfocado en: Educación, Tecnología, Turismo y Comercio.

## Características

- **Diseño Editorial:** Interfaz neutra, limpia y profesional.
- **Responsivo:** Adaptable a dispositivos móviles, tablets y escritorios.
- **Vistas Completas:** Inicio, Listado de Noticias, Detalle, Favoritos, Contacto y un módulo de Administración.
- **Almacenamiento Local:** Persistencia temporal utilizando `localStorage` y carga inicial desde `JSON`.
- **Preparado para Angular:** Arquitectura limpia diseñada para facilitar la futura migración a un framework de componentes.

## Estructura de Directorios

\`\`\`text
nexo-noticias/
├── index.html          # Página principal
├── src/
│   ├── css/            # Hojas de estilo
│   ├── js/             # Lógica de la aplicación
│   ├── data/           # Archivo JSON con datos
│   ├── images/         # Imágenes de prueba/mock
│   └── pages/          # Vistas (noticias, contacto, detalle, etc.)
├── docs/               # Documentación y mockups (Draw.io)
└── angular/            # Directorio preparado para migración futura
\`\`\`

## Cómo Ejecutar

Para un funcionamiento correcto (debido al uso de `fetch()` para el JSON), se requiere abrir el proyecto mediante un servidor local.

**Usando VS Code:**
1. Instala la extensión **Live Server**.
2. Haz clic derecho sobre `index.html` y selecciona **Open with Live Server**.

**Usando Node.js:**
1. Ejecuta `npx serve .` en la carpeta raíz del proyecto.
2. Abre la URL proporcionada en tu navegador (usualmente `http://localhost:3000`).

## Autor

Proyecto desarrollado como demostración académica para cumplir con los requerimientos de Ingeniería de Requisitos y Diseño de Interfaz.
