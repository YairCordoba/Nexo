/**
 * noticias.js
 * Lógica para listado de noticias, filtros, búsqueda y detalle.
 */

let todasLasNoticias = [];
let filtroActual = 'Todas';

// ----------------------------------------------------
// LÓGICA DE LISTADO (noticias.html)
// ----------------------------------------------------

async function inicializarListadoNoticias() {
    const contenedor = document.getElementById('contenedorNoticias');
    if (!contenedor) return; // No estamos en noticias.html
    
    try {
        todasLasNoticias = await obtenerNoticias();
        
        // Revisar si viene categoría por URL
        const urlParams = new URLSearchParams(window.location.search);
        const catUrl = urlParams.get('categoria');
        
        if (catUrl) {
            filtroActual = catUrl;
            actualizarBotonesFiltro();
        }
        
        renderizarNoticiasListado();
        configurarFiltrosYBusqueda();
        
    } catch (error) {
        contenedor.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: #ef4444;">Error al cargar las noticias.</div>`;
    }
}

function renderizarNoticiasListado(terminoBusqueda = '') {
    const contenedor = document.getElementById('contenedorNoticias');
    const mensajeVacio = document.getElementById('mensajeVacio');
    
    let noticiasFiltradas = todasLasNoticias;
    
    // 1. Filtrar por categoría
    if (filtroActual !== 'Todas') {
        // Ignorando acentos para la comparación simple
        const normalizar = str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        noticiasFiltradas = noticiasFiltradas.filter(n => normalizar(n.categoria) === normalizar(filtroActual));
    }
    
    // 2. Filtrar por término de búsqueda (título o contenido)
    if (terminoBusqueda.trim() !== '') {
        const termino = terminoBusqueda.toLowerCase();
        noticiasFiltradas = noticiasFiltradas.filter(n => 
            n.titulo.toLowerCase().includes(termino) || 
            n.resumen.toLowerCase().includes(termino) ||
            n.categoria.toLowerCase().includes(termino)
        );
    }
    
    // Renderizar
    const baseUrl = getBaseUrl();
    
    if (noticiasFiltradas.length === 0) {
        contenedor.innerHTML = '';
        mensajeVacio.style.display = 'block';
    } else {
        mensajeVacio.style.display = 'none';
        
        // Ordenar por fecha descendente
        noticiasFiltradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        contenedor.innerHTML = noticiasFiltradas.map(n => crearTarjetaNoticia(n, baseUrl)).join('');
    }
}

function configurarFiltrosYBusqueda() {
    const botonesFiltro = document.querySelectorAll('.category-tag');
    const inputBusqueda = document.getElementById('inputBusqueda');
    
    // Eventos Filtro
    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filtroActual = e.target.dataset.categoria;
            actualizarBotonesFiltro();
            renderizarNoticiasListado(inputBusqueda.value);
        });
    });
    
    // Evento Búsqueda
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', (e) => {
            renderizarNoticiasListado(e.target.value);
        });
    }
}

function actualizarBotonesFiltro() {
    const botonesFiltro = document.querySelectorAll('.category-tag[data-categoria]');
    botonesFiltro.forEach(btn => {
        // Normalización básica para encontrar el botón correcto
        const catNormal = filtroActual.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const btnCatNormal = btn.dataset.categoria.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        
        if (catNormal === btnCatNormal) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ----------------------------------------------------
// LÓGICA DE DETALLE (detalle.html)
// ----------------------------------------------------

async function inicializarDetalleNoticia() {
    const contenedor = document.getElementById('detalleNoticia');
    if (!contenedor) return; // No estamos en detalle.html
    
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
        contenedor.innerHTML = `<div style="padding: 4rem; text-align: center;">Noticia no encontrada. <a href="noticias.html">Volver</a></div>`;
        return;
    }
    
    try {
        const noticia = await obtenerNoticiaPorId(id);
        
        if (!noticia) {
            contenedor.innerHTML = `<div style="padding: 4rem; text-align: center;">Noticia no encontrada. <a href="noticias.html">Volver</a></div>`;
            return;
        }
        
        const baseUrl = getBaseUrl();
        const esFav = esFavorito(noticia.id);
        const starIcon = esFav ? '★' : '☆';
        const activeClass = esFav ? 'active' : '';
        const imgUrl = noticia.imagen && noticia.imagen.trim() !== '' 
                   ? `${baseUrl}${noticia.imagen}` 
                   : 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80';
        
        document.title = `${noticia.titulo} - Nexo Noticias`;
        
        contenedor.innerHTML = `
            <div style="background-color: #e2e8f0; height: 350px; overflow: hidden;">
                <img src="${imgUrl}" alt="${noticia.titulo}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80'">
            </div>
            <div style="padding: 3rem; max-width: 800px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <div>
                        <span class="card-category" style="font-size: 0.9rem;">${noticia.categoria}</span>
                        <span style="color: var(--color-muted); margin-left: 1rem; font-size: 0.95rem;">${formatearFecha(noticia.fecha)}</span>
                    </div>
                    <button class="btn-fav ${activeClass}" 
                            style="font-size: 1.5rem;"
                            data-id="${noticia.id}" 
                            title="${esFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
                            onclick="manejadorFavorito(this, ${noticia.id})">
                        ${starIcon}
                    </button>
                </div>
                
                <h1 style="font-size: 2.25rem; color: var(--color-primary); margin-bottom: 1rem; line-height: 1.2;">${noticia.titulo}</h1>
                <p style="color: var(--color-text-light); font-weight: 500; font-size: 1.1rem; margin-bottom: 2rem;">Por: ${noticia.autor}</p>
                
                <div style="font-size: 1.15rem; line-height: 1.8; color: var(--color-text);">
                    <p style="font-weight: 500; margin-bottom: 1.5rem;">${noticia.resumen}</p>
                    <p>${noticia.contenido}</p>
                </div>
                
                <div style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--color-border); text-align: center;">
                    <h3 style="margin-bottom: 1rem;">¿Te interesó este tema?</h3>
                    <a href="contacto.html" class="btn btn-primary">Contáctanos para más información</a>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error(error);
        contenedor.innerHTML = `<div style="padding: 4rem; text-align: center; color: #ef4444;">Error al cargar la noticia.</div>`;
    }
}

// Inicializador principal
document.addEventListener('DOMContentLoaded', () => {
    inicializarListadoNoticias();
    inicializarDetalleNoticia();
});
