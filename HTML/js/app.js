
function appAdaMusic() {
    return {
        vistaActual: 'inicio', 
        usuario: '',
        password: '',
        errorLogin: false,

        //  se ejecuta al cargar el index.html
        init() {
            // Revisa si la URL tiene el parámetro vista login
            const parametros = new URLSearchParams(window.location.search);
            if (parametros.get('vista') === 'login') {
                this.vistaActual = 'login';
            }
        },

        validarLogin() {
            this.errorLogin = false;
            
            fetch('../json/usuarios.json')
                .then(response => {
                    if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");
                    return response.json();
                })
                .then(data => {
                    const usuarioValido = data.usuarios.find(
                        u => u.username === this.usuario && u.password === this.password
                    );

                    if (usuarioValido) {
                        localStorage.setItem('usuarioLogueado', usuarioValido.username);
                        window.location.href = "../html/menu.html"; 
                    } else {
                        this.errorLogin = true;
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Hubo un problema al conectar con el servidor.");
                });
        }
    }
}