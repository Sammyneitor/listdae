$(document).ready(function() {
    $('#BuscarListSrc').click(function() {
        var formData = new FormData();

       
         codMat=document.getElementById("CodAsigSrc").placeholder;
         document.getElementById("CodAsigSrcForDate").value = codMat;


        // Agregar los valores de los elementos al objeto FormData
        formData.append('Nom_Escuela', $('#EscuelaNameForDate').val());
        formData.append('Cod_Asignatura', $('#CodAsigSrcForDate').val());
        formData.append('Nro_Seccion', $('#opcionesSeccionFormList').val());
        formData.append('Nro_Periodo', $('#periodoFormList').val());
        //alert("Nom_Escuela: " + formData.get('Nom_Escuela') + 
        //"\nCod_Asignatura: " + formData.get('Cod_Asignatura') + 
        //"\nNro_Periodo " + formData.get('Nro_Periodo') + 
        //"\nNro_Seccion: " + formData.get('Nro_Seccion'));

        $.ajax({
            url: 'CosultarDateActSeccion.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                $('#fechaFormList').html(response);
            }
        });
    });
});