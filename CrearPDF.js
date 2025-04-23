function generarPDF() {
    const DateLastLog = document.getElementById('fechaFormList').value;
    const DateLastLogText = document.getElementById('fechaFormList').options[document.getElementById('fechaFormList').selectedIndex].text;

    // Validar si la fecha seleccionada es "--Seleccione Fecha--"
    if (DateLastLogText === "--Seleccione Fecha--") {
        alert("Por favor, seleccione una fecha antes de continuar.");
        return;  // Detener la ejecución de la función si la fecha no es válida
    }

    const CodMateria = document.getElementById('opcionesMateriaFormList');
    const NameMateria = CodMateria.options[CodMateria.selectedIndex].text;

    const PeriodoAcademico = document.getElementById('periodoFormList');
    const Periodo = PeriodoAcademico.options[PeriodoAcademico.selectedIndex].text;

    const NroSeccion = document.getElementById('opcionesSeccionFormList').value;
    const NameCarrera = document.getElementById('EscuelaName').placeholder;

    const CodCarrera = document.getElementById('EscuelaName');
    const infoCod = CodCarrera.dataset.info; // 

    const InfoEscuela = CodCarrera.dataset.escuela; // 

    // Obtener el valor de la columna "Analista Encargado" (asumiendo que está en la última columna de la tabla)
    const originalTable = document.getElementById('table');
    const rows = originalTable.querySelectorAll('tr'); // Obtener todas las filas de la tabla

    // Suponiendo que la columna "Analista Encargado" es la última de cada fila (ajusta según corresponda)
    let analistaEncargado = '';
    if (rows.length > 1) {  // Asegurarse de que haya filas en la tabla
        const lastRow = rows[1]; // Tomamos la segunda fila (la primera es el encabezado)
        const analistaCell = lastRow.cells[lastRow.cells.length - 1]; // Última celda de la fila
        analistaEncargado = analistaCell.textContent || analistaCell.innerText; // Obtenemos el valor de la celda
    }

    // Clonamos la tabla
    const copyTable = originalTable.cloneNode(true); // Clona la tabla
    copyTable.classList.add('table'); // Aseguramos que la tabla clonada tenga la clase "table"
    copyTable.style.display = 'table'; // Cambia a display: table

    // Ocultamos la columna "Analista Encargado" en la copia para el PDF
    const tableColumns = copyTable.querySelectorAll('tr');
    tableColumns.forEach(function(row) {
        const cells = row.querySelectorAll('td, th');  // Obtener todas las celdas de la fila
        if (cells.length > 0) {
            cells[cells.length - 1].style.display = 'none';  // Ocultamos la última celda (columna Analista Encargado)
        }
    });

    const nuevoHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Documento PDF</title>
         <style>
                body {
                    font-family: Arial, sans-serif; /* Estilo de fuente */
                    margin: 0; /* Sin márgenes en el body */
                    padding: 0; /* Sin relleno en el body */
                }
                h2 {
                    margin: 0; /* Sin margen en el h1 */
                    padding-bottom: 20px; /* Espacio debajo del membrete */
                    display:block;
                    width:80%;
                }
                .table {
                    margin-top: 50px; /* Espacio fijo entre el borde superior y la tabla */
                    width: 100%; /* Ancho completo */
                    border-collapse: collapse; /* Para que las celdas no tengan espacios entre ellas */
                }
                table {
                    height: auto !important;
                    overflow: visible !important;
                    display: table;
                }
        </style>
    </head>
    <body>

        <h2>LISTADO DE ESTUDIANTES </h2> <!-- Membrete -->
        <P>
           Universidad de Carabobo <br>
           Facultad de Ciencias de la Salud  <br>
           Materia: ${NameMateria} <br>
           Periodo Académico: ${Periodo} <br>
           Sección: ${NroSeccion}  <br>
           Carrera: ${NameCarrera} <br>
           Cod.Carrera:   ${infoCod} <br>
           Escuela: ${InfoEscuela} <br>    
           Fecha: ${DateLastLog} <br>  
           Analista Encargado: ${analistaEncargado} <br>  <!-- Aquí agregamos el valor del Analista -->
        </P>
        
        <br>
        ${copyTable.outerHTML} <!-- Copia la tabla -->
    </body>
    </html>`;

    const blob = new Blob([nuevoHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;

    document.body.appendChild(iframe);

    iframe.onload = function() {
        const pdfElement = iframe.contentWindow.document.body;

        const opt = {
            margin:       [0.5, 0.5, 0.4, 0.5], // [top, right, bottom, left]
            filename:     'Listado de Estudiantes .pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 4 },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // Usar html2pdf para generar el PDF
        html2pdf()
            .from(pdfElement)
            .set(opt)
            .save()
            .then(() => {
                document.body.removeChild(iframe); // Limpiar el iframe después de generar el PDF
                URL.revokeObjectURL(url); // Revocar la URL del Blob
            });
    };
};
