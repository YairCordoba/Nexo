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
        <article class="card" style="background: var(--color-white); border-radius: 20px; padding: 1rem; box-shadow: 0 8px 24px rgba(0,0,0,0.08); position: relative; display: flex; flex-direction: column;">
            <div style="position: relative; width: 100%; aspect-ratio: 4/5; margin-bottom: 1rem; border-radius: 16px; overflow: hidden; background: #f0f0f0;">
                <img src="${imgUrl}" alt="${noticia.titulo}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&q=80'">
                <button class="btn-fav ${activeClass}" 
                        data-id="${noticia.id}" 
                        title="${esFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
                        onclick="manejadorFavorito(this, ${noticia.id})"
                        style="position: absolute; top: 12px; right: 12px; background: white; border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); font-size: 1.2rem; margin: 0; padding: 0; z-index: 10;">
                    ${esFav ? '♥' : '♡'}
                </button>
            </div>
            
            <div style="display: flex; flex-direction: column; flex-grow: 1;">
                <h3 style="font-size: 1.3rem; font-family: var(--font-primary); font-weight: 700; color: var(--color-text); margin-bottom: 0.8rem; line-height: 1.3;">
                    <a href="${baseUrl}src/pages/detalle.html?id=${noticia.id}" style="color: inherit; text-decoration: none;">${noticia.titulo}</a>
                </h3>
                
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
                    <span style="border: 1px solid var(--color-border); padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.8rem; color: var(--color-text-light);">${noticia.categoria}</span>
                </div>
                
                <p style="font-size: 0.95rem; color: var(--color-text-light); margin-bottom: 1.5rem; flex-grow: 1; line-height: 1.5;">${noticia.resumen.length > 90 ? noticia.resumen.substring(0, 90) + '...' : noticia.resumen}</p>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                    <div style="font-weight: 700; font-size: 1.1rem; color: var(--color-text);">${formatearFecha(noticia.fecha).split(' ')[0]} ${formatearFecha(noticia.fecha).split(' ')[2] || ''}</div>
                    <a href="${baseUrl}src/pages/detalle.html?id=${noticia.id}" class="btn" style="background-color: var(--color-accent); color: white; padding: 0.6rem 1.2rem; border-radius: 40px; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; text-decoration: none; border: none;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        Leer más
                    </a>
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
