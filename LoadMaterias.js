document.addEventListener('DOMContentLoaded', function() {
    function cargarDatosMateria() {
        var select = document.getElementById("EscuelaID");
        var valorSeleccionado = select.value;
        // Obtener el valor de 'data-info' de EscuelaID
        var escuelaIdInfo = select.getAttribute("data-info"); 
        
        // Crear una solicitud AJAX
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "cargar_Materias.php?Escuela=" + valorSeleccionado + "&EscuelaInfo=" + escuelaIdInfo, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // Actualizar el segundo select con los nuevos datos
                document.getElementById("opcionesMateriaFormList").innerHTML = xhr.responseText;
            }
        };
        xhr.send();
    }

    // Capturar clics en los enlaces de la lista
    var links = document.querySelectorAll('#escuelasList a');
    links.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Evitar que el enlace navegue

            // Cambiar el valor del input oculto
            var valorSeleccionado = this.getAttribute('data-value');
            document.getElementById("EscuelaID").value = valorSeleccionado;

            // Actualizar el data-info con el valor de data-cod del enlace
            var dataCod = this.getAttribute('data-cod');
            document.getElementById("EscuelaID").setAttribute('data-info', dataCod);

            // Llamar a la función para cargar las materias
            cargarDatosMateria();
        });
    });

    cargarDatosMateria();
    // Llamar a la función al hacer clic en el botón (si es necesario)
    document.getElementById('escuelasList').addEventListener('click', function() {
        // Seleccionar el elemento <select>
        var selectElement = document.getElementById('opcionesMateriaFormList');            
        // Establecer el índice del primer elemento (0)
        selectElement.selectedIndex = 0;

        var selectElement = document.getElementById('opcionesSeccionFormList');            
        selectElement.selectedIndex = 0;

        var set = document.getElementById("CodAsigSrc")
        set.setAttribute('placeholder','')
    });

    document.getElementById("escuelasList").addEventListener("click", cargarDatosMateria());
});
