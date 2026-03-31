import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

async function getPeliculas() {
  const contenedor = document.getElementById("contenido-interno");
  const tipo = getUrlParam("id");

  let titulo = "Películas";
  let idEstado = null;

  if (tipo === "cartelera") {
    titulo = "Cartelera";
    idEstado = "1";
  } else if (tipo === "estrenos") {
    titulo = "Próximos Estrenos";
    idEstado = "2";
  }

  contenedor.innerHTML = `<br/><h1>${titulo}</h1><br/><p>Cargando...</p>`;

  try {
    let peliculasQuery;

    if (idEstado) {
      peliculasQuery = query(
        collection(db, "peliculas"),
        where("idEstado", "==", idEstado)
      );
    } else {
      peliculasQuery = collection(db, "peliculas");
    }

    const snapshot = await getDocs(peliculasQuery);

    if (snapshot.empty) {
      contenedor.innerHTML = `<br/><h1>${titulo}</h1><br/><p>No se encontraron películas.</p>`;
      return;
    }

    let html = `<br/><h1>${titulo}</h1><br/>`;

    snapshot.forEach((doc) => {
      const p = doc.data();
      const docId = doc.id;
      // Filtrar por idEstado si se especifico
      if (idEstado && String(p.idEstado) !== idEstado) return;
      
      const imgNum = p.id || docId;
      const sinopsis = p.Sinopsis ? p.Sinopsis.substring(0, 180) + "..." : "";
      const youtubeLink = p.Link ? `https://www.youtube.com/v/${p.Link}` : "#";

      html += `
        <div class="contenido-pelicula">
          <div class="datos-pelicula">
            <h2>${p.Titulo || "Sin título"}</h2><br/>
            <p>${sinopsis}</p>
            <br/>
            <div class="boton-pelicula">
              <a href="pelicula.html?id=${docId}">
                <img src="img/varios/btn-mas-info.jpg" width="120" height="30" alt="Ver info"/>
              </a>
            </div>
            ${p.Link ? `
            <div class="boton-pelicula">
              <a href="${youtubeLink}" target="_blank">
                <img src="img/varios/btn-trailer.jpg" width="120" height="30" alt="Ver trailer"/>
              </a>
            </div>` : ""}
          </div>
          <img src="img/pelicula/${imgNum}.jpg" width="160" height="226"
               onerror="this.src='img/varios/btn-mas-info.jpg'"/><br/><br/>
        </div>
      `;
    });

    contenedor.innerHTML = html;

  } catch (error) {
    console.error("Error al obtener películas desde Firebase:", error);
    contenedor.innerHTML = `<br/><h1>${titulo}</h1><br/><p>Error al cargar las películas.</p>`;
  }
}

getPeliculas();
