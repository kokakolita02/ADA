# ADA - Desarrollo y despliegue de un sitio web estático en AWS - Nicolás Inostroza, Daniel Ramos y Jeremias Salcedo.
Nuestro proyecto consiste en un servicio de reproducción de música, inspirado en las principales plataformas digitales; Spotify, Apple Music, SoundCloud, etc. Con las funcionalidades de crear listas de reproducción en base al catálogo entregado, buscar canciones y un historial activo.

Fueron utilizadas las tecnologías de Bootstrap, para la estructura del sitio, junto a importaciones de su repositorio CSS y JS. Se utilizaron las inteligencias artificiales de Gemini, ChatGPT y Claude, para la generación de los logos del servicio ficticio y a modo de aprendizaje en los lenguajes requeridos. Además, se usó VS Code para la escritura del código.

Para la Tarea 2 agregamos Alpine.js. Se importa por CDN, igual que Bootstrap, con un <script defer> en el head de index.html y catalogo.html, así que no hay que instalar nada.

Usamos localStorage para guardar datos en el navegador sin necesitar un servidor: la sesión (usuarioLogueado), el historial, las playlists con los favoritos y las sugerencias del formulario. Los datos se mantienen al recargar, pero quedan solo en ese navegador.

Mantenemos una estructura de carpetas de modo que están los archivos agrupados según tipo (dentro de la carpeta HTML):
- html
- css
- js
- image
- music
- json (nueva, tiene canciones.json y usuarios.json)

Nuestras funcionalidades principales son las siguientes:
- Menú principal: página principal una vez se inicia la sesión.
- Reproductor: donde se escucha la música, puedes avanzar, retroceder, pausar, reproducir y agregar canciones a tus favoritos.
- Playlist: lugar donde se agrupan tus canciones, puedes crear listas de reproducción personalizadas y modificar las existentes.
- Historial: guarda el registro de las canciones escuchadas.

Funcionalidades agregadas en la Tarea 2:
- Login (index.html): cambia entre la pantalla de inicio y el login sin recargar, y valida el usuario con usuarios.json.
- Catálogo (catalogo.html): muestra las canciones cargadas desde canciones.json.
- Buscador: filtra el catálogo mientras se escribe, por nombre, artista o género.
- Formulario "¿Sugerir una canción?": nombre y artista son obligatorios, y la sugerencia se guarda en el navegador.
- Sección "¿Cómo funciona?": se muestra u oculta con un botón.
- Reproductor del catálogo: se puede minimizar a una barra pequeña abajo.

Archivo JSON:
Está en HTML/json/canciones.json. Es una lista de 15 canciones y cada una tiene esta forma (las rutas son relativas a la carpeta html):

{
  "id": 1,
  "nombre": "ME JALO",
  "artista": "Grupo Frontera, Fuerza Regida",
  "genero": "Regional mexicano",
  "archivo": "../music/MEJALO.mp3",
  "portada": "../image/MEJALO.jpg"
}


Flujo de carga y filtrado:
1. Al abrir catalogo.html, Alpine inicia explorador() y este llama a cargarCanciones().
2. cargarCanciones() hace un fetch a ../json/canciones.json y guarda las canciones. Si falla, guarda un mensaje de error.
3. Mientras carga se ve "Cargando canciones…".
4. El listado se arma con filtradas, que deja solo las canciones que contienen lo escrito en el buscador (en nombre, artista o género, sin importar mayúsculas ni tildes). Si el buscador está vacío se muestran todas.

Cómo probar:
1. Iniciar sesión con un usuario de usuarios.json (por ejemplo invitado, contraseña invitado) y entrar a Catálogo.
2. Listado: deben aparecer las 15 canciones.
3. Búsqueda: escribir "spinetta" deja 3 canciones, "rock" también deja 3.
4. Formulario: abrir "¿Sugerir una canción?" completar con nombre y artista y enviar, si está vacío sale un error.
5. Sección que se muestra u oculta: el botón "¿Cómo funciona?" muestra la ayuda y al presionarlo otra vez la oculta.

La dirección IP utilizada para el despliegue es: 54.221.86.111

Limitaciones conocidas:
- Al recargar la página se pierde lo que maneja Alpine: lo escrito en el buscador, la ayuda o el formulario abiertos, lo escrito en el formulario sin enviar y la canción que está sonando. En index.html se vuelve a la pantalla de inicio.
- Se mantienen la sesión, el historial, las playlists y las sugerencias porque están en localStorage, pero solo en ese navegador.
- Las sugerencias no se envían a ningún servidor y tampoco se pueden ver desde el sitio.
- El catálogo está en canciones.json y también en catalogo.js, si se agrega una canción hay que agregarla en los dos.
- Si el buscador no encuentra nada, no se muestra ningún mensaje.
- El login es solo de prueba, las credenciales están en un JSON público.
- El sitio necesita internet para cargar Bootstrap, Font Awesome y Alpine.js desde CDN.
