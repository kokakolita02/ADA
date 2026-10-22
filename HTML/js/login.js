document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    // Usamos los IDs exactos de tu HTML de Bootstrap
    const userIngresado = document.getElementById('floatingInput').value;
    const passIngresada = document.getElementById('floatingPassword').value;
    const mensajeError = document.getElementById('mensaje-error');

    fetch('../json/usuarios.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el archivo JSON");
            }
            return response.json();
        })
        .then(data => {
            const usuarioValido = data.usuarios.find(
                u => u.username === userIngresado && u.password === passIngresada
            );

            if (usuarioValido) {
                mensajeError.style.display = 'none';
                window.location.href = "../html/menu.html"; 
            } else {
                // Muestra la alerta roja de Bootstrap
                mensajeError.style.display = 'block';
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Hubo un problema al conectar con el servidor.");
        });
});