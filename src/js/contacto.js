document.addEventListener('DOMContentLoaded', () => {
    const formContacto = document.getElementById('formContacto');
    
    if (formContacto) {
        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validarFormulario()) {
                const btnSubmit = formContacto.querySelector('button[type="submit"]');
                const btnTextoOriginal = btnSubmit.innerHTML;
                
                btnSubmit.innerHTML = 'Enviando...';
                btnSubmit.disabled = true;
                
                setTimeout(() => {
                    formContacto.style.display = 'none';
                    document.getElementById('mensajeExito').style.display = 'block';
                    formContacto.reset();
                    
                    btnSubmit.innerHTML = btnTextoOriginal;
                    btnSubmit.disabled = false;
                }, 1000);
            } else {
                formContacto.querySelector('[aria-invalid="true"]')?.focus();
            }
        });
    }
});

function validarFormulario() {
    let esValido = true;
    
    const nombre = document.getElementById('nombre');
    const correo = document.getElementById('correo');
    const mensaje = document.getElementById('mensaje');
    
    document.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.form-control').forEach((el) => {
        el.style.borderColor = 'var(--color-border)';
        el.setAttribute('aria-invalid', 'false');
    });
    
    if (nombre.value.trim().length < 3) {
        mostrarError(nombre, 'errorNombre');
        esValido = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.value.trim())) {
        mostrarError(correo, 'errorCorreo');
        esValido = false;
    }
    
    if (mensaje.value.trim().length < 10) {
        mostrarError(mensaje, 'errorMensaje');
        esValido = false;
    }
    
    return esValido;
}

function mostrarError(inputElement, errorId) {
    document.getElementById(errorId).style.display = 'block';
    inputElement.style.borderColor = '#ef4444';
    inputElement.setAttribute('aria-invalid', 'true');
}
