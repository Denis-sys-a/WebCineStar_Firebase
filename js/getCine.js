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

async function getCine() {
  const contenedor = document.getElementById("contenido-interno");
  const id = getUrlParam("id");

  if (!id) {
    contenedor.innerHTML = `<br/><p>Cine no especificado.</p>`;
    return;
  }

  contenedor.innerHTML = `<br/><p>Cargando...</p>`;

  try {
    const docRef = doc(db, "cines", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      contenedor.innerHTML = `<br/><p>Cine no encontrado.</p>`;
      return;
    }

    const c = docSnap.data();
    const imgNum = c.id || id;

    // Tarifas
    let tarifasHTML = "";
    if (c.tarifas && c.tarifas.length > 0) {
      c.tarifas.forEach((t, i) => {
        const clase = i % 2 !== 0 ? "fila impar" : "fila";
        tarifasHTML += `
          <div class="${clase}">
            <div class="celda-titulo">${t.DiasSemana}</div>
            <div class="celda">${t.Precio}</div>
          </div>
        `;
      });
    }

    // Películas en cartelera del cine
    let peliculasHTML = "";
    if (c.peliculas && c.peliculas.length > 0) {
      c.peliculas.forEach((p, i) => {
        const clase = i % 2 !== 0 ? "fila" : "fila impar";
        peliculasHTML += `
          <div class="${clase}">
            <div class="celda-titulo">${p.Titulo}</div>
            <div class="celda">${p.Horarios}</div>
          </div>
        `;
      });
    }

    const html = `
      <h2>${c.RazonSocial || "Sin nombre"}</h2>
      <div class="cine-info">
        <div class="cine-info datos">
          <p>${c.Direccion || ""}</p>
          <p>Teléfono: ${c.Telefonos || ""}</p>
          <br/>
          <div class="tabla">
            ${tarifasHTML}
          </div>
          <div class="aviso">
            <p>Los precios y horarios están sujetos a cambios sin previo aviso.</p>
          </div>
        </div>
        <img src="img/cine/${imgNum}.2.jpg"
             onerror="this.src='img/varios/bg-slider.png'"/>
        <br/><br/>
        <h4>Los horarios de cada función están sujetos a cambios sin previo aviso.</h4><br/>
        ${peliculasHTML.length > 0 ? `
        <div class="cine-info peliculas">
          <div class="tabla">
            <div class="fila">
              <div class="celda-cabecera">Películas</div>
              <div class="celda-cabecera">Horarios</div>
            </div>
            ${peliculasHTML}
          </div>
        </div>` : ""}
      </div>
      <div>
        <img style="float:left;" src="img/cine/${imgNum}.3.jpg"
             onerror="this.src='img/varios/bg-slider.png'" alt="Imagen del cine"/>
        <span class="tx_gris">
          Precios de los juegos: desde S/1.00 en todos los Cine Star.<br/>
          Horario de atención de juegos es de 12:00 m hasta las 10:30 pm.
          <br/><br/>
          Visítanos y diviértete con nosotros.
          <br/><br/>
          <b>CINESTAR</b>, siempre pensando en tí.
        </span>
      </div>
    `;

    contenedor.innerHTML = html;

  } catch (error) {
    console.error("Error al obtener cine desde Firebase:", error);
    contenedor.innerHTML = `<br/><p>Error al cargar el cine.</p>`;
  }
}

getCine();
