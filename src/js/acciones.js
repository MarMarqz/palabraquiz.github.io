import * as funciones from "./funciones.js";

document.addEventListener("DOMContentLoaded", function () {
  funciones.cronometro(1200); // Inicia el cronómetro con 20 minutos
  funciones.cargarTema("preguntas_respuestas");

  funciones.ObtenerID("btn_reanudar").style.display = "none";
  funciones.ObtenerID("btn-refrescar_pagina").style.display = "none";

  funciones.Onclick("btn_pausa", function () {
    funciones.pausarCronometro();
    funciones.ObtenerID("respuesta").disabled = true;
    funciones.ObtenerID("btn_validar").disabled = true;
    funciones.ObtenerID("btn_pausa").style.display = "none";
    funciones.ObtenerID("btn_reanudar").style.display = "inline-block";
    funciones.cronometroSecundario(120, "respuesta"); // Muestra el cronómetro secundario
  });

  funciones.Onclick("btn_reanudar", function () {
    funciones.reanudarCronometro();
    funciones.ocultarCronometroSecundario("respuesta"); // Oculta el cronómetro secundario y activa el input
    funciones.ObtenerID("respuesta").disabled = false;
    funciones.ObtenerID("btn_validar").disabled = false;
    funciones.ObtenerID("btn_pausa").style.display = "inline-block";
    funciones.ObtenerID("btn_reanudar").style.display = "none";
  });

  funciones.Onclick("dark-mode", function () {
    funciones.toggleDarkMode();
  });

  funciones.Onclick("btn_validar", function () {
    funciones.validarRespuesta();
  });

  funciones.ObtenerID("respuesta").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      funciones.validarRespuesta();
    }
  });

  funciones.Onclick("btn-refrescar", function () {
    location.reload();
  });
  funciones.Onclick("btn-refrescar_pagina", function () {
    location.reload();
  });

  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
      e.preventDefault();
    }
  });

  // Mapeo de botones con su tema correspondiente
  const btns = {
    btn_general: "preguntas_respuestas",
    btn_deportes: "sports",
    btn_cultura_pop: "popculture",
    btn_tecnologia: "tecnologia",
    btn_ciencia: "ciencia",
    btn_geografia: "geografia",
    btn_idiomas: "idiomas",
    btn_historia: "historia",
  };

  funciones.ObtenerID("btn_cambiar_pregunta").addEventListener("click", () => {
    funciones.cambiarPalabra();
  });


  // Recorremos el objeto y asignamos los listeners dinámicamente
  Object.entries(btns).forEach(([id, tema]) => {
    funciones.ObtenerID(id).addEventListener("click", () => {
      funciones.cargarTema(tema);
    });
  });

  const botones = document.querySelectorAll(".bt_seccion");

  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      botones.forEach((b) => b.classList.remove("activo"));
      btn.classList.add("activo");
    });
  });

  // funciones.mostrarModalTiempo();

  // Esto muestra la descripcion actual, nota, siempre dejar al final
  funciones.mostrarDescripcion();
});
