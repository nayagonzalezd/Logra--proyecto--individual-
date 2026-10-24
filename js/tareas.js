document.addEventListener("DOMContentLoaded", function () {

    // Recuperamos las tareas guardadas en el navegador.
    let tareas = JSON.parse(localStorage.getItem("tareas") || "[]");

    // Obtenemos las columnas del tablero.
    const columnas = [
        {
            elemento: document.querySelector(".columna.pendiente"),
            estado: "por-hacer"
        },
        {
            elemento: document.querySelector(".columna.progreso"),
            estado: "en-progreso"
        },
        {
            elemento: document.querySelector(".columna.completada"),
            estado: "completada"
        }
    ];

    // Guardamos las tareas en el almacenamiento local.
    function guardarTareas() {
        localStorage.setItem("tareas", JSON.stringify(tareas));
    }

    // Mostramos las tareas en sus respectivas columnas.
    function mostrarTareas() {

        columnas.forEach(function (columna) {
            columna.elemento
                .querySelector(".lista-tareas")
                .replaceChildren();
        });

        tareas.forEach(function (tarea) {

            // Creamos la tarjeta de la tarea.
            const tarjeta = document.createElement("article");
            tarjeta.classList.add("tarjeta-tarea");
            tarjeta.draggable = true;
            tarjeta.dataset.tareaId = String(tarea.id);

            // Permitimos arrastrar la tarjeta completa.
            tarjeta.addEventListener("dragstart", function (evento) {
                evento.dataTransfer.setData(
                    "text/plain",
                    String(tarea.id)
                );

                evento.dataTransfer.effectAllowed = "move";
                tarjeta.classList.add("arrastrando");
            });

            // Quitamos el estilo temporal al terminar el arrastre.
            tarjeta.addEventListener("dragend", function () {
                tarjeta.classList.remove("arrastrando");

                document.querySelectorAll(".zona-soltar").forEach(
                    function (elemento) {
                        elemento.classList.remove("zona-soltar");
                    }
                );
            });

            // Nombre de la tarea.
            const titulo = document.createElement("h4");
            titulo.textContent = tarea.nombre;

            // Descripción de la tarea.
            const descripcion = document.createElement("p");
            descripcion.textContent = tarea.descripcion || "";

            // Persona asignada.
            const asignado = document.createElement("p");
            asignado.textContent =
                "Asignado a: " + (tarea.asignado || "Sin asignar");

            // Fecha de entrega.
            const fecha = document.createElement("p");
            fecha.classList.add("fecha-tarea");
            fecha.textContent =
                "Fecha de entrega: " + (tarea.fecha || "Sin fecha");

            // Contenedor de las acciones de la tarjeta.
            const acciones = document.createElement("div");
            acciones.classList.add("acciones-tarea");

            // Botón para editar la tarea.
            const botonEditar = document.createElement("button");
            botonEditar.type = "button";
            botonEditar.classList.add("accion-secundaria");
            botonEditar.textContent = "Editar";

            botonEditar.addEventListener("click", function () {

                const nuevoNombre = prompt(
                    "Nombre de la tarea:",
                    tarea.nombre
                );

                if (nuevoNombre === null || nuevoNombre.trim() === "") {
                    return;
                }

                const nuevaDescripcion = prompt(
                    "Descripción de la tarea:",
                    tarea.descripcion || ""
                );

                if (nuevaDescripcion === null) {
                    return;
                }

                const nuevoAsignado = prompt(
                    "Persona asignada:",
                    tarea.asignado || ""
                );

                if (nuevoAsignado === null) {
                    return;
                }

                const nuevaFecha = prompt(
                    "Fecha de entrega:",
                    tarea.fecha || ""
                );

                if (nuevaFecha === null) {
                    return;
                }

                tarea.nombre = nuevoNombre.trim();
                tarea.descripcion = nuevaDescripcion.trim();
                tarea.asignado = nuevoAsignado.trim();
                tarea.fecha = nuevaFecha.trim();

                guardarTareas();
                mostrarTareas();
            });

            // Botón para eliminar la tarea.
            const botonEliminar = document.createElement("button");
            botonEliminar.type = "button";
            botonEliminar.classList.add("accion-eliminar");
            botonEliminar.textContent = "Eliminar";

            botonEliminar.addEventListener("click", function () {

                const confirmar = confirm(
                    "¿Seguro que quieres eliminar esta tarea?"
                );

                if (!confirmar) {
                    return;
                }

                tareas = tareas.filter(function (item) {
                    return String(item.id) !== String(tarea.id);
                });

                guardarTareas();
                mostrarTareas();
            });

            // Añadimos los botones al contenedor de acciones.
            acciones.append(botonEditar, botonEliminar);

            // Añadimos todo el contenido a la tarjeta.
            tarjeta.append(
                titulo,
                descripcion,
                asignado,
                fecha,
                acciones
            );

            // Ubicamos la tarjeta según su estado.
            const columnaDestino = columnas.find(function (columna) {
                return columna.estado === tarea.estado;
            });

            const destino = columnaDestino || columnas[0];

            destino.elemento
                .querySelector(".lista-tareas")
                .appendChild(tarjeta);
        });
    }

    // Activamos el arrastre en cada columna completa.
    columnas.forEach(function (columna) {

        const elementoColumna = columna.elemento;
        const lista = elementoColumna.querySelector(".lista-tareas");

        // Permitimos soltar sobre cualquier parte de la columna.
        elementoColumna.addEventListener("dragover", function (evento) {
            evento.preventDefault();
            evento.dataTransfer.dropEffect = "move";
            lista.classList.add("zona-soltar");
        });

        // Resaltamos la columna al entrar con una tarjeta.
        elementoColumna.addEventListener("dragenter", function (evento) {
            evento.preventDefault();
            lista.classList.add("zona-soltar");
        });

        // Quitamos el resaltado al salir de la columna.
        elementoColumna.addEventListener("dragleave", function (evento) {
            if (!elementoColumna.contains(evento.relatedTarget)) {
                lista.classList.remove("zona-soltar");
            }
        });

        // Movemos la tarjeta a la columna donde se suelta.
        elementoColumna.addEventListener("drop", function (evento) {
            evento.preventDefault();

            const idTarea = evento.dataTransfer.getData("text/plain");

            // Buscamos la tarea que se está arrastrando.
            const tareaMovida = tareas.find(function (item) {
                return String(item.id) === idTarea;
            });

            if (!tareaMovida) {
                return;
            }

            // Buscamos la tarjeta existente sin reconstruirla.
            const tarjeta = Array.from(
                document.querySelectorAll(".tarjeta-tarea")
            ).find(function (elemento) {
                return elemento.dataset.tareaId === idTarea;
            });

            if (!tarjeta) {
                return;
            }

            // Actualizamos el estado de la tarea.
            tareaMovida.estado = columna.estado;

            // Movemos la misma tarjeta al destino.
            // Así no se reemplazan sus botones ni su contenido.
            lista.appendChild(tarjeta);

            // Guardamos el nuevo estado.
            guardarTareas();

            // Quitamos el resaltado de todas las columnas.
            document.querySelectorAll(".lista-tareas").forEach(
                function (elemento) {
                    elemento.classList.remove("zona-soltar");
                }
            );
        });
    });

    // Guardamos y mostramos las tareas al abrir el tablero.
    guardarTareas();
    mostrarTareas();

});
