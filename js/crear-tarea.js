
/* Busco el formulario de creación de tareas
   mediante su identificador en el HTML.
*/

const formulario = document.getElementById("formulario-tarea");


/* El evento submit se ejecuta cuando envío
   el formulario.
*/

formulario.addEventListener("submit", function (evento) {

    // Evita que la página se recargue automáticamente.
    evento.preventDefault();


    /* Recupero los valores que escribió
       o seleccionó el usuario.
    */

    // Nombre de la tarea, eliminando espacios al inicio y al final.
    const nombre = document.getElementById("nombre").value.trim();

    // Descripción de la tarea.
    const descripcion = document.getElementById("descripcion").value.trim();

    // Persona asignada a la tarea.
    const asignado = document.getElementById("asignado").value.trim();

    // Fecha de entrega seleccionada.
    const fecha = document.getElementById("fecha").value;

    // Estado seleccionado para la tarea.
    const estado = document.getElementById("estado").value;


    /* VALIDAR LOS CAMPOS DEL FORMULARIO
       Verificamos que los campos obligatorios
       tengan información y cumplan la longitud mínima.
    */

    if (nombre.length < 8 || nombre.length > 100) {
        alert("El nombre de la tarea debe tener entre 8 y 100 caracteres.");
        return;
    }

    if (descripcion.length < 15 || descripcion.length > 500) {
        alert("La descripción debe tener entre 15 y 500 caracteres.");
        return;
    }

    if (asignado.length < 8 || asignado.length > 100) {
        alert("El nombre de la persona asignada debe tener entre 8 y 100 caracteres.");
        return;
    }

    if (fecha === "") {
        alert("Por favor, selecciona una fecha de entrega.");
        return;
    }

    if (estado === "") {
        alert("Por favor, selecciona el estado de la tarea.");
        return;
    }


    /* CREAR EL OBJETO DE LA NUEVA TAREA
       Agrupo todos los datos en un objeto.
       Date.now() genera un identificador numérico
       basado en la fecha y hora actuales.
    */

    const nuevaTarea = {
        id: Date.now(),
        nombre: nombre,
        descripcion: descripcion,
        asignado: asignado,
        fecha: fecha,
        estado: estado
    };


    /* RECUPERAR LAS TAREAS GUARDADAS
       Obtenemos las tareas de localStorage.
       Si todavía no existe una lista guardada,
       utilizamos un arreglo vacío: [].
    */

    const tareasGuardadas = JSON.parse(
        localStorage.getItem("tareas") || "[]"
    );


    /* AGREGAR LA NUEVA TAREA
       push() añade el objeto al final del arreglo.
    */

    tareasGuardadas.push(nuevaTarea);


    /* GUARDAR LAS TAREAS ACTUALIZADAS
       JSON.stringify() convierte el arreglo
       en texto para poder guardarlo en localStorage.
    */

    localStorage.setItem("tareas", JSON.stringify(tareasGuardadas));


    /* MOSTRAR UN MENSAJE DE CONFIRMACIÓN
       Informamos al usuario que la tarea se guardó.
    */

    alert("¡Tu tarea se guardó correctamente! ♡");


    /* LIMPIAR Y REDIRIGIR
       reset() limpia los campos del formulario.
       Después, abrimos el tablero de tareas.
    */

    formulario.reset();

    window.location.href = "tareas.html";

});