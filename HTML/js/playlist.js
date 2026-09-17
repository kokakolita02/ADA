// ============================================================
// ADA MUSIC - Playlists
// Usa la variable global 'catalogo' (js/catalogo.js) y guarda
// las playlists en localStorage porque no hay backend todavía.
// ============================================================

const CLAVE_PLAYLISTS = "ada_playlists";
let playlists = [];
let idPlaylistAbierta = null; // null = estamos viendo el listado, no el detalle

// Referencias al HTML
const vistaListado = document.getElementById("vistaListado");
const vistaDetalle = document.getElementById("vistaDetalle");
const contenedorPlaylists = document.getElementById("contenedorPlaylists");
const mensaje = document.getElementById("mensaje");

const detalleNombre = document.getElementById("detalleNombre");
const detalleDescripcion = document.getElementById("detalleDescripcion");
const detalleTotal = document.getElementById("detalleTotal");
const contenedorCanciones = document.getElementById("contenedorCanciones");

const formCrear = document.getElementById("formCrear");
const inputNombre = document.getElementById("inputNombre");
const inputDescripcion = document.getElementById("inputDescripcion");
const errorNombre = document.getElementById("errorNombre");

const selectCancion = document.getElementById("selectCancion");

const modalCrear = new bootstrap.Modal(document.getElementById("modalCrear"));
const modalAgregar = new bootstrap.Modal(document.getElementById("modalAgregar"));

function cargarPlaylists() {
    const guardado = localStorage.getItem(CLAVE_PLAYLISTS);

    if (guardado === null) {
        // Playlists de ejemplo para la primera vez que se abre la página
        playlists = [
            { id: 1, nombre: "Recomendado por RlNaiko64", descripcion: "Una selección para descubrir cosas nuevas.", canciones: [0, 1] },
            { id: 2, nombre: "Para Estudiar", descripcion: "Música tranquila para concentrarse.", canciones: [5, 6] }
        ];
        guardarPlaylists();
        return;
    }

    playlists = JSON.parse(guardado);
}

function guardarPlaylists() {
    localStorage.setItem(CLAVE_PLAYLISTS, JSON.stringify(playlists));
}

// Usamos == (no ===) porque el id puede venir como número (Date.now())
// o como texto ("favoritos", el id fijo de la playlist del corazón)
function buscarPlaylistPorId(id) {
    return playlists.find((p) => p.id == id);
}

function mostrarMensaje(texto, tipo) {
    mensaje.className = "alert alert-" + tipo;
    mensaje.textContent = texto;
    mensaje.classList.remove("d-none");
    setTimeout(() => mensaje.classList.add("d-none"), 3000);
}

function renderListado() {
    if (playlists.length === 0) {
        contenedorPlaylists.innerHTML = `<div class="col-12"><div class="estado-vacio-oscuro">
                <p class="mb-0">Todavía no tienes playlists.</p>
            </div></div>`;
        return;
    }

    contenedorPlaylists.innerHTML = playlists.map((p) => {
        const portada = p.canciones.length > 0 ? catalogo[p.canciones[0]].portada : "../image/logochico.png";

        return `
            <div class="col">
                <div class="card shadow-sm h-100 playlist-card-dark">
                    <img src="${portada}" class="card-img-top" alt="Portada de ${p.nombre}"
                         onerror="this.src='../image/logochico.png'">
                    <div class="card-body text-light">
                        <h5 class="card-title fw-bold text-truncate">${p.nombre}</h5>
                        <p class="card-text playlist-desc-dark">${p.descripcion || "Sin descripción"}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-morado" onclick="reproducirPlaylist('${p.id}')">
                                    <i class="fa fa-play"></i> Reproducir
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-light" onclick="abrirPlaylist('${p.id}')">Editar</button>
                            </div>
                            <small class="playlist-desc-secundario">${p.canciones.length} canciones</small>
                        </div>
                    </div>
                </div>
            </div>`;
    }).join("");
}

function abrirPlaylist(id) {
    idPlaylistAbierta = id;
    vistaListado.classList.add("d-none");
    vistaDetalle.classList.remove("d-none");
    renderDetalle();
}

function volverAlListado() {
    idPlaylistAbierta = null;
    vistaDetalle.classList.add("d-none");
    vistaListado.classList.remove("d-none");
    renderListado();
}

