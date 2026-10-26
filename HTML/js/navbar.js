document.addEventListener('DOMContentLoaded', () => {
    const usuario = localStorage.getItem('usuarioLogueado');
    const elementoNombre = document.getElementById('nombre-usuario-nav');

    // Si esta página no tiene el menú de usuario, no hacemos nada
    if (!elementoNombre) return;

    if (usuario) {
        // Si hay sesión, muestra el nombre en el botón del menú
        elementoNombre.textContent = usuario;
    } else {
        // Si no hay sesión, manda al login        
        window.location.href = '../html/index.html?vista=login';
        return;
    }

    // Botón de cerrar sesión 
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('usuarioLogueado');
            window.location.href = '../html/index.html?vista=login';
        });
    }
});