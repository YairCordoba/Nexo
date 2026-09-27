const FAV_STORAGE_KEY = 'nexoNoticiasFavoritos';

function obtenerFavoritos() {
    return leerArregloLocal(FAV_STORAGE_KEY);
}

function agregarFavorito(noticia) {
    const favoritos = obtenerFavoritos();
    if (!favoritos.some((favorito) => favorito.id === noticia.id)) {
        favoritos.push(noticia);
        localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favoritos));
        return true;
    }
    return false;
}

function eliminarFavorito(id) {
    const favoritos = obtenerFavoritos().filter((favorito) => favorito.id !== parseInt(id, 10));
    localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favoritos));
}

function esFavorito(id) {
    return obtenerFavoritos().some((favorito) => favorito.id === parseInt(id, 10));
}

function toggleFavorito(noticia, btnElement) {
    const guardado = esFavorito(noticia.id);
    if (guardado) eliminarFavorito(noticia.id);
    else agregarFavorito(noticia);

    const activo = !guardado;
    btnElement.classList.toggle('active', activo);
    btnElement.innerHTML = activo ? '♥' : '♡';
    btnElement.title = activo ? 'Quitar de favoritos' : 'Agregar a favoritos';
    btnElement.setAttribute('aria-label', btnElement.title);
    btnElement.setAttribute('aria-pressed', String(activo));
}

function formatearMeta(fecha) {
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const date = new Date(fecha);
    if (Number.isNaN(date.getTime())) return '';
    return `${String(date.getDate()).padStart(2, '0')} ${meses[date.getMonth()]} ${date.getFullYear()}`;
}

function crearTarjetaNoticia(noticia, baseUrl = '', variant = 'list') {
    const esFav = esFavorito(noticia.id);
    const activeClass = esFav ? 'active' : '';
    const cardClass = variant === 'home' ? 'news-card news-card--home' : 'news-card';
    const resumen = noticia.resumen || noticia.contenido || '';
    const imagen = obtenerImagenUrl(noticia, baseUrl);

    return `
        <article class="${cardClass}" data-id="${noticia.id}">
            <button class="btn-fav ${activeClass}" type="button" data-id="${noticia.id}"
                    title="${esFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
                    aria-label="${esFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
                    aria-pressed="${esFav}">${esFav ? '♥' : '♡'}</button>
            <img class="news-card__image" src="${imagen}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${obtenerImagenUrl({}, baseUrl)}'">
            <div class="news-card__meta">${formatearMeta(noticia.fecha)}</div>
            <h3 class="news-card__title"><a href="${baseUrl}src/pages/detalle.html?id=${noticia.id}">${noticia.titulo}</a></h3>
            <p class="news-card__body">${resumen}</p>
            <a class="news-card__action" href="${baseUrl}src/pages/detalle.html?id=${noticia.id}">Ver más</a>
        </article>
    `;
}

async function manejadorFavorito(btnElement, id) {
    const noticia = await obtenerNoticiaPorId(id);
    if (!noticia) return;
    toggleFavorito(noticia, btnElement);
    if (window.location.pathname.includes('favoritos.html')) renderizarPaginaFavoritos();
}

document.addEventListener('click', (event) => {
    const btnElement = event.target.closest('.btn-fav[data-id]');
    if (!btnElement) return;
    event.preventDefault();
    manejadorFavorito(btnElement, btnElement.dataset.id);
});

async function renderizarPaginaFavoritos() {
    const contenedor = document.getElementById('contenedorFavoritos');
    const mensajeVacio = document.getElementById('mensajeVacioFavs');
    if (!contenedor) return;

    const favoritos = obtenerFavoritos();
    const baseUrl = getBaseUrl();
    if (!favoritos.length) {
        contenedor.innerHTML = '';
        if (mensajeVacio) mensajeVacio.style.display = 'block';
        return;
    }

    if (mensajeVacio) mensajeVacio.style.display = 'none';
    contenedor.innerHTML = favoritos.slice(0, 3).map((favorito) => crearTarjetaNoticia(favorito, baseUrl, 'favorite')).join('');
}

if (window.location.pathname.includes('favoritos.html')) {
    document.addEventListener('DOMContentLoaded', renderizarPaginaFavoritos);
}
