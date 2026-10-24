
document.addEventListener("DOMContentLoaded", function () {

  // Esta función permite leer información guardada en el navegador.
  // JSON.parse convierte el texto guardado en datos de JavaScript.
  // Si ocurre un error o no hay información, devuelve el valor por defecto.
  const leer = (clave, defecto) => {
    try { return JSON.parse(localStorage.getItem(clave)) ?? defecto; }
    catch (error) { return defecto; }
  };

  // Esta función guarda información en el navegador.
  // JSON.stringify convierte los datos en texto para poder almacenarlos.
  const guardar = (clave, valor) => localStorage.setItem(clave, JSON.stringify(valor));

  // Obtenemos la fecha actual.
  const hoy = new Date();

  // Creamos una fecha con el formato año-mes-día.
  // Esto nos permite identificar qué información corresponde al día actual.
  const claveDia = hoy.getFullYear() + "-" + String(hoy.getMonth() + 1).padStart(2, "0") + "-" + String(hoy.getDate()).padStart(2, "0");

  // Convertimos la fecha actual en un texto que se pueda mostrar en español.
  const fechaTexto = hoy.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });

  // Mostramos la fecha en el elemento correspondiente del HTML.
  // La primera letra se convierte en mayúscula.
  document.getElementById("fecha-hoy").textContent = fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1);



  // LISTA RÁPIDA DE TAREAS
 

  // Recuperamos las tareas rápidas guardadas.
  // Si todavía no hay ninguna, empezamos con una lista vacía.
  let rapidas = leer("logra_todo_rapido", []);

  // Buscamos en el HTML la lista y el mensaje que aparece cuando está vacía.
  const listaRapida = document.getElementById("lista-rapida");
  const vacioRapido = document.getElementById("vacio-rapido");

  // Esta función muestra las tareas rápidas en la página.
  function pintarRapidas() {

    // Limpiamos la lista antes de volver a mostrar sus elementos.
    listaRapida.replaceChildren();

    // Mostramos el mensaje de lista vacía solamente cuando no hay tareas.
    vacioRapido.hidden = rapidas.length > 0;

    // Recorremos las tareas rápidas una por una.
    rapidas.forEach((item) => {

      // Creamos un elemento de lista para cada tarea.
      const li = document.createElement("li");

      // Agregamos una clase diferente si la tarea ya está completada.
      li.className = "pendiente-rapido" + (item.hecho ? " hecho" : "");

      // Creamos una casilla para marcar la tarea como completada.
      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = item.hecho;
      check.setAttribute("aria-label", "Marcar " + item.texto + " como completada");

      // Cuando cambiamos la casilla, actualizamos el estado de la tarea.
      check.addEventListener("change", () => {
        item.hecho = check.checked;
        guardar("logra_todo_rapido", rapidas);
        pintarRapidas();
      });

      // Creamos un elemento para mostrar el texto de la tarea.
      const texto = document.createElement("span");
      texto.textContent = item.texto;

      // Creamos el botón que permite eliminar la tarea.
      const borrar = document.createElement("button");
      borrar.type = "button";
      borrar.className = "borrar-mini";
      borrar.textContent = "×";
      borrar.setAttribute("aria-label", "Eliminar pendiente");

      // Al pulsar el botón, eliminamos la tarea seleccionada.
      borrar.addEventListener("click", () => {
        rapidas = rapidas.filter((x) => x.id !== item.id);
        guardar("logra_todo_rapido", rapidas);
        pintarRapidas();
      });

      // Añadimos la casilla, el texto y el botón a la tarea.
      li.append(check, texto, borrar);

      // Añadimos la tarea a la lista del HTML.
      listaRapida.append(li);
    });
  }

  // Detectamos cuando se envía el formulario de la lista rápida.
  document.getElementById("form-rapido").addEventListener("submit", (evento) => {

    // Evitamos que el formulario recargue la página.
    evento.preventDefault();

    // Obtenemos el texto escrito por la persona.
    const campo = document.getElementById("nuevo-rapido");
    const texto = campo.value.trim();

    // Si el campo está vacío, no agregamos ninguna tarea.
    if (!texto) return;

    // Creamos una nueva tarea con un identificador único,
    // su texto y su estado inicial sin completar.
    rapidas.unshift({ id: Date.now(), texto, hecho: false });

    // Guardamos la lista, limpiamos el campo y actualizamos la pantalla.
    guardar("logra_todo_rapido", rapidas);
    campo.value = "";
    pintarRapidas();

    // Dejamos el cursor listo para escribir otra tarea.
    campo.focus();
  });

  // Mostramos las tareas rápidas al cargar la página.
  pintarRapidas();



  // CONTADOR DE AGUA
 

  // Recuperamos el registro de agua guardado.
  // Si no existe, comenzamos con cero vasos.
  let registroAgua = leer("logra_agua", { fecha: claveDia, vasos: 0 });

  // Si el registro pertenece a otro día, reiniciamos los vasos.
  if (registroAgua.fecha !== claveDia) registroAgua = { fecha: claveDia, vasos: 0 };

  // Esta función actualiza el contador y los elementos visuales.
  const actualizarAgua = () => {

    // Limitamos el contador para que esté entre 0 y 8 vasos.
    const vasos = Math.max(0, Math.min(8, Number(registroAgua.vasos) || 0));
    registroAgua.vasos = vasos;

    // Mostramos la cantidad de vasos en el panel.
    document.getElementById("agua-cantidad").textContent = vasos;
    document.getElementById("agua-resumen").textContent = vasos;

    // Actualizamos el nivel visual del agua.
    document.getElementById("agua-relleno").style.height = (vasos / 8 * 100) + "%";
    document.getElementById("agua-barra").style.width = (vasos / 8 * 100) + "%";

    // Mostramos un mensaje dependiendo de la cantidad registrada.
    document.getElementById("agua-mensaje").textContent = vasos >= 8 ? "¡Meta registrada! ♡" : vasos >= 5 ? "¡Vas muy bien! ✨" : "¡Cada vaso cuenta!";

    // Desactivamos los botones cuando se alcanza un límite.
    document.getElementById("agua-sumar").disabled = vasos >= 8;
    document.getElementById("agua-restar").disabled = vasos <= 0;

    // Guardamos el registro actualizado.
    guardar("logra_agua", registroAgua);
  };

  // El botón de sumar agrega un vaso de agua.
  document.getElementById("agua-sumar").addEventListener("click", () => {
    registroAgua.vasos++;
    actualizarAgua();
  });

  // El botón de restar descuenta un vaso de agua.
  document.getElementById("agua-restar").addEventListener("click", () => {
    registroAgua.vasos--;
    actualizarAgua();
  });

  // Actualizamos el contador al entrar en la página.
  actualizarAgua();


 
  // NOTAS
 

  // Recuperamos las notas guardadas o creamos una lista vacía.
  let notas = leer("logra_notas", []);

  // Buscamos los elementos del HTML donde se muestran las notas.
  const listaNotas = document.getElementById("lista-notas");
  const vacioNotas = document.getElementById("vacio-notas");

  // Esta función muestra todas las notas guardadas.
  function pintarNotas() {

    // Limpiamos el contenedor antes de volver a mostrar las notas.
    listaNotas.replaceChildren();

    // Mostramos el mensaje de lista vacía cuando no hay notas.
    vacioNotas.hidden = notas.length > 0;

    // Recorremos las notas para mostrarlas individualmente.
    notas.forEach((nota) => {

      // Creamos el contenedor de una nota.
      const article = document.createElement("article");
      article.className = "nota";

      // Mostramos el texto de la nota.
      const p = document.createElement("p");
      p.textContent = nota.texto;

      // Mostramos la fecha en que se guardó o modificó.
      const small = document.createElement("small");
      small.textContent = "Guardada " + new Date(nota.fecha).toLocaleDateString("es-CO");

      // Creamos el botón para editar la nota.
      const editar = document.createElement("button");
      editar.type = "button";
      editar.className = "borrar-mini";
      editar.textContent = "✎";
      editar.setAttribute("aria-label", "Editar nota");

      // Al pulsar editar, solicitamos el nuevo texto mediante una ventana.
      editar.addEventListener("click", () => {
        const nuevoTexto = window.prompt("Edita tu nota:", nota.texto);

        // Si se cancela la ventana, no hacemos cambios.
        if (nuevoTexto === null) return;

        // Evitamos que la nota quede vacía.
        if (!nuevoTexto.trim()) {
          window.alert("La nota no puede quedar vacía.");
          return;
        }

        // Actualizamos el texto y la fecha de la nota.
        nota.texto = nuevoTexto.trim();
        nota.fecha = new Date().toISOString();

        // Guardamos los cambios y volvemos a mostrar las notas.
        guardar("logra_notas", notas);
        pintarNotas();
      });

      // Creamos el botón para eliminar la nota.
      const borrar = document.createElement("button");
      borrar.type = "button";
      borrar.className = "borrar-mini";
      borrar.textContent = "×";
      borrar.style.right = "31px";
      borrar.setAttribute("aria-label", "Eliminar nota");

      // Pedimos confirmación antes de eliminar la nota.
      borrar.addEventListener("click", () => {
        if (window.confirm("¿Quieres eliminar esta nota?")) {
          notas = notas.filter((x) => x.id !== nota.id);
          guardar("logra_notas", notas);
          pintarNotas();
        }
      });

      // Añadimos el texto, la fecha y los botones al contenedor.
      article.append(p, small, editar, borrar);

      // Añadimos la nota a la página.
      listaNotas.append(article);
    });
  }

  // Detectamos cuando se envía el formulario para crear una nota.
  document.getElementById("form-nota").addEventListener("submit", (evento) => {

    // Evitamos que la página se recargue al enviar el formulario.
    evento.preventDefault();

    // Obtenemos el texto escrito en el campo de la nota.
    const campo = document.getElementById("texto-nota");
    const texto = campo.value.trim();

    // Si no hay texto, no creamos una nota.
    if (!texto) return;

    // Creamos una nueva nota con identificador, texto y fecha.
    notas.unshift({ id: Date.now(), texto, fecha: new Date().toISOString() });

    // Guardamos la nota, limpiamos el campo y actualizamos la pantalla.
    guardar("logra_notas", notas);
    campo.value = "";
    pintarNotas();
  });

  // Mostramos las notas al cargar la página.
  pintarNotas();



  // HÁBITOS
  

  // Recuperamos los hábitos registrados.
  let habitos = leer("logra_habitos", { fecha: claveDia, checks: {} });

  // Si el registro pertenece a otro día, reiniciamos las marcas.
  if (habitos.fecha !== claveDia) habitos = { fecha: claveDia, checks: {} };

  // Buscamos todas las casillas que tienen el atributo data-habito.
  const checksHabitos = Array.from(document.querySelectorAll("[data-habito]"));

  // Esta función actualiza las casillas y el contador de hábitos.
  function pintarHabitos() {
    let total = 0;

    // Revisamos cada hábito para saber si está marcado.
    checksHabitos.forEach((check) => {
      check.checked = Boolean(habitos.checks[check.dataset.habito]);

      // Contamos los hábitos que ya se marcaron.
      if (check.checked) total++;
    });

    // Mostramos cuántos hábitos se han completado.
    document.getElementById("habitos-contador").textContent = total + " de " + checksHabitos.length + " hábitos";

    // Guardamos el registro actualizado.
    guardar("logra_habitos", habitos);
  }

  // Detectamos cuando se marca o desmarca un hábito.
  checksHabitos.forEach((check) => check.addEventListener("change", () => {
    habitos.checks[check.dataset.habito] = check.checked;
    pintarHabitos();
  }));

  // Mostramos el estado de los hábitos al cargar la página.
  pintarHabitos();


  
  // RESUMEN DE TAREAS Y PRÓXIMOS VENCIMIENTOS

  // Recuperamos las tareas guardadas con la clave "tareas".
  const tareas = leer("tareas", []);

  // Mostramos el total de tareas creadas.
  document.getElementById("total-tareas").textContent = tareas.length;

  // Contamos y mostramos las tareas completadas.
  document.getElementById("tareas-completadas").textContent = tareas.filter((t) => t.estado === "completada").length;

  // Seleccionamos las tareas que tienen fecha de entrega
  // y que todavía no están completadas.
  const proximas = tareas.filter((t) => t.fecha && t.estado !== "completada")

    // Ordenamos las tareas desde la fecha más cercana
    // hasta la más lejana.
    .sort((a, b) => a.fecha.localeCompare(b.fecha))

    // Mostramos únicamente las tres primeras.
    .slice(0, 3);

  // Buscamos el contenedor de próximos vencimientos.
  const contenedorProximas = document.getElementById("proximas-tareas");

  // Mostramos el mensaje de lista vacía cuando no hay próximos vencimientos.
  document.getElementById("vacio-proximas").hidden = proximas.length > 0;

  // Recorremos las próximas tareas para mostrarlas en el panel.
  proximas.forEach((tarea) => {

    // Convertimos la fecha de entrega en un objeto de fecha.
    const fecha = new Date(tarea.fecha + "T12:00:00");

    // Creamos el contenedor de cada próxima tarea.
    const fila = document.createElement("div");
    fila.className = "proxima-tarea";

    // Creamos el recuadro donde se muestra el día y el mes.
    const cuadrito = document.createElement("div");
    cuadrito.className = "fecha-cuadro";

    const dia = document.createElement("strong");
    dia.textContent = fecha.getDate();

    const mes = document.createElement("small");
    mes.textContent = fecha.toLocaleDateString("es-CO", { month: "short" }).replace(".", "");

    // Añadimos el día y el mes al recuadro de fecha.
    cuadrito.append(dia, mes);

    // Creamos el contenedor con el nombre y el estado de la tarea.
    const info = document.createElement("div");
    info.className = "proxima-info";

    const nombre = document.createElement("strong");
    nombre.textContent = tarea.nombre;

    // Mostramos el estado de la tarea con un texto fácil de entender.
    const estado = document.createElement("small");
    estado.textContent = tarea.estado === "en-progreso" ? "En progreso" : "Pendiente";

    // Añadimos la información de la tarea a su contenedor.
    info.append(nombre, estado);

    // Añadimos la fecha y la información al elemento de la tarea.
    fila.append(cuadrito, info);

    // Mostramos la tarea en el contenedor de próximos vencimientos.
    contenedorProximas.append(fila);
  });

});
