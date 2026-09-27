document.addEventListener('DOMContentLoaded', () => {
    const formAdmin = document.getElementById('formAdmin');
    const panel = document.getElementById('formAdminPanel');
    const nueva = document.getElementById('btnNuevaNoticia');
    const cancelar = document.getElementById('btnCancelarEdicion');

    if (!formAdmin) return;
    renderizarListaAdmin();

    formAdmin.addEventListener('submit', async (event) => {
        event.preventDefault();
        await guardarNoticia();
    });

    nueva?.addEventListener('click', () => {
        cancelarEdicion(false);
        panel.hidden = false;
        document.getElementById('titulo')?.focus();
    });

    cancelar?.addEventListener('click', () => cancelarEdicion(true));
});

function obtenerEstado(noticia, index) {
    if (noticia.destacada) return { label: 'Publicada', className: 'status-published' };
    if (index % 3 === 1) return { label: 'Borrador', className: 'status-draft' };
    return { label: 'Revisión', className: 'status-review' };
}

async function renderizarListaAdmin() {
    const contenedor = document.getElementById('listaAdmin');
    if (!contenedor) return;

    try {
        const noticias = [...await obtenerNoticias()].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        const estados = noticias.map(obtenerEstado);
        const publicados = estados.filter((estado) => estado.label === 'Publicada').length;
        const borradores = estados.filter((estado) => estado.label === 'Borrador').length;
        const revision = estados.filter((estado) => estado.label === 'Revisión').length;
        document.getElementById('statPublished').textContent = String(publicados).padStart(2, '0');
        document.getElementById('statDrafts').textContent = String(borradores).padStart(2, '0');
        document.getElementById('statReview').textContent = String(revision).padStart(2, '0');

        if (!noticias.length) {
            contenedor.innerHTML = '<div class="feedback">No hay publicaciones todavía.</div>';
            return;
        }

        contenedor.innerHTML = noticias.slice(0, 3).map((noticia, index) => {
            const estado = estados[index];
            return `
                <div class="admin-row">
                    <span class="admin-row__title">${noticia.titulo}</span>
                    <span class="status-tag ${estado.className}">${estado.label}</span>
                    <span class="admin-row__date">${formatearMeta(noticia.fecha)}</span>
                    <span class="admin-row__actions">
                        <button type="button" class="btn btn-outline" onclick="prepararEdicion(${noticia.id})">Editar</button>
                        <button type="button" class="btn btn-danger" onclick="eliminarNoticia(${noticia.id})">Eliminar</button>
                    </span>
                </div>
            `;
        }).join('');
    } catch (error) {
        contenedor.innerHTML = '<div class="feedback feedback-error">Error al cargar el listado.</div>';
    }
}

async function guardarNoticia() {
    const id = document.getElementById('noticiaId').value;
    if (id) await actualizarNoticia(parseInt(id, 10));
    else await crearNoticia();
}

async function crearNoticia() {
    const noticias = await obtenerNoticias();
    const nuevoId = noticias.length ? Math.max(...noticias.map((noticia) => noticia.id)) + 1 : 1;
    noticias.push({
        id: nuevoId,
        titulo: document.getElementById('titulo').value.trim(),
        categoria: document.getElementById('categoria').value,
        imagen: document.getElementById('imagen').value.trim(),
        resumen: document.getElementById('resumen').value.trim(),
        contenido: document.getElementById('contenido').value.trim(),
        autor: document.getElementById('autor').value.trim(),
        fecha: new Date().toISOString().split('T')[0],
        destacada: false
    });
    guardarNoticias(noticias);
    finalizarOperacion('Noticia creada correctamente.');
}

async function actualizarNoticia(id) {
    const noticias = await obtenerNoticias();
    const index = noticias.findIndex((noticia) => noticia.id === id);
    if (index === -1) return;
    noticias[index] = {
        ...noticias[index],
        titulo: document.getElementById('titulo').value.trim(),
        categoria: document.getElementById('categoria').value,
        imagen: document.getElementById('imagen').value.trim(),
        resumen: document.getElementById('resumen').value.trim(),
        contenido: document.getElementById('contenido').value.trim(),
        autor: document.getElementById('autor').value.trim()
    };
    guardarNoticias(noticias);
    sincronizarFavoritosTrasEdicion(noticias[index]);
    finalizarOperacion('Noticia actualizada correctamente.');
}

async function prepararEdicion(id) {
    const noticia = await obtenerNoticiaPorId(id);
    const panel = document.getElementById('formAdminPanel');
    if (!noticia || !panel) return;
    panel.hidden = false;
    document.getElementById('formAdminTitle').textContent = 'Editar noticia';
    document.getElementById('btnSubmitAdmin').textContent = 'Actualizar';
    document.getElementById('noticiaId').value = noticia.id;
    document.getElementById('titulo').value = noticia.titulo;
    document.getElementById('categoria').value = noticia.categoria;
    document.getElementById('imagen').value = noticia.imagen || '';
    document.getElementById('resumen').value = noticia.resumen;
    document.getElementById('contenido').value = noticia.contenido;
    document.getElementById('autor').value = noticia.autor;
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cancelarEdicion(ocultar = true) {
    document.getElementById('formAdmin')?.reset();
    document.getElementById('noticiaId').value = '';
    document.getElementById('formAdminTitle').textContent = 'Crear noticia';
    document.getElementById('btnSubmitAdmin').textContent = 'Guardar';
    if (ocultar) document.getElementById('formAdminPanel').hidden = true;
}

async function eliminarNoticia(id) {
    if (!confirm('¿Deseas eliminar esta noticia?')) return;
    const noticias = (await obtenerNoticias()).filter((noticia) => noticia.id !== id);
    guardarNoticias(noticias);
    const favoritos = leerArregloLocal('nexoNoticiasFavoritos').filter((favorito) => favorito.id !== id);
    localStorage.setItem('nexoNoticiasFavoritos', JSON.stringify(favoritos));
    renderizarListaAdmin();
}

function finalizarOperacion(mensaje) {
    cancelarEdicion(true);
    renderizarListaAdmin();
    alert(mensaje);
}

function sincronizarFavoritosTrasEdicion(noticiaActualizada) {
    const favoritos = leerArregloLocal('nexoNoticiasFavoritos');
    const index = favoritos.findIndex((favorito) => favorito.id === noticiaActualizada.id);
    if (index !== -1) {
        favoritos[index] = noticiaActualizada;
        localStorage.setItem('nexoNoticiasFavoritos', JSON.stringify(favoritos));
    }
}
