function getBaseUrl() {
    const path = window.location.pathname;
    if (path.includes('/src/pages/')) {
        return '../../';
    }
    return './';
}

const STORAGE_KEY = 'nexoNoticiasBD';
const DATA_VERSION_KEY = 'nexoNoticiasDataVersion';
const DATA_VERSION = 'figma-parity-v2';

let noticiasCache = null;
let noticiasRequest = null;

const FALLBACK_IMAGE = 'src/assets/images/stock/educacion.jpg';

function leerArregloLocal(clave, valorPorDefecto = []) {
    try {
        const valor = localStorage.getItem(clave);
        if (!valor) return valorPorDefecto;

        const parseado = JSON.parse(valor);
        return Array.isArray(parseado) ? parseado : valorPorDefecto;
    } catch (error) {
        console.warn(`No se pudo leer ${clave} desde localStorage.`, error);
        localStorage.removeItem(clave);
        return valorPorDefecto;
    }
}

function obtenerImagenUrl(noticia, baseUrl = getBaseUrl(), fallback = FALLBACK_IMAGE) {
    const imagen = typeof noticia?.imagen === 'string' ? noticia.imagen.trim() : '';
    if (!imagen) return /^(?:https?:|data:|blob:|\/)/i.test(fallback) ? fallback : `${baseUrl}${fallback}`;
    if (/^(?:https?:|data:|blob:|\/)/i.test(imagen)) return imagen;
    return `${baseUrl}${imagen}`;
}

async function obtenerNoticias() {
    if (noticiasCache) return noticiasCache;
    if (noticiasRequest) return noticiasRequest;

    const datosLocales = leerArregloLocal(STORAGE_KEY, null);
    const versionLocal = localStorage.getItem(DATA_VERSION_KEY);

    if (datosLocales && versionLocal === DATA_VERSION) {
        noticiasCache = datosLocales;
        return noticiasCache;
    }

    noticiasRequest = (async () => {
        try {
            const baseUrl = getBaseUrl();
            const response = await fetch(`${baseUrl}src/data/noticias.json`);

            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo de noticias');
            }

            const data = await response.json();
            if (!Array.isArray(data)) return [];

            if (datosLocales) {
                const basePorId = new Map(data.map((noticia) => [noticia.id, noticia]));
                const localesPorId = new Map(datosLocales.map((noticia) => [noticia.id, noticia]));
                const fusionadas = datosLocales.map((noticia) => ({
                    ...noticia,
                    imagen: basePorId.get(noticia.id)?.imagen || noticia.imagen || ''
                }));
                data.forEach((noticia) => {
                    if (!localesPorId.has(noticia.id)) fusionadas.push(noticia);
                });
                noticiasCache = fusionadas;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(fusionadas));
                localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
                return noticiasCache;
            }

            noticiasCache = data;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
            return noticiasCache;
        } catch (error) {
            console.error('Error cargando noticias:', error);
            return [];
        } finally {
            noticiasRequest = null;
        }
    })();

    return noticiasRequest;
}

async function obtenerNoticiaPorId(id) {
    const noticias = await obtenerNoticias();
    return noticias.find(n => n.id === parseInt(id));
}

function guardarNoticias(noticias) {
    noticiasCache = noticias;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(noticias));
    localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
}

function formatearFecha(fechaString) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', opciones);
}

document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (navToggle && navLinks) {
        navToggle.setAttribute('aria-expanded', 'false');

        navToggle.addEventListener('click', () => {
            const abierto = navLinks.classList.toggle('show');
            navToggle.setAttribute('aria-expanded', String(abierto));
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
});
