/**
 * Módulo de utilidades: utils.js
 * Contiene funciones compartidas como carga de datos y helper para rutas.
 */

// Función para determinar el path correcto según dónde nos encontremos
function getBaseUrl() {
    const path = window.location.pathname;
    if (path.includes('/src/pages/')) {
        return '../../';
    }
    return './';
}

// Clave principal para localStorage
const STORAGE_KEY = 'nexoNoticiasBD';

/**
 * Obtiene las noticias, ya sea del localStorage (si existen modificaciones)
 * o del archivo JSON original.
 */
async function obtenerNoticias() {
    // Primero, revisar si hay datos en localStorage (para soportar el CRUD del admin)
    const datosLocales = localStorage.getItem(STORAGE_KEY);
    
    if (datosLocales) {
        return JSON.parse(datosLocales);
    }
    
    // Si no hay locales, cargar del JSON
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}src/data/noticias.json`);
        
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo de noticias');
        }
        
        const data = await response.json();
        
        // Guardar en localStorage para persistencia inicial
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        
        return data;
    } catch (error) {
        console.error('Error cargando noticias:', error);
        return [];
    }
}

/**
 * Obtiene una noticia específica por su ID
 */
async function obtenerNoticiaPorId(id) {
    const noticias = await obtenerNoticias();
    return noticias.find(n => n.id === parseInt(id));
}

/**
 * Guarda el array completo de noticias en localStorage
 */
function guardarNoticias(noticias) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(noticias));
}

/**
 * Formatea una fecha a un formato más legible
 */
function formatearFecha(fechaString) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fecha = new Date(fechaString);
    // Ajustar zona horaria si es necesario, pero para mockup está bien
    return fecha.toLocaleDateString('es-ES', opciones);
}

// Configuración general de UI (Menú Hamburguesa)
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }
});
