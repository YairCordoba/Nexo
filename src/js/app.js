document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('contenedorNoticiasDestacadas');
    const slotHero = document.getElementById('heroFeaturedNews');
    if (!contenedor || !slotHero) return;

    try {
        const noticias = await obtenerNoticias();
        if (!noticias.length) throw new Error('No hay noticias disponibles');

        const baseUrl = getBaseUrl();
        const principal = noticias.find((noticia) => noticia.destacada) || noticias[0];
        const restantes = noticias.filter((noticia) => noticia.id !== principal.id);
        const imagen = obtenerImagenUrl(principal, baseUrl);

        slotHero.innerHTML = `<img src="${imagen}" alt="${principal.titulo}" onerror="this.onerror=null;this.src='${obtenerImagenUrl({}, baseUrl)}'">`;
        contenedor.innerHTML = restantes
            .slice(0, 3)
            .map((noticia) => crearTarjetaNoticia(noticia, baseUrl, 'home'))
            .join('');
    } catch (error) {
        console.error('Error al cargar noticias destacadas:', error);
        slotHero.innerHTML = '<div class="feedback feedback-error" role="alert">No pudimos cargar la noticia destacada.</div>';
        contenedor.innerHTML = '<div class="feedback feedback-error" role="alert">No pudimos cargar las noticias.</div>';
    }
});
