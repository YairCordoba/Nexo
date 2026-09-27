let todasLasNoticias = [];
let filtroActual = 'Todas';

function normalizarCategoria(valor) {
    return String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function inicializarListadoNoticias() {
    const contenedor = document.getElementById('contenedorNoticias');
    if (!contenedor) return;

    obtenerNoticias().then((noticias) => {
        todasLasNoticias = Array.isArray(noticias) ? noticias : [];
        const categoriaUrl = new URLSearchParams(window.location.search).get('categoria');
        const categorias = ['Todas', 'Educación', 'Tecnología', 'Turismo'];
        const encontrada = categorias.find((categoria) => normalizarCategoria(categoria) === normalizarCategoria(categoriaUrl));
        if (encontrada) filtroActual = encontrada;
        actualizarBotonesFiltro();
        renderizarNoticiasListado();
        configurarFiltrosYBusqueda();
    }).catch(() => {
        contenedor.innerHTML = '<div class="feedback feedback-error" role="alert">Error al cargar las noticias.</div>';
    });
}

function renderizarNoticiasListado(terminoBusqueda = '') {
    const contenedor = document.getElementById('contenedorNoticias');
    const mensajeVacio = document.getElementById('mensajeVacio');
    if (!contenedor) return;

    const termino = terminoBusqueda.trim().toLowerCase();
    const noticiasFiltradas = todasLasNoticias
        .filter((noticia) => filtroActual === 'Todas' || normalizarCategoria(noticia.categoria) === normalizarCategoria(filtroActual))
        .filter((noticia) => !termino || [noticia.titulo, noticia.resumen, noticia.categoria].some((campo) => String(campo || '').toLowerCase().includes(termino)))
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    if (!noticiasFiltradas.length) {
        contenedor.innerHTML = '';
        if (mensajeVacio) mensajeVacio.style.display = 'grid';
        return;
    }

    if (mensajeVacio) mensajeVacio.style.display = 'none';
    const baseUrl = getBaseUrl();
    contenedor.innerHTML = noticiasFiltradas.map((noticia) => crearTarjetaNoticia(noticia, baseUrl, 'list')).join('');
}

function configurarFiltrosYBusqueda() {
    document.querySelectorAll('#filtrosCategoria .category-tag').forEach((btn) => {
        btn.addEventListener('click', (event) => {
            filtroActual = event.currentTarget.dataset.categoria;
            actualizarBotonesFiltro();
            renderizarNoticiasListado(document.getElementById('inputBusqueda')?.value || '');
        });
    });

    document.getElementById('inputBusqueda')?.addEventListener('input', (event) => {
        renderizarNoticiasListado(event.target.value);
    });
}

function actualizarBotonesFiltro() {
    document.querySelectorAll('#filtrosCategoria .category-tag').forEach((btn) => {
        btn.classList.toggle('active', normalizarCategoria(btn.dataset.categoria) === normalizarCategoria(filtroActual));
    });
}

async function inicializarDetalleNoticia() {
    const contenedor = document.getElementById('detalleNoticia');
    if (!contenedor) return;

    const id = new URLSearchParams(window.location.search).get('id');
    const noticia = id ? await obtenerNoticiaPorId(id) : null;
    if (!noticia) {
        contenedor.innerHTML = '<div class="feedback feedback-error">Noticia no encontrada.</div>';
        return;
    }

    const baseUrl = getBaseUrl();
    const imagen = obtenerImagenUrl(noticia, baseUrl);
    document.title = `${noticia.titulo} - Nexo Noticias`;
    const relacionadas = (await obtenerNoticias()).filter((item) => item.id !== noticia.id).slice(0, 2);

    contenedor.innerHTML = `
        <div class="detail-layout">
            <div class="detail-copy">
                <span class="kicker">Lectura / Noticia</span>
                <h1>${noticia.titulo}</h1>
                <p class="page-subtitle"><span class="copy-desktop">Vista de lectura con foco en contenido y contexto.</span><span class="copy-mobile">Lectura móvil sin columnas forzadas ni texto superpuesto.</span></p>
                <p class="detail-meta">${formatearMeta(noticia.fecha)} &nbsp;·&nbsp; Campus</p>
            </div>
            <div class="detail-media">
                <img src="${imagen}" alt="${noticia.titulo}" onerror="this.onerror=null;this.src='${obtenerImagenUrl({}, baseUrl)}'">
            </div>
            <div class="detail-text">
                <p class="detail-lead">${noticia.resumen}</p>
                <p class="detail-body">${noticia.contenido || noticia.resumen}</p>
            </div>
            <aside class="detail-aside">
                <div class="quote-card">
                    <blockquote>Aprender también es encontrarnos.</blockquote>
                    <cite>Comunidad Nexo</cite>
                </div>
            </aside>
            <section class="detail-related" aria-labelledby="relatedTitle">
                <h2 id="relatedTitle">Historias relacionadas</h2>
                <div class="news-grid">${relacionadas.map((item) => crearTarjetaNoticia(item, baseUrl, 'related')).join('')}</div>
            </section>
            <a href="${baseUrl}src/pages/noticias.html" class="btn btn-dark detail-back">Volver a noticias</a>
        </div>
    `;

    const layout = contenedor.querySelector('.detail-layout');
    const copy = contenedor.querySelector('.detail-copy');
    const text = contenedor.querySelector('.detail-text');
    const related = contenedor.querySelector('.detail-related');
    const back = contenedor.querySelector('.detail-back');
    if (layout && copy && text && related && back) {
        const textTop = Math.max(157, copy.offsetHeight + 8);
        text.style.top = `${textTop}px`;
        const relatedTop = Math.max(407, textTop + text.offsetHeight + 20);
        related.style.top = `${relatedTop}px`;
        back.style.top = `${relatedTop + related.offsetHeight + 1}px`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarListadoNoticias();
    inicializarDetalleNoticia();
});