function renderDetalle() {
    const playlist = buscarPlaylistPorId(idPlaylistAbierta);

    detalleNombre.textContent = playlist.nombre;
    detalleDescripcion.textContent = playlist.descripcion || "Sin descripción";
    detalleTotal.textContent = playlist.canciones.length + " canciones";

    if (playlist.canciones.length === 0) {
        contenedorCanciones.innerHTML = `<div class="estado-vacio-oscuro">
                <p class="mb-0">Vacía por ahora. Usa "Agregar canciones".</p>
            </div>`;
        return;
    }

    contenedorCanciones.innerHTML = playlist.canciones.map((indice, i) => {
        const c = catalogo[indice];
        return `
            <div class="fila-cancion">
                <span class="fw-bold playlist-desc-secundario">${i + 1}</span>
                <img class="mini-portada" src="${c.portada}" alt="Portada de ${c.nombre}" onerror="this.src='../image/logochico.png'">
                <div class="cancion-datos">
                    <p class="cancion-titulo text-truncate">${c.nombre}</p>
                    <p class="cancion-artista text-truncate">${c.artista}</p>
                </div>
                <button class="btn-icono" type="button" title="Reproducir" onclick="reproducirCancion(${indice})">
                    <i class="fa fa-play"></i>
                </button>
            </div>`;
    }).join("");
}

// Manda una canción al reproductor (misma clave que usa la búsqueda del header)
function reproducirCancion(indice) {
    localStorage.setItem("cancionBuscada", indice);
    window.location.href = "reproductor.html";
}

// Reproduce la primera canción de una playlist (desde la tarjeta o el detalle)
function reproducirPlaylist(id) {
    const playlist = buscarPlaylistPorId(id);

    if (playlist.canciones.length === 0) {
        mostrarMensaje("Esa playlist está vacía, agrégale canciones primero.", "warning");
        return;
    }

    reproducirCancion(playlist.canciones[0]);
}

function eliminarPlaylist() {
    const playlist = buscarPlaylistPorId(idPlaylistAbierta);

    if (!confirm(`¿Eliminar la playlist "${playlist.nombre}"?`)) return;

    playlists = playlists.filter((p) => p.id != idPlaylistAbierta);
    guardarPlaylists();
    volverAlListado();
    mostrarMensaje(`Playlist "${playlist.nombre}" eliminada.`, "success");
}

formCrear.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = inputNombre.value.trim();

    let error = "";
    if (nombre === "") error = "El nombre es obligatorio.";
    else if (nombre.length < 3) error = "Debe tener al menos 3 caracteres.";
    else if (playlists.some((p) => p.nombre.toLowerCase() === nombre.toLowerCase())) error = "Ya existe una playlist con ese nombre.";

    if (error !== "") {
        inputNombre.classList.add("is-invalid");
        errorNombre.textContent = error;
        return;
    }

    inputNombre.classList.remove("is-invalid");
    playlists.push({ id: Date.now(), nombre, descripcion: inputDescripcion.value.trim(), canciones: [] });
    guardarPlaylists();
    formCrear.reset();
    modalCrear.hide();
    renderListado();
    mostrarMensaje(`Playlist "${nombre}" creada correctamente.`, "success");
});

inputNombre.addEventListener("input", () => inputNombre.classList.remove("is-invalid"));

function abrirModalAgregar() {
    // Llena el <select> con las canciones del catálogo que
    // todavía no están en esta playlist
    const playlist = buscarPlaylistPorId(idPlaylistAbierta);

    selectCancion.innerHTML = "";

    catalogo.forEach((c, indice) => {
        if (!playlist.canciones.includes(indice)) {
            const opcion = document.createElement("option");
            opcion.value = indice;
            opcion.textContent = c.nombre + " - " + c.artista;
            selectCancion.appendChild(opcion);
        }
    });

    if (selectCancion.options.length === 0) {
        selectCancion.innerHTML = `<option value="">Ya agregaste todas las canciones</option>`;
    }

    modalAgregar.show();
}

function agregarCancionSeleccionada() {
    const indice = selectCancion.value;

    if (indice === "") return;

    const playlist = buscarPlaylistPorId(idPlaylistAbierta);
    playlist.canciones.push(Number(indice));
    guardarPlaylists();
    renderDetalle();
    modalAgregar.hide();
    mostrarMensaje(`Se agregó "${catalogo[indice].nombre}" a la playlist.`, "success");
}



document.getElementById("btnVolver").addEventListener("click", volverAlListado);
document.getElementById("btnReproducirPlaylist").addEventListener("click", () => reproducirPlaylist(idPlaylistAbierta));
document.getElementById("btnEliminarPlaylist").addEventListener("click", eliminarPlaylist);
document.getElementById("btnAgregarCanciones").addEventListener("click", abrirModalAgregar);
document.getElementById("btnConfirmarAgregar").addEventListener("click", agregarCancionSeleccionada);

cargarPlaylists();
renderListado();