let table = null;

// Event listener para el clic en cualquier <li> con la clase 'uploadExcel'
document.querySelectorAll('.uploadExcel').forEach(function (element) {
    element.addEventListener('click', function() {
        // Actualiza el valor de 'table' según el 'data-value' del <li> que fue clickeado
        table = this.getAttribute('data-value'); // 'this' hace referencia al <li> que fue clickeado
        codTable  = this.getAttribute('data-cod'); 
        console.log("Tabla seleccionada: " + table);

        // Simula el clic en el input de archivo cuando el usuario hace clic en el <li>
        document.getElementById('excelFileInput').click();
    });
});

// Agregar un evento change al input de archivo
document.getElementById('excelFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    // Si el usuario seleccionó un archivo
    if (file) {
        // Verifica si se ha seleccionado una tabla antes de continuar
        if (!table) {
            alert("Por favor, selecciona una tabla para cargar los datos.");
            return; // Salir si no se ha seleccionado una tabla
        }

        // Pregunta de confirmación
        const isConfirmed = confirm("¿Estás seguro de que deseas cargar este archivo en el RECORD " + table + "?");

        // Si el usuario confirma, proceder con el procesamiento
        if (isConfirmed) {
            // Mostrar el loading container (spinner)
            document.getElementById('loading-container').style.display = 'block';

            const reader = new FileReader();

            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                
                // Verificar si el archivo es DBF
                if (file.name.endsWith('.dbf')) {
                    // Usar la librería dbf para convertir el archivo DBF a XLSX
                    convertDBFToXLSX(data, function(xlsxData) {
                        const workbook = XLSX.read(xlsxData, { type: 'array' });
                        processWorkbook(workbook);
                    });
                } else {
                    // Si no es un archivo DBF, simplemente lo procesamos como un archivo Excel normal
                    const workbook = XLSX.read(data, { type: 'array' });
                    processWorkbook(workbook);
                }
            };

            reader.readAsArrayBuffer(file); // Leer el archivo como ArrayBuffer
        } else {
            // Si el usuario cancela la carga, mostrar un mensaje
            alert("Carga cancelada.");
        }

        // Limpiar el input de archivo para permitir seleccionar el mismo archivo nuevamente
        event.target.value = ''; // Esta línea limpia el valor del input de archivo después de la selección
    }
});

function convertDBFToXLSX(dbfData, callback) {
    // Usar la librería dbf para leer el archivo DBF
    try {
        const dbf = new DBF(dbfData);  // Usamos la librería DBF para procesar el archivo
        const json = dbf.toJSON();  // Convertir DBF a JSON

        // Convertir el JSON a XLSX
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(json);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        
        // Convertir el libro de trabajo a formato array
        const xlsxData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        callback(xlsxData);  // Llamar al callback con los datos convertidos
    } catch (error) {
        alert("Error al convertir el archivo DBF: " + error);
        document.getElementById('loading-container').style.display = 'none';
    }
}

function processWorkbook(workbook) {
    const firstSheetName = workbook.SheetNames[0]; // Obtener el nombre de la primera hoja
    const worksheet = workbook.Sheets[firstSheetName]; // Obtener la primera hoja
    const jsonData = XLSX.utils.sheet_to_json(worksheet); // Convertir la hoja a JSON

   // alert(JSON.stringify(jsonData)); // Mostrar los datos en JSON (opcional, para depuración)
    const typeUser = document.getElementById('TypeUser').textContent;
    //alert(typeUser);

    // Enviar los datos a PHP para ser procesados
    fetch('upload.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            table: table, // Enviar el nombre de la tabla
            data: jsonData, // Enviar los datos del archivo Excel
            NameUser: typeUser,
            CodigoEscuela: codTable
        }) // Enviar los datos como JSON
    })
    .then(response => response.json()) // Esperar la respuesta en JSON
    .then(data => {
        console.log(data); // Mostrar la respuesta en la consola para depuración
        alert("Datos cargados exitosamente en la tabla " + table); // Mensaje de éxito
    })
    .catch(error => {
        console.error('Error:', error); // Mostrar cualquier error
        alert("Error al cargar los datos"); // Mensaje de error
    })
    .finally(() => {
        // Ocultar el loading container (spinner) al finalizar la carga
        document.getElementById('loading-container').style.display = 'none';
    });
}
