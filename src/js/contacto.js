/**
 * contacto.js
 * Lógica y validación del formulario de contacto.
 */

document.addEventListener('DOMContentLoaded', () => {
    const formContacto = document.getElementById('formContacto');
    
    if (formContacto) {
        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validarFormulario()) {
                // Simular envío
                const btnSubmit = formContacto.querySelector('button[type="submit"]');
                const btnTextoOriginal = btnSubmit.innerHTML;
                
                btnSubmit.innerHTML = 'Enviando...';
                btnSubmit.disabled = true;
                
                setTimeout(() => {
                    formContacto.style.display = 'none';
                    document.getElementById('mensajeExito').style.display = 'block';
                    formContacto.reset();
                    
                    // Restaurar botón (por si acaso el usuario navega hacia atrás)
                    btnSubmit.innerHTML = btnTextoOriginal;
                    btnSubmit.disabled = false;
                }, 1000); // Simulamos 1 segundo de latencia de red
            }
        });
    }
});

function validarFormulario() {
    let esValido = true;
    
    // Obtener campos
    const nombre = document.getElementById('nombre');
    const correo = document.getElementById('correo');
    const asunto = document.getElementById('asunto');
    const mensaje = document.getElementById('mensaje');
    
    // Limpiar errores previos
    document.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.form-control').forEach(el => el.style.borderColor = 'var(--color-border)');
    
    // Validar nombre
    if (nombre.value.trim().length < 3) {
        mostrarError(nombre, 'errorNombre');
        esValido = false;
    }
    
    // Validar correo (expresión regular básica)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.value.trim())) {
        mostrarError(correo, 'errorCorreo');
        esValido = false;
    }
    
    // Validar asunto
    if (asunto.value.trim().length < 5) {
        mostrarError(asunto, 'errorAsunto');
        esValido = false;
    }
    
    // Validar mensaje
    if (mensaje.value.trim().length < 10) {
        mostrarError(mensaje, 'errorMensaje');
        esValido = false;
    }
    
    return esValido;
}

function mostrarError(inputElement, errorId) {
    document.getElementById(errorId).style.display = 'block';
    inputElement.style.borderColor = '#ef4444';
}
