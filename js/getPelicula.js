import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDFGTkxM0Jd5uQzuTDRz_vkk_ssoE4WZTw",
  authDomain: "fir-fdae7.firebaseapp.com",
  projectId: "fir-fdae7",
  storageBucket: "fir-fdae7.firebasestorage.app",
  messagingSenderId: "637019613644",
  appId: "1:637019613644:web:0e568be0dfd450f5511569"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function getUrlParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

async function getPelicula() {
  const contenedor = document.getElementById("contenido-interno");
  const id = getUrlParam("id");

  if (!id) {
    contenedor.innerHTML = `<br/><p>Película no especificada.</p>`;
    return;
  }

  contenedor.innerHTML = `<br/><p>Cargando...</p>`;

  try {
    const docRef = doc(db, "peliculas", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      contenedor.innerHTML = `<br/><p>Película no encontrada.</p>`;
      return;
    }

    const p = docSnap.data();
    const imgNum = p.id || id;

    
    const clasificaciones = { "1": "Todo Público", "2": "+14", "3": "+18" };
    const clasificacion = clasificaciones[p.idClasificacion] || "";

    
    const tipo = p.idEstado === "1" ? "Cartelera" : "Próximos Estrenos";

    
    const generosTexto = p.Geneross || p.Generos || "";

    const html = `
      <br/><h1>${tipo}</h1><br/>
      <div class="contenido-pelicula">
        <div class="datos-pelicula">
          <h2>${p.Titulo || "Sin título"}</h2>
          <p>${p.Sinopsis || ""}</p>
          <br/>
          <div class="tabla">
            <div class="fila">
              <div class="celda-titulo">Título Original :</div>
              <div class="celda">${p.Titulo || ""}</div>
            </div>
            <div class="fila">
              <div class="celda-titulo">Estreno :</div>
              <div class="celda">${p.FechaEstreno || ""}</div>
            </div>
            <div class="fila">
              <div class="celda-titulo">Género :</div>
              <div class="celda">${generosTexto}</div>
            </div>
            <div class="fila">
              <div class="celda-titulo">Director :</div>
              <div class="celda">${p.Director || ""}</div>
            </div>
            <div class="fila">
              <div class="celda-titulo">Clasificación :</div>
              <div class="celda">${clasificacion}</div>
            </div>
            <div class="fila">
              <div class="celda-titulo">Duración :</div>
              <div class="celda">${p.Duracion ? p.Duracion + " min" : ""}</div>
            </div>
            ${p.Reparto ? `
            <div class="fila">
              <div class="celda-titulo">Reparto :</div>
              <div class="celda">${p.Reparto}</div>
            </div>` : ""}
          </div>
        </div>
        <img src="img/pelicula/${imgNum}.jpg" width="160" height="226"
             onerror="this.src='img/varios/btn-mas-info.jpg'"/><br/><br/>
      </div>
      ${p.Link ? `
      <div class="pelicula-video">
        <iframe width="580" height="400"
          src="https://www.youtube.com/embed/${p.Link}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>` : ""}
    `;

    contenedor.innerHTML = html;

  } catch (error) {
    console.error("Error al obtener película desde Firebase:", error);
    contenedor.innerHTML = `<br/><p>Error al cargar la película.</p>`;
  }
}

getPelicula();
