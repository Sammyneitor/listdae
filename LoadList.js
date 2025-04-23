function cargarDatosSeccion() {
    var select = document.getElementById("opcionesMateriaFormList");
    var valorSeleccionado = select.value;
    var set = document.getElementById("CodAsigSrc")
    set.setAttribute('placeholder',valorSeleccionado)
    var escuelaFCS = document.getElementById("EscuelaID").value;
    //document.getElementById("EscuelaName").placeholder = escuelaFCS;
    //var set = document.getElementById("CodAsigSrc")
    // Crear una solicitud AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "cargar_Secciones.php?opcion=" + valorSeleccionado + "&escuelaFCS=" + escuelaFCS, true);
        xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Actualizar el segundo select con los nuevos datos
            document.getElementById("opcionesSeccionFormList").innerHTML = xhr.responseText;
            /*alert(xhr.responseText)*/
        }
    };
    xhr.send();
}

