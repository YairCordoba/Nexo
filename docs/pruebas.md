# Plan de Pruebas

## Casos de Prueba Manuales

1. **CP-01: Carga de Datos Iniciales**
   - **Acción:** Abrir la aplicación por primera vez en modo incógnito.
   - **Resultado Esperado:** La aplicación debe leer `noticias.json` correctamente y poblar el `localStorage`. Las noticias destacadas deben mostrarse en el inicio.

2. **CP-02: Filtrado por Categoría**
   - **Acción:** Ir a la vista Noticias y hacer clic en el botón "Tecnología".
   - **Resultado Esperado:** La grilla solo muestra tarjetas cuya categoría sea "Tecnología".

3. **CP-03: Funcionalidad de Búsqueda**
   - **Acción:** En la vista Noticias, ingresar "educativos" en la barra de búsqueda.
   - **Resultado Esperado:** Solo debe aparecer la noticia cuyo título o descripción contenga esa palabra.

4. **CP-04: Gestión de Favoritos**
   - **Acción:** Marcar una estrella en cualquier noticia. Recargar la página (F5) e ir a la vista "Favoritos".
   - **Resultado Esperado:** La estrella sigue marcada después de recargar. La noticia aparece en el listado de Favoritos.

5. **CP-05: Creación de Noticia (Admin)**
   - **Acción:** Ir a la vista Administración, completar los campos válidos y presionar "Guardar".
   - **Resultado Esperado:** Aparece un alert de éxito, el formulario se limpia, la noticia aparece inmediatamente en el listado inferior, y al ir a "Inicio" o "Noticias" la nueva noticia es visible.
