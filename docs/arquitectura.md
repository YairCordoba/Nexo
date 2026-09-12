# Arquitectura del Sistema

## Visión General
Nexo Noticias está construido sobre una arquitectura **Client-Side (Front-End) pura**, diseñada para ser escalable y modular, preparándola para una futura migración a Angular.

## Separación de Responsabilidades
- **Vistas (HTML):** Páginas estáticas y contenedores semánticos (`src/pages/`).
- **Estilos (CSS):** Dividido en variables globales (`styles.css`), componentes reutilizables (`components.css`) y media queries (`responsive.css`).
- **Controladores (JS):** Archivos separados por dominio funcional (`app.js`, `noticias.js`, `admin.js`, etc.).
- **Datos (JSON):** `noticias.json` sirve como mock base de datos.
- **Almacenamiento Local:** `localStorage` se utiliza para emular una persistencia de estado para favoritos y las operaciones CRUD del administrador.

## Flujo de Datos
1. Al cargar la aplicación, `utils.js` (a través de `obtenerNoticias`) verifica si existe el registro `nexoNoticiasBD` en `localStorage`.
2. Si no existe, realiza un `fetch` a `noticias.json` y lo guarda en `localStorage`.
3. Todos los demás módulos interactúan con la capa de datos a través de `utils.js`, garantizando consistencia.
