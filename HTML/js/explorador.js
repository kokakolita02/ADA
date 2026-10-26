

function explorador() {
    return {
        // Estado
        canciones: [],
        busqueda: "",
        cargando: true,
        error: "",
        mostrarAyuda: false,

        // Reproductor
        mostrarReproductor: false,
        cancionActual: null,
        reproduciendo: false,
        progreso: 0,

        // Carga de datos
        async init() {
            const audio = document.getElementById("audio");
            if (audio) {
                audio.addEventListener("play", () => { this.reproduciendo = true; });
                audio.addEventListener("pause", () => { this.reproduciendo = false; });
                audio.addEventListener("timeupdate", () => {
                    this.progreso = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
                });
                audio.addEventListener("loadedmetadata", () => this.sincronizarCancion());
            }

            await this.cargarCanciones();
        },

        async cargarCanciones() {
            this.cargando = true;
            this.error = "";
            try {
                const respuesta = await fetch("../json/canciones.json");
                if (!respuesta.ok) {
                    throw new Error("El servidor respondió " + respuesta.status);
                }
                this.canciones = await respuesta.json();
            } catch (e) {
                console.error("No se pudo cargar el catálogo:", e);
                this.canciones = [];
                this.error = "No se pudo cargar el catálogo de canciones. Intenta nuevamente.";
            } finally {
                this.cargando = false;
            }
        },

        // Búsqueda
        normalizar(texto) {
            return String(texto)
                .toLowerCase()
                .normalize("NFD")
                .replace(/[̀-ͯ]/g, "");
        },

        get filtradas() {
            const texto = this.normalizar(this.busqueda.trim());
            if (texto === "") return this.canciones;
            return this.canciones.filter((c) =>
                this.normalizar(c.nombre).includes(texto) ||
                this.normalizar(c.artista).includes(texto) ||
                this.normalizar(c.genero).includes(texto)
            );
        },

        // Reproductor
        puedeReproducir(c) {
            return Boolean(c.archivo);
        },

        get miniVisible() {
            return this.cancionActual !== null && !this.mostrarReproductor;
        },

        reproducir(c) {
            const indice = catalogo.findIndex((x) => x.archivo === c.archivo);
            if (indice === -1) return;

            this.cancionActual = c;
            this.mostrarReproductor = true;

            indiceActual = indice;
            cargarCancion(indiceActual);
            indiceActual = indice;
            cargarCancion(indiceActual);
            guardarHistorial();

            document.getElementById("audio").play()
                .catch((err) => console.log("Autoplay bloqueado por el navegador:", err));
        },

        // Cuando reproductor.js cambia de canción con siguiente, anterior o fin
        sincronizarCancion() {
            if (this.cancionActual === null) return;
            const actual = catalogo[indiceActual];
            if (!actual) return;
            const c = this.canciones.find((x) => x.archivo === actual.archivo);
            if (c) this.cancionActual = c;
        },

        minimizar() {
            this.mostrarReproductor = false;
        },

        expandir() {
            this.mostrarReproductor = true;
        },

        alternarPlay() {
            const audio = document.getElementById("audio");
            if (audio.paused) {
                audio.play().catch((err) => console.log("No se pudo reproducir:", err));
            } else {
                audio.pause();
            }
        },

        siguiente() { cancionSiguiente(); },
        anterior() { cancionAnterior(); },

        detener() {
            document.getElementById("audio").pause();
            this.mostrarReproductor = false;
            this.cancionActual = null;
        }
    };
}