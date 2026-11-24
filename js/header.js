// Cargar el header compartido en todas las páginas de LOGRA
document.addEventListener("DOMContentLoaded", () => {

    const contenedorHeader = document.getElementById("header-container");

    if (contenedorHeader) {
        fetch("header.html")
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se pudo cargar el header");
                }

                return response.text();
            })
            .then(html => {
                contenedorHeader.innerHTML = html;
            })
            .catch(error => {
                console.error("Error al cargar el header:", error);
            });
    }

});