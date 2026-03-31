import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

async function getCines() {
  const contenedor = document.getElementById("contenido-interno");
  contenedor.innerHTML = `<br/><h1>Nuestros Cines</h1><br/><p>Cargando...</p>`;

  try {
    const snapshot = await getDocs(collection(db, "cines"));

    if (snapshot.empty) {
      contenedor.innerHTML = `<br/><h1>Nuestros Cines</h1><br/><p>No hay cines registrados.</p>`;
      return;
    }

    let html = `<br/><h1>Nuestros Cines</h1><br/>`;
    let contador = 1;

    snapshot.forEach((doc) => {
      const c = doc.data();
      const docId = doc.id;
      const imgNum = c.id || contador;
      const imgSuffix = "1"; // imagen principal del cine: ej: 1.1.jpg

      html += `
        <div class="contenido-cine">
          <img src="img/cine/${imgNum}.${imgSuffix}.jpg" width="227" height="170"
               onerror="this.src='img/varios/bg-slider.png'"/>
          <div class="datos-cine">
            <h4>${c.RazonSocial || "Sin nombre"}</h4><br/>
            <span>${c.Direccion || ""}<br/><br/>Teléfono: ${c.Telefonos || ""}</span>
          </div>
          <br/>
          <a href="cine.html?id=${docId}">
            <img src="img/varios/ico-info2.png" width="150" height="40"/>
          </a>
        </div>
      `;
      contador++;
    });

    contenedor.innerHTML = html;

  } catch (error) {
    console.error("Error al obtener cines desde Firebase:", error);
    contenedor.innerHTML = `<br/><h1>Nuestros Cines</h1><br/><p>Error al cargar los cines.</p>`;
  }
}

getCines();
