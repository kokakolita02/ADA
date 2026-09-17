let indiceActual = 0;

const audio = document.getElementById("audio");
const portadaImg = document.getElementById("portada");
const nombreCancion = document.getElementById("nombreCancion");
const nombreArtista = document.getElementById("nombreArtista");
const btnPlayPause = document.getElementById("btnPlayPause");
const iconoPlayPause = document.getElementById("iconoPlayPause");
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const barraProgreso = document.getElementById("barraProgreso");
const tiempoActual = document.getElementById("tiempoActual");
const tiempoTotal = document.getElementById("tiempoTotal");
const btnFavorito = document.getElementById("btnFavorito");
const iconoFavorito = document.getElementById("iconoFavorito");

const CLAVE_PLAYLISTS = "ada_playlists";
const ID_FAVORITOS = "favoritos";

// datos de la canción
function cargarCancion(indice) {
    const cancion = catalogo[indice];
    audio.src = cancion.archivo;
    portadaImg.src = cancion.portada;
    nombreCancion.textContent = cancion.nombre;
    nombreArtista.textContent = cancion.artista;
    barraProgreso.value = 0;
    tiempoActual.textContent = "0:00";
    tiempoTotal.textContent = "0:00";
    actualizarIconoFavorito();
}

// Guarda la canción en el historial
function guardarHistorial() {
    let historial = localStorage.getItem("historial");
    if (historial == null) {
        historial = "";
    }
    historial = catalogo[indiceActual].nombre + "," + historial;
    localStorage.setItem("historial", historial);
}

// Convierte segundos a minutos
function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = Math.floor(segundos % 60);
    const segundosTexto = segundosRestantes < 10 ? "0" + segundosRestantes : segundosRestantes;
    return minutos + ":" + segundosTexto;
}

// Busca la playlist "Favoritos" en localStorage o la crea si es la primera vez
function obtenerFavoritos() {
    let playlists = JSON.parse(localStorage.getItem(CLAVE_PLAYLISTS)) || [];
    let favoritos = playlists.find((p) => p.id === ID_FAVORITOS);
    if (!favoritos) {
        favoritos = { id: ID_FAVORITOS, nombre: "Favoritos", descripcion: "Tus canciones favoritas.", canciones: [] };
        playlists.push(favoritos);
        localStorage.setItem(CLAVE_PLAYLISTS, JSON.stringify(playlists));
    }
    return { playlists, favoritos };
}

// Agrega o saca la canción actual de Favoritos
function alternarFavorito() {
    const { playlists, favoritos } = obtenerFavoritos();
    if (favoritos.canciones.includes(indiceActual)) {
        favoritos.canciones = favoritos.canciones.filter((i) => i !== indiceActual);
    } else {
        favoritos.canciones.push(indiceActual);
    }
    localStorage.setItem(CLAVE_PLAYLISTS, JSON.stringify(playlists));
    actualizarIconoFavorito();
}

// Pinta el corazón lleno o vacío 
function actualizarIconoFavorito() {
    const { favoritos } = obtenerFavoritos();
    const esFavorita = favoritos.canciones.includes(indiceActual);
    iconoFavorito.classList.toggle("fa-solid", esFavorita);
    iconoFavorito.classList.toggle("fa-regular", !esFavorita);
}

function reproducirPausar() {
    if (audio.paused) {
        audio.play()
            .then(() => {
                iconoPlayPause.classList.remove("fa-play");
                iconoPlayPause.classList.add("fa-pause");
                btnPlayPause.setAttribute("aria-label", "Pausar");
            })
            .catch((error) => {
                console.error("No se pudo reproducir el audio:", error, "src:", audio.src);
            });
    } else {
        audio.pause();
        iconoPlayPause.classList.remove("fa-pause");
        iconoPlayPause.classList.add("fa-play");
        btnPlayPause.setAttribute("aria-label", "Reproducir");
    }
}

function cancionSiguiente() {
    indiceActual = (indiceActual + 1) % catalogo.length;
    cargarCancion(indiceActual);
    guardarHistorial();
    audio.play()
        .then(() => {
            iconoPlayPause.classList.remove("fa-play");
            iconoPlayPause.classList.add("fa-pause");
        })
        .catch((error) => {
            console.error("No se pudo reproducir el audio:", error, "src:", audio.src);
        });
}

function cancionAnterior() {
    indiceActual = (indiceActual - 1 + catalogo.length) % catalogo.length;
    cargarCancion(indiceActual);
    guardarHistorial();
    audio.play()
        .then(() => {
            iconoPlayPause.classList.remove("fa-play");
            iconoPlayPause.classList.add("fa-pause");
        })
        .catch((error) => {
            console.error("No se pudo reproducir el audio:", error, "src:", audio.src);
        });
}

if (audio) {
    // Botones
    btnPlayPause.addEventListener("click", reproducirPausar);
    btnAnterior.addEventListener("click", cancionAnterior);
    btnSiguiente.addEventListener("click", cancionSiguiente);
    btnFavorito.addEventListener("click", alternarFavorito);

    // Duración de la canción
    audio.addEventListener("loadedmetadata", () => {
        tiempoTotal.textContent = formatearTiempo(audio.duration);
    });

    // Avance de la canción
    audio.addEventListener("timeupdate", () => {
        tiempoActual.textContent = formatearTiempo(audio.currentTime);
        barraProgreso.value = (audio.currentTime / audio.duration) * 100 || 0;
    });

    // Barra de progreso
    barraProgreso.addEventListener("input", () => {
        audio.currentTime = (barraProgreso.value / 100) * audio.duration;
    });

    // Cuando termina pasa a la siguiente
    audio.addEventListener("ended", cancionSiguiente);

    // Error del audio
    audio.addEventListener("error", () => {
        console.error("Error cargando el audio. Revisa la ruta:", audio.src);
    });

    // Canción buscada desde el menú
    let cancionBuscada = localStorage.getItem("cancionBuscada");
    if (cancionBuscada != null) {
        indiceActual = Number(cancionBuscada);
        localStorage.removeItem("cancionBuscada");
    }

    cargarCancion(indiceActual);
}