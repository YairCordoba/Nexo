/**
 * app.js
 * Lógica principal para la página de inicio (index.html) - Rediseñada
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Configurar listener global para el easter egg (palabra clave "nexoadd")
    configurarEasterEgg();

    const contenedorDestacadas = document.getElementById('contenedorNoticiasDestacadas');
    const heroFeaturedNews = document.getElementById('heroFeaturedNews');
    const heroSecondaryNews = document.getElementById('heroSecondaryNews');
    const sidebarNews = document.getElementById('sidebarNews');
    
    if (contenedorDestacadas) {
        try {
            const noticias = await obtenerNoticias();
            if(!noticias || noticias.length === 0) throw new Error("No hay noticias");
            
            const baseUrl = getBaseUrl();
            
            // 1. Hero Principal (1 noticia destacada, ej: la primera destacada de estilo Lifestyle/Turismo)
            const destacadas = noticias.filter(n => n.destacada);
            const mainHero = destacadas.length > 0 ? destacadas[0] : noticias[0];
            
            if(heroFeaturedNews) {
                heroFeaturedNews.innerHTML = `
                    <div style="margin-bottom: 1.5rem;">
                        <span class="card-category">● ${mainHero.categoria}</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
                        <div>
                            <h2 style="font-size: 2.25rem; font-family: var(--font-heading); margin-bottom: 1.5rem; line-height: 1.2;">
                                <a href="${baseUrl}src/pages/detalle.html?id=${mainHero.id}" style="color: inherit; text-decoration: none;">${mainHero.titulo}</a>
                            </h2>
                            <p style="color: var(--color-text-light); font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem;">
                                ${mainHero.resumen}
                            </p>
                            <div style="font-size: 0.85rem; color: var(--color-text-light); display: flex; gap: 1rem; align-items: center;">
                                <strong>${mainHero.autor}</strong>
                                <span>${formatearFecha(mainHero.fecha)}</span>
                            </div>
                        </div>
                        <div class="card-img-wrapper" style="height: 300px; margin-bottom: 0;">
                            <img src="${mainHero.imagen ? baseUrl + mainHero.imagen : 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80'}" class="card-img" style="border-radius: 4px;" alt="Hero">
                        </div>
                    </div>
                `;
            }

            // 2. Hero Secundario (la segunda destacada)
            const secHero = destacadas.length > 1 ? destacadas[1] : noticias[1];
            if(heroSecondaryNews) {
                heroSecondaryNews.innerHTML = `
                    <div class="card-img-wrapper" style="height: 180px; margin-bottom: 1rem;">
                        <img src="${secHero.imagen ? baseUrl + secHero.imagen : 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&q=80'}" class="card-img" style="border-radius: 4px;" alt="Hero Sub">
                    </div>
                    <h3 style="font-size: 1.25rem; font-family: var(--font-heading); margin-bottom: 0.5rem; line-height: 1.3;">
                        <a href="${baseUrl}src/pages/detalle.html?id=${secHero.id}" style="color: inherit; text-decoration: none;">${secHero.titulo}</a>
                    </h3>
                    <p style="color: var(--color-text-light); font-size: 0.9rem;">${secHero.resumen.substring(0, 80)}...</p>
                    <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--color-text-light);">
                        <span>${formatearFecha(secHero.fecha)}</span>
                    </div>
                `;
            }

            // 3. Breaking News List (Siguientes noticias)
            const remainingNews = noticias.filter(n => n.id !== mainHero.id && n.id !== secHero.id);
            const mainColumnNews = remainingNews.slice(0, 4);
            
            contenedorDestacadas.innerHTML = mainColumnNews.map(n => `
                <article class="card-horizontal">
                    <div class="card-img-wrapper">
                        <img src="${n.imagen ? baseUrl + n.imagen : 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80'}" alt="${n.titulo}" class="card-img" style="border-radius: 4px;">
                    </div>
                    <div class="card-content">
                        <div style="margin-bottom: 1rem;">
                            <span class="card-category">● ${n.categoria}</span>
                        </div>
                        <h3 class="card-title">
                            <a href="${baseUrl}src/pages/detalle.html?id=${n.id}">${n.titulo}</a>
                        </h3>
                        <p class="card-desc">${n.resumen}</p>
                        
                        <div class="card-actions" style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--color-text-light);">
                            <div style="display: flex; gap: 1rem; align-items: center;">
                                <strong>${n.autor}</strong>
                            </div>
                            <div style="display: flex; gap: 1rem; align-items: center;">
                                <span>${formatearFecha(n.fecha)}</span>
                                <button class="btn-fav ${esFavorito(n.id) ? 'active' : ''}" 
                                        data-id="${n.id}" 
                                        title="Favorito"
                                        style="font-size: 1.2rem; margin-top: -5px;"
                                        onclick="manejadorFavorito(this, ${n.id})">
                                    ${esFavorito(n.id) ? '★' : '☆'}
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            `).join('');

            // 4. Sidebar Flash News
            if(sidebarNews) {
                const sideNews = remainingNews.slice(4, 8);
                sidebarNews.innerHTML = sideNews.map(n => `
                    <article class="mini-card">
                        <div class="card-content">
                            <h4 class="card-title" style="font-size: 1.05rem;">
                                <a href="${baseUrl}src/pages/detalle.html?id=${n.id}" style="color: inherit; text-decoration: none;">${n.titulo}</a>
                            </h4>
                            <div style="font-size: 0.75rem; color: var(--color-text-light);">
                                • ${formatearFecha(n.fecha)}
                            </div>
                        </div>
                        <div class="card-img-wrapper">
                            <img src="${n.imagen ? baseUrl + n.imagen : 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=150&q=80'}" alt="" class="card-img" style="border-radius: 4px;">
                        </div>
                    </article>
                `).join('');
            }
            
        } catch (error) {
            console.error("Error al cargar noticias destacadas:", error);
            contenedorDestacadas.innerHTML = `<div style="text-align: center; color: #d93025; padding: 2rem;">Error al cargar las noticias. Verifique la conexión o el almacenamiento.</div>`;
        }
    }
});

// ==========================================
// EASTER EGG: Palabra Clave para agregar noticia
// ==========================================
function configurarEasterEgg() {
    let secretBuffer = "";
    const KEYWORD = "nexoadd";
    
    document.addEventListener("keydown", (e) => {
        // Ignorar si estamos escribiendo en un input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        secretBuffer += e.key.toLowerCase();
        
        if (secretBuffer.length > KEYWORD.length) {
            secretBuffer = secretBuffer.substring(secretBuffer.length - KEYWORD.length);
        }
        
        if (secretBuffer === KEYWORD) {
            secretBuffer = "";
            mostrarModalAdminOculto();
        }
    });
}

function mostrarModalAdminOculto() {
    // Evitar múltiples modales
    if(document.getElementById('modalAdminOculto')) return;

    const baseUrl = getBaseUrl();
    const modalHTML = `
        <div class="modal-overlay" id="modalAdminOculto">
            <div class="modal-content">
                <button class="modal-close" onclick="document.getElementById('modalAdminOculto').remove()">×</button>
                <h2 style="margin-bottom: 1.5rem; font-family: var(--font-heading);">Creación Rápida (Admin Mode)</h2>
                
                <form id="formAdminRapido">
                    <div class="form-group">
                        <label class="form-label">Título</label>
                        <input type="text" id="r_titulo" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Categoría</label>
                        <select id="r_categoria" class="form-control" required>
                            <option value="Educación">Educación</option>
                            <option value="Tecnología">Tecnología</option>
                            <option value="Turismo">Turismo</option>
                            <option value="Comercio">Comercio</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Resumen</label>
                        <textarea id="r_resumen" class="form-control" style="min-height: 80px;" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Guardar Noticia Rápida</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('formAdminRapido').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const noticias = await obtenerNoticias();
            const maxId = noticias.length > 0 ? Math.max(...noticias.map(n => n.id)) : 0;
            const nuevaNoticia = {
                id: maxId + 1,
                titulo: document.getElementById('r_titulo').value,
                categoria: document.getElementById('r_categoria').value,
                imagen: "",
                resumen: document.getElementById('r_resumen').value,
                contenido: document.getElementById('r_resumen').value + " (Contenido generado por creación rápida)",
                autor: "Admin (Quick)",
                fecha: new Date().toISOString().split('T')[0],
                destacada: false
            };
            noticias.push(nuevaNoticia);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(noticias));
            alert("Noticia rápida creada con éxito.");
            document.getElementById('modalAdminOculto').remove();
            
            // Recargar para mostrar si estamos en inicio
            if(window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                window.location.reload();
            }
        } catch(error) {
            alert("Error al guardar.");
        }
    });
}
