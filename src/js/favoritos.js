/**
 * Módulo de Favoritos: favoritos.js
 * Maneja la lógica de localStorage para guardar las noticias favoritas.
 */

const FAV_STORAGE_KEY = 'nexoNoticiasFavoritos';

function obtenerFavoritos() {
    const favs = localStorage.getItem(FAV_STORAGE_KEY);
    return favs ? JSON.parse(favs) : [];
}

function agregarFavorito(noticia) {
    const favoritos = obtenerFavoritos();
    // Evitar duplicados
    if (!favoritos.find(f => f.id === noticia.id)) {
        favoritos.push(noticia);
        localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favoritos));
        return true; // agregado
    }
    return false; // ya existía
}

function eliminarFavorito(id) {
    let favoritos = obtenerFavoritos();
    favoritos = favoritos.filter(f => f.id !== parseInt(id));
    localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favoritos));
}

function esFavorito(id) {
    const favoritos = obtenerFavoritos();
    return favoritos.some(f => f.id === parseInt(id));
}

function toggleFavorito(noticia, btnElement) {
    if (esFavorito(noticia.id)) {
        eliminarFavorito(noticia.id);
        btnElement.classList.remove('active');
        btnElement.innerHTML = '☆';
        btnElement.title = "Agregar a favoritos";
    } else {
        agregarFavorito(noticia);
        btnElement.classList.add('active');
        btnElement.innerHTML = '★';
        btnElement.title = "Quitar de favoritos";
    }
}

// Función para renderizar una tarjeta de noticia HTML estándar
function crearTarjetaNoticia(noticia, baseUrl = '') {
    const esFav = esFavorito(noticia.id);
    const starIcon = esFav ? '★' : '☆';
    const activeClass = esFav ? 'active' : '';
    
    // Fallback image si no existe
    const imgUrl = noticia.imagen && noticia.imagen.trim() !== '' 
                   ? `${baseUrl}${noticia.imagen}` 
                   : 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&q=80';

    return `
        <article class="card">
            <div class="card-img-wrapper">
                <img src="${imgUrl}" alt="${noticia.titulo}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&q=80'">
            </div>
            <div class="card-content">
                <div class="card-meta">
                    <span class="card-category">${noticia.categoria}</span>
                    <span class="card-date">${formatearFecha(noticia.fecha)}</span>
                </div>
                <h3 class="card-title">${noticia.titulo}</h3>
                <p class="card-desc">${noticia.resumen}</p>
                <div class="card-actions">
                    <a href="${baseUrl}src/pages/detalle.html?id=${noticia.id}" class="btn btn-outline" style="padding: 0.3rem 0.8rem; font-size: 0.85rem;">Leer más</a>
                    <button class="btn-fav ${activeClass}" 
                            data-id="${noticia.id}" 
                            title="${esFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
                            onclick="manejadorFavorito(this, ${noticia.id})">
                        ${starIcon}
                    </button>
                </div>
            </div>
        </article>
    `;
}

// Manejador global para el botón de favoritos en tarjetas
async function manejadorFavorito(btnElement, id) {
    const noticia = await obtenerNoticiaPorId(id);
    if (noticia) {
        toggleFavorito(noticia, btnElement);
        
        // Si estamos en la página de favoritos, recargar la vista al quitar uno
        if (window.location.pathname.includes('favoritos.html')) {
            renderizarPaginaFavoritos();
        }
    }
}

// Lógica específica para la página de favoritos
async function renderizarPaginaFavoritos() {
    const contenedor = document.getElementById('contenedorFavoritos');
    const mensajeVacio = document.getElementById('mensajeVacioFavs');
    
    if (!contenedor) return;

    const favoritos = obtenerFavoritos();
    const baseUrl = getBaseUrl();
    
    if (favoritos.length === 0) {
        contenedor.innerHTML = '';
        mensajeVacio.style.display = 'block';
    } else {
        mensajeVacio.style.display = 'none';
        contenedor.innerHTML = favoritos.map(f => crearTarjetaNoticia(f, baseUrl)).join('');
    }
}

// Inicializar si estamos en la página de favoritos
if (window.location.pathname.includes('favoritos.html')) {
    document.addEventListener('DOMContentLoaded', renderizarPaginaFavoritos);
}
