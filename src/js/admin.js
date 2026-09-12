/**
 * admin.js
 * Lógica del CRUD Completo para administración usando localStorage.
 */

document.addEventListener('DOMContentLoaded', () => {
    const formAdmin = document.getElementById('formAdmin');
    
    if (formAdmin) {
        renderizarListaAdmin();
        
        formAdmin.addEventListener('submit', async (e) => {
            e.preventDefault();
            await guardarNoticia();
        });
    }
});

async function renderizarListaAdmin() {
    const contenedor = document.getElementById('listaAdmin');
    if (!contenedor) return;
    
    try {
        const noticias = await obtenerNoticias();
        
        if (noticias.length === 0) {
            contenedor.innerHTML = '<div style="text-align: center; color: var(--color-text-light); padding: 3rem; background: #fafafa; border: 1px dashed var(--color-border);">No hay noticias creadas. Utiliza el formulario para crear una.</div>';
            return;
        }
        
        // Ordenamos recientes primero
        noticias.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        contenedor.innerHTML = noticias.map(n => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border: 1px solid var(--color-border); background: var(--color-white); transition: var(--transition);">
                <div>
                    <h4 style="margin-bottom: 0.5rem; font-family: var(--font-heading); font-size: 1.1rem;">${n.titulo}</h4>
                    <span style="font-size: 0.85rem; color: var(--color-text-light);">${n.categoria} • ${n.autor} • ${formatearFecha(n.fecha)}</span>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="prepararEdicion(${n.id})" class="btn btn-outline" style="padding: 0.4rem 1rem; font-size: 0.85rem;">Editar</button>
                    <button onclick="eliminarNoticia(${n.id})" class="btn btn-danger" style="padding: 0.4rem 1rem; font-size: 0.85rem;">Eliminar</button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        contenedor.innerHTML = '<div style="color: #d93025; padding: 2rem;">Error al cargar el listado de noticias.</div>';
    }
}

async function guardarNoticia() {
    const idInput = document.getElementById('noticiaId').value;
    
    if (idInput) {
        // Modo Edición
        await actualizarNoticia(parseInt(idInput));
    } else {
        // Modo Creación
        await crearNoticia();
    }
}

async function crearNoticia() {
    const noticias = await obtenerNoticias();
    const maxId = noticias.length > 0 ? Math.max(...noticias.map(n => n.id)) : 0;
    const nuevoId = maxId + 1;
    
    const nuevaNoticia = {
        id: nuevoId,
        titulo: document.getElementById('titulo').value,
        categoria: document.getElementById('categoria').value,
        imagen: document.getElementById('imagen').value || '',
        resumen: document.getElementById('resumen').value,
        contenido: document.getElementById('contenido').value,
        autor: document.getElementById('autor').value,
        fecha: new Date().toISOString().split('T')[0],
        destacada: false
    };
    
    noticias.push(nuevaNoticia);
    guardarNoticias(noticias);
    
    finalizarOperacion('Noticia creada correctamente.');
}

async function actualizarNoticia(id) {
    let noticias = await obtenerNoticias();
    const index = noticias.findIndex(n => n.id === id);
    
    if (index !== -1) {
        // Preservar la fecha original y el estado de destacada
        noticias[index] = {
            ...noticias[index],
            titulo: document.getElementById('titulo').value,
            categoria: document.getElementById('categoria').value,
            imagen: document.getElementById('imagen').value || '',
            resumen: document.getElementById('resumen').value,
            contenido: document.getElementById('contenido').value,
            autor: document.getElementById('autor').value
        };
        
        guardarNoticias(noticias);
        
        // Sincronizar en favoritos si es necesario
        sincronizarFavoritosTrasEdicion(noticias[index]);
        
        finalizarOperacion('Noticia actualizada exitosamente.');
        cancelarEdicion();
    }
}

async function prepararEdicion(id) {
    const noticia = await obtenerNoticiaPorId(id);
    if (!noticia) return;
    
    // Cambiar UI
    document.getElementById('formAdminTitle').innerText = 'Editar Noticia';
    document.getElementById('btnSubmitAdmin').innerText = 'Actualizar';
    document.getElementById('btnCancelarEdicion').style.display = 'block';
    
    // Llenar datos
    document.getElementById('noticiaId').value = noticia.id;
    document.getElementById('titulo').value = noticia.titulo;
    document.getElementById('categoria').value = noticia.categoria;
    document.getElementById('imagen').value = noticia.imagen || '';
    document.getElementById('resumen').value = noticia.resumen;
    document.getElementById('contenido').value = noticia.contenido;
    document.getElementById('autor').value = noticia.autor;
    
    // Scroll arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelarEdicion() {
    document.getElementById('formAdmin').reset();
    document.getElementById('noticiaId').value = '';
    
    document.getElementById('formAdminTitle').innerText = 'Crear Noticia';
    document.getElementById('btnSubmitAdmin').innerText = 'Guardar';
    document.getElementById('btnCancelarEdicion').style.display = 'none';
}

async function eliminarNoticia(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta noticia permanentemente?')) {
        let noticias = await obtenerNoticias();
        noticias = noticias.filter(n => n.id !== id);
        guardarNoticias(noticias);
        
        // Remover de favoritos
        const favsStr = localStorage.getItem('nexoNoticiasFavoritos');
        if (favsStr) {
            let favs = JSON.parse(favsStr);
            favs = favs.filter(f => f.id !== id);
            localStorage.setItem('nexoNoticiasFavoritos', JSON.stringify(favs));
        }
        
        // Si estaba editando justo esa noticia, cancelar
        if (document.getElementById('noticiaId').value == id) {
            cancelarEdicion();
        }
        
        renderizarListaAdmin();
    }
}

function finalizarOperacion(mensaje) {
    document.getElementById('formAdmin').reset();
    renderizarListaAdmin();
    alert(mensaje);
}

function sincronizarFavoritosTrasEdicion(noticiaActualizada) {
    const favsStr = localStorage.getItem('nexoNoticiasFavoritos');
    if (favsStr) {
        let favs = JSON.parse(favsStr);
        const index = favs.findIndex(f => f.id === noticiaActualizada.id);
        if (index !== -1) {
            favs[index] = noticiaActualizada;
            localStorage.setItem('nexoNoticiasFavoritos', JSON.stringify(favs));
        }
    }
}
