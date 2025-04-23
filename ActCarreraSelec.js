function actualizarPlaceholder(enlace) {
    // Obtener el texto del enlace que fue clicado
    var texto = enlace.innerText;
    var infoCod = enlace.dataset.cod;
    var InfoEscuela = enlace.dataset.escuela
    var InfoEscuelaTabla = enlace.dataset.value
    document.getElementById("EscuelaName").placeholder = texto;
    document.getElementById("EscuelaNameForDate").value = InfoEscuelaTabla;

    // Actualizar el placeholder del input    

    const input = document.getElementById('EscuelaName');
    input.dataset.info = infoCod; // Cambia el valor de data-info
    input.dataset.escuela = InfoEscuela;

    // Limpiar el select de secciones
    var select = document.getElementById("opcionesSeccionFormList");
    select.selectedIndex = 0; // Selecciona la primera opción

    var primerElemento = select.options[0]; // Guardar la primera opción

    // Eliminar todas las opciones del select
    while (select.options.length > 0) {
        select.remove(0);
    }

    // Agregar de nuevo la primera opción
    select.add(primerElemento);

    // Obtener el valor de data-value del enlace clickeado.
    var escuelaDataValue = enlace.getAttribute('data-value');

    // Verificar que se haya seleccionado una escuela
    if (escuelaDataValue !== "") {
        // Crear una solicitud HTTP (AJAX) para obtener los periodos
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "getPeriodos.php?escuela=" + escuelaDataValue, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var periodos = JSON.parse(xhr.responseText);

                // Limpiar el select de periodos
                var periodoSelect = document.getElementById("periodoFormList");
                periodoSelect.innerHTML = "<option value=''>--Seleccione Periodo--</option>";

                // Llenar el select de periodos con los nuevos valores
                if (periodos.length > 0) {
                    periodos.forEach(function(periodo) {
                        var option = document.createElement("option");
                        option.value = periodo.AñoPeriodo_Escuela + ',' + periodo.NroPeriodo_Escuela;
                        option.text = periodo.AñoPeriodo_Escuela + "-" + periodo.NroPeriodo_Escuela;
                        periodoSelect.appendChild(option);
                    });
                } else {
                    // Si no hay resultados, agregar una opción indicando que no hay periodos
                    var option = document.createElement("option");
                    option.value = "";
                    option.text = "No hay periodos disponibles";
                    //periodoSelect.appendChild(option);
                }
            }
        };
        xhr.send();
    } else {
        // Si no se ha seleccionado una escuela, limpiar el select de periodos
        document.getElementById("periodoFormList").innerHTML = "<option value=''>--Seleccione Periodo--</option>";
    }

    
}