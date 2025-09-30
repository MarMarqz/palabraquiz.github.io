export function ObtenerID(elemento) {
  return document.getElementById(elemento);
}

export function ObtenerValor(elemento) {
  return document.getElementById(elemento).value;
}

export function Onclick(elementId, funcion) {
  var element = ObtenerID(elementId);
  if (element) {
    element.onclick = funcion;
    // console.log("funcion: ",funcion)
  } else {
    console.warn("Elemento no encontrado: " + elementId);
  }
}

function showToast(type, title, duracion = 5000) {
  butterup.options.toastLife = duracion ?? 5000; // <-- Aquí cambias la duración global
  butterup.toast({
    title: title,
    location: "top-center",
    icon: true,
    dismissable: true,
    type: type,
  });
}

// Toast Warning
function success() {
  showToast(
    "success",
    "Te la rifaste carnal"
  );
}

// Toast error
function error() {
  showToast(
    "error",
    "Está Mal carnal"
  );
}

let data = {};
let letras = [];
let indiceLetra = 0;
let palabraActual = null;
let descripcionesActuales = [];
let indiceDescripcion = 0;
let cambiosPorLetra = {}; // ← contador por letra
const MAX_CAMBIOS_POR_LETRA = 4;

// Mostrar una nueva palabra con su primera descripción
export function mostrarDescripcion() {
  const letra = letras[indiceLetra];
  const lista = data[letra];

  const entradaAleatoria = lista[Math.floor(Math.random() * lista.length)];
  palabraActual = entradaAleatoria.palabra.toLowerCase();

  descripcionesActuales = lista
    .filter((item) => item.palabra.toLowerCase() === palabraActual)
    .map((item) => item.descripcion);

  indiceDescripcion = 0;

  ObtenerID("letra").textContent = letra;
  ObtenerID("descripcion-text").textContent =
    descripcionesActuales[indiceDescripcion];
  ObtenerID("respuesta").value = "";
}

// Cambiar de palabra (máximo 4 veces por letra)
export function cambiarPalabra() {
  const letraActual = letras[indiceLetra];
  const cambios = cambiosPorLetra[letraActual] || 0;

  if (cambios >= MAX_CAMBIOS_POR_LETRA) {
    showToast(
      "warning",
      `Ya hiciste ${MAX_CAMBIOS_POR_LETRA} cambios para la letra "${letraActual}".`
    );
    return;
  }

  cambiosPorLetra[letraActual] = cambios + 1;
  mostrarDescripcion();
}

// Cargar tema desde archivo JSON
export function cargarTema(nombreArchivo) {
  fetch(`./src/js/${nombreArchivo}.json`)
    .then((res) => res.json())
    .then((json) => {
      data = json;
      letras = Object.keys(data).sort();
      indiceLetra = 0;
      cambiosPorLetra = {}; // ← reinicia el mapa de cambios
      mostrarDescripcion();
      cronometro(1200); // Reinicia el cronómetro a 20 minutos
    })
    .catch((err) =>
      console.error(`Error cargando ${nombreArchivo}.json:`, err)
    );
}

// Validar Respuesta
export function validarRespuesta() {
  const respuesta = ObtenerValor("respuesta").trim().toLowerCase();
  if (respuesta === palabraActual) {
    success();
    indiceLetra++;
    if (indiceLetra < letras.length) {
      mostrarDescripcion();
    } else {
      ObtenerID("descripcion-text").textContent =
        "🎉 ¡Has terminado todas las letras!, te la rifaste fernando";
        pausarCronometro();
        MostrarConfetti();
        ObtenerID("respuesta").disabled = true;
        ObtenerID("btn_validar").disabled = true;
        ObtenerID("btn_validar").style.display = "none";
        ObtenerID("btn_pausa").style.display = "none";
        ObtenerID("btn_reanudar").style.display = "none";
        ObtenerID("btn-refrescar_pagina").style.display = "block";
        ObtenerID("btn_cambiar_pregunta").style.display = "none";
    }
  } else {
   error();
  }
}

// Cronometro principal
let intervaloCronometro;
let tiempoRestante = 1200; // 10 minutos

export function cronometro(segundos = 1200) {
  clearInterval(intervaloCronometro);
  tiempoRestante = segundos;
  const cronometroElemento = ObtenerID("cronometro");
  actualizarCronometro(tiempoRestante, cronometroElemento);

  intervaloCronometro = setInterval(() => {
    tiempoRestante--;
    actualizarCronometro(tiempoRestante, cronometroElemento);
    if (tiempoRestante <= 0) {
      clearInterval(intervaloCronometro);
      mostrarModalTiempo();
      ObtenerID("respuesta").disabled = true;
      ObtenerID("btn_validar").disabled = true;
      ObtenerID("btn_pausa").style.display = "none";
      ObtenerID("btn_reanudar").style.display = "none";
    }
  }, 1000);
}

export function pausarCronometro() {
  clearInterval(intervaloCronometro);
}

export function reanudarCronometro() {
  clearInterval(intervaloCronometro);
  const cronometroElemento = ObtenerID("cronometro");
  intervaloCronometro = setInterval(() => {
    tiempoRestante--;
    actualizarCronometro(tiempoRestante, cronometroElemento);
    if (tiempoRestante <= 0) {
      clearInterval(intervaloCronometro);
      // Aquí puedes agregar lógica cuando el tiempo termine
    }
  }, 1000);
}

function actualizarCronometro(segundos, elemento) {
  const min = Math.floor(segundos / 60)
    .toString()
    .padStart(2, "0");
  const seg = (segundos % 60).toString().padStart(2, "0");
  elemento.textContent = `${min}:${seg}`;
}

export function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
}

function mostrarModalTiempo() {
  const modal = ObtenerID("modal-tiempo");
  modal.classList.remove("hidden");

  // Bloquear clicks fuera del modal (ya lo hace el overlay con bg-black bg-opacity-70)
  // pero evitamos que se cierre accidentalmente
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      e.stopPropagation();
    }
  });
}


// Cronometro de pausa
let intervaloCronometro2;
let tiempoRestante2 = 120; // 2 minutos

export function cronometroSecundario(
  segundos = 120,
  idElementoActivar = "respuesta"
) {
  clearInterval(intervaloCronometro2);
  tiempoRestante2 = segundos;
  const cronometroElemento2 = ObtenerID("cronometro2");
  cronometroElemento2.style.display = "inline"; // Mostrar el cronómetro secundario
  actualizarCronometro(tiempoRestante2, cronometroElemento2);

  intervaloCronometro2 = setInterval(() => {
    tiempoRestante2--;
    actualizarCronometro(tiempoRestante2, cronometroElemento2);
    if (tiempoRestante2 <= 0) {
      clearInterval(intervaloCronometro2);
      cronometroElemento2.style.display = "none"; // Ocultar el cronómetro secundario
      const elemento = ObtenerID(idElementoActivar);
      if (elemento) elemento.disabled = false;

      // Mostrar el botón de pausa y ocultar el de reanudar
      const btnPausa = ObtenerID("btn_pausa");
      const btnReanudar = ObtenerID("btn_reanudar");
      if (btnPausa) btnPausa.style.display = "inline-block";
      if (btnReanudar) btnReanudar.style.display = "none";

      // Reanudar el cronómetro principal automáticamente
      reanudarCronometro();
    }
  }, 1000);
}

export function ocultarCronometroSecundario(idElementoActivar = "respuesta") {
  clearInterval(intervaloCronometro2);
  const cronometroElemento2 = ObtenerID("cronometro2");
  cronometroElemento2.style.display = "none";
  const elemento = ObtenerID(idElementoActivar);
  if (elemento) elemento.disabled = false;
}

function MostrarConfetti(){
     const duration = 2 * 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      }
    }));
  }, 250);
}