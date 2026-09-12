# Casos de Uso

## UC-01: Explorar Noticias
- **Actor:** Visitante / Usuario
- **Descripción:** El usuario navega a la página de inicio o listado y visualiza las noticias disponibles.
- **Precondiciones:** El JSON de noticias debe estar disponible o cargado en localStorage.
- **Flujo Principal:**
  1. El usuario entra a `index.html`.
  2. El sistema muestra las noticias destacadas.
  3. El usuario hace clic en "Explorar noticias".
  4. El sistema redirige a `noticias.html` y muestra la grilla completa.

## UC-02: Gestionar Favoritos
- **Actor:** Usuario
- **Descripción:** El usuario marca o desmarca noticias como favoritas.
- **Flujo Principal:**
  1. El usuario visualiza una noticia en el listado o detalle.
  2. El usuario hace clic en el botón de estrella (☆).
  3. El sistema guarda la referencia en `localStorage`.
  4. El icono de la estrella cambia a activo (★).

## UC-03: Crear Noticia (Admin)
- **Actor:** Administrador
- **Descripción:** El administrador ingresa una nueva noticia al sistema.
- **Flujo Principal:**
  1. El administrador accede a `admin.html`.
  2. Rellena el formulario de creación.
  3. Hace clic en "Guardar Noticia".
  4. El sistema valida los datos y los persiste en `localStorage`.
  5. El sistema actualiza el listado visible de noticias existentes.
