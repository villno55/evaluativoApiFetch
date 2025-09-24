const formLogin = document.getElementById("form-login");
const loginContenedor = document.getElementById("login-contenedor");
const appContenedor = document.getElementById("app-contenedor");
const mostrarUsuario = document.getElementById("mostrar-usuario");
const btnSalir = document.getElementById("btn-salir");
const comboFichas = document.getElementById("combo-fichas");
const txtBuscar = document.getElementById("txt-buscar");
const cuerpoTabla = document.querySelector("#tabla-aprendices tbody");

const API_URL = "https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/SENA-CTPI.matriculados.json";
let listaDatos = [];

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = document.getElementById("usuario").value.trim();
  const clave = document.getElementById("clave").value.trim();

  if (clave === "adso3064975" && usuario !== "") {
    localStorage.setItem("usuario", usuario);
    mostrarApp();
  } else {
    alert("Usuario o contraseña incorrectos");
  }
});

function mostrarApp() {
  const usuario = localStorage.getItem("usuario");
  if (usuario) {
    mostrarUsuario.textContent = usuario;
    loginContenedor.classList.add("hidden");
    appContenedor.classList.remove("hidden");
    cargarDatos();
  }
}

btnSalir.addEventListener("click", () => {
  localStorage.clear();
  appContenedor.classList.add("hidden");
  loginContenedor.classList.remove("hidden");
});

async function cargarDatos() {
  try {
    const res = await fetch(API_URL);
    const datos = await res.json();
    listaDatos = datos;

    const fichasUnicas = [...new Set(datos.map(a => a.FICHA))];
    comboFichas.innerHTML = `<option value="">Seleccione...</option>`;
    fichasUnicas.forEach(f => {
      comboFichas.innerHTML += `<option value="${f}">${f}</option>`;
    });

  } catch (error) {
    console.error("Error al cargar datos:", error);
    alert("No se pudo cargar la información.");
  }
}

comboFichas.addEventListener("change", () => {
  const fichaSel = comboFichas.value;
  if (fichaSel) {
    const lista = listaDatos.filter(a => a.FICHA == fichaSel);
    mostrarAprendices(lista);

    const infoFicha = lista[0];
    localStorage.setItem("ficha", JSON.stringify({
      codigo: infoFicha.FICHA,
      programa: infoFicha.PROGRAMA,
      nivel: infoFicha.NIVEL_DE_FORMACION,
      estado: infoFicha.ESTADO_FICHA
    }));
  }
});

txtBuscar.addEventListener("input", () => {
  const texto = txtBuscar.value.toLowerCase();
  const lista = listaDatos.filter(a => a.PROGRAMA.toLowerCase().includes(texto));
  mostrarAprendices(lista);
});

function mostrarAprendices(lista) {
  cuerpoTabla.innerHTML = "";
  lista.forEach(a => {
    const tr = document.createElement("tr");
    if (a.ESTADO_APRENDIZ && a.ESTADO_APRENDIZ.toLowerCase() === "retiro voluntario") {
      tr.classList.add("retiro");
    }
    tr.innerHTML = `
      <td>${a.NUMERO_DOCUMENTO}</td>
      <td>${a.NOMBRE} ${a.PRIMER_APELLIDO} ${a.SEGUNDO_APELLIDO}</td>
      <td>${a.FICHA}</td>
      <td>${a.PROGRAMA}</td>
      <td>${a.ESTADO_APRENDIZ}</td>
    `;
    cuerpoTabla.appendChild(tr);
  });
}

if (localStorage.getItem("usuario")) {
  mostrarApp();
} else {
  loginContenedor.classList.remove("hidden");
  appContenedor.classList.add("hidden");
                         }
