# Modelo de Datos

El sistema utiliza un arreglo de objetos JSON para representar las noticias.

## Entidad: Noticia

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | Entero | Identificador único de la noticia. |
| `titulo` | String | El titular principal de la noticia. |
| `categoria` | String | Puede ser: Educación, Tecnología, Turismo, Comercio. |
| `imagen` | String | URL o path relativo hacia la imagen representativa. |
| `resumen` | String | Breve descripción que aparece en las tarjetas. |
| `contenido`| String | El texto completo del artículo. |
| `autor` | String | Nombre del redactor o periodista. |
| `fecha` | String | Fecha de publicación en formato YYYY-MM-DD. |
| `destacada`| Booleano | Determina si la noticia debe aparecer en la sección Hero/Destacados del Inicio. |

## Estructura LocalStorage

- `nexoNoticiasBD`: Guarda el arreglo JSON completo de todas las noticias (incluyendo las agregadas por el Admin).
- `nexoNoticiasFavoritos`: Guarda un arreglo JSON que contiene únicamente los objetos de noticia marcados como favoritos por el usuario actual.
