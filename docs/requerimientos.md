# Documentación de Requisitos

## Requisitos Funcionales

* **RF-01** — El sistema debe permitir visualizar las noticias destacadas en la página de inicio.
* **RF-02** — El sistema debe permitir ver una lista completa de noticias.
* **RF-03** — El sistema debe permitir filtrar noticias por categorías (Educación, Tecnología, Turismo, Comercio).
* **RF-04** — El sistema debe permitir buscar noticias mediante una barra de búsqueda por texto.
* **RF-05** — El sistema debe permitir consultar el detalle completo de cada noticia (título, imagen, autor, contenido).
* **RF-06** — El sistema debe permitir agregar y eliminar noticias de una lista de "Favoritos".
* **RF-07** — El sistema debe persistir los favoritos utilizando `localStorage` para que no se pierdan al recargar.
* **RF-08** — El sistema debe proveer un formulario de contacto con validaciones.
* **RF-09** — El sistema debe proveer un panel de administración para crear nuevas noticias y leer las existentes.
* **RF-10** — El sistema debe permitir editar (modificar) los datos de noticias existentes.
* **RF-11** — El sistema debe permitir eliminar noticias existentes desde el panel administrativo previa confirmación.
* **RF-12** — Debe existir un método oculto por palabra clave ("nexoadd") para agregar noticias rápidamente.

## Requisitos No Funcionales

* **RNF-01** — La aplicación debe ser responsive, adaptándose a móviles, tablets y desktop.
* **RNF-02** — El código fuente debe utilizar HTML5 semántico (`<header>`, `<main>`, `<article>`, etc).
* **RNF-03** — Debe ser compatible con los navegadores modernos (Chrome, Firefox, Safari, Edge).
* **RNF-04** — La interfaz de usuario debe tener una estética neutra, editorial y evitar excesos de animaciones o elementos artificiales.
* **RNF-05** — El código debe estar organizado en módulos JavaScript (`utils.js`, `app.js`, etc.) y archivos CSS separados.

## Historias de Usuario

1. **Como** visitante, **quiero** ver las noticias más importantes en el inicio **para** enterarme rápidamente de la actualidad.
2. **Como** lector, **quiero** filtrar por categoría "Tecnología" **para** leer solo sobre mis temas de interés.
3. **Como** usuario, **quiero** guardar una noticia en favoritos **para** leerla más tarde con calma.
4. **Como** usuario, **quiero** usar el buscador **para** encontrar noticias sobre un tema específico rápidamente.
5. **Como** usuario recurrente, **quiero** que mis favoritos sigan ahí al volver a entrar **para** no perder mi colección.
6. **Como** visitante, **quiero** llenar un formulario de contacto **para** enviar sugerencias al equipo.
7. **Como** administrador, **quiero** crear una noticia nueva **para** mantener el sitio actualizado.
8. **Como** administrador, **quiero** borrar una noticia **para** eliminar contenido obsoleto o erróneo.
9. **Como** lector de móvil, **quiero** un menú adaptable **para** navegar fácilmente desde mi celular.
10. **Como** lector, **quiero** ver quién escribió la noticia y la fecha **para** evaluar la relevancia de la información.
