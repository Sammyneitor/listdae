// Variables para el manejo de la carga del archivo
const btnCargar = document.getElementById("btnCargar");
const fileInput = document.getElementById("fileInput");
const confirmMessage = document.getElementById("confirmMessage");
const confirmUpload = document.getElementById("confirmUpload");
const cancelUpload = document.getElementById("cancelUpload");
const validExtensions = ['xlsx', 'xls'];
const modalERROR = document.getElementById("errorModalERROR");
const errorMessagesContainerERROR = document.getElementById("errorMessagesERROR");
const closeBtnERROR = document.getElementsByClassName("close-btnERROR")[0];  // El botón de cerrar
const progressBar = document.getElementById("progressBar");
const loadingContainer = document.getElementById("loading-container");  // Contenedor del spinner

// Función para mostrar el modal con los errores
function showErrorModalERROR(message) {
    errorMessagesContainerERROR.innerHTML = message;  // Agregar los mensajes al contenedor del modal
    modalERROR.style.display = "block";  // Mostrar el modal
}

// Función para cerrar el modal
closeBtnERROR.addEventListener("click", function() {
    modalERROR.style.display = "none";  // Ocultar el modal cuando se haga clic en el botón de cerrar
});

// Cerrar el modal si se hace clic fuera del contenido del modal
window.addEventListener("click", function(event) {
    if (event.target === modalERROR) {
        modalERROR.style.display = "none";  // Ocultar el modal si se hace clic fuera de él
    }
});

// Estado de carga (evitar múltiples cargas al mismo tiempo)
let isUploading = false;

// Evento que abre el selector de archivos
btnCargar.addEventListener("click", function() {
    if (isUploading) return;  // No permitir cargar otro archivo mientras se está procesando uno
    console.log("Botón Cargar presionado");

    // Limpiar el valor del input antes de abrir el selector
    fileInput.value = '';  

    // Abrir el selector de archivos
    fileInput.click();
});

// Evento cuando se selecciona un archivo
fileInput.addEventListener("change", function() {
    const file = fileInput.files[0];
    if (file) {
        const extension = file.name.split('.').pop().toLowerCase();

        // Verificar si la extensión es válida
        if (!validExtensions.includes(extension)) {
            alert("Por favor, seleccione un archivo Excel (.xlsx, .xls).");
            fileInput.value = '';  // Limpiar la selección de archivo
            return;  // Salir sin mostrar el mensaje de confirmación
        }

        console.log("Archivo seleccionado:", file.name);
        confirmMessage.style.display = "block";  // Mostrar el mensaje de confirmación
    }
});

// Evento para cancelar la carga
cancelUpload.addEventListener("click", function() {
    console.log("Cancelando carga");
    confirmMessage.style.display = "none";  // Ocultar el mensaje de confirmación
    fileInput.value = '';  // Limpiar la selección del archivo
});

// Evento para confirmar la carga
confirmUpload.addEventListener("click", function() {
    if (isUploading) return;  // No permitir cargar mientras otro archivo está en proceso
    console.log("Confirmando carga");

    const file = fileInput.files[0];

    if (file) {
        confirmMessage.style.display = "none";  // Ocultar el mensaje de confirmación
        console.log("Archivo seleccionado:", file.name);
        
        // Usar la librería xlsx para leer el archivo Excel
        const reader = new FileReader();

        // Indicamos que la carga ha comenzado
        isUploading = true;
        loadingContainer.style.display = "block";
        
        reader.onload = function(e) {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "array" });

            // Supongamos que estamos leyendo la primera hoja del archivo
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            console.log("Datos leídos del archivo:", jsonData);

            jsonData.shift();  // Eliminar la primera fila, que es la cabecera

            // Filtrar las filas no vacías
            const nonEmptyRows = jsonData.filter(row => row.some(cell => cell !== null && cell !== ''));

            // Verificar si no hay registros válidos (excepto la cabecera)
            if (nonEmptyRows.length === 0) {
                alert("El archivo está vacío o solo contiene la cabecera.");
                isUploading = false;
                loadingContainer.style.display = "none";
                return;  // No continuar con la carga
            }

            let alertMessage = "Registros leídos del archivo:\n";
            nonEmptyRows.forEach((row, index) => {
                row.forEach((value, i) => {
                    alertMessage += `${jsonData[0][i]}: ${value}\n`;
                });
                alertMessage += "\n"; // Añadir salto de línea entre registros
            });

            // Enviar los datos al servidor
            fetch('UpLoad_AlumnosCRUD.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: nonEmptyRows })
            })
            .then(response => response.text()) 
            .then(data => {
                console.log("Respuesta del servidor:", data);
                try {
                    const jsonData = JSON.parse(data);

                    if (jsonData.success === false) {
                        let errorMessage = "<ul>";  // Usar una lista HTML para mostrar los errores
                        let registrosCargados = jsonData.registrosCargados || 0;  // Obtener el número de registros cargados

                        if (registrosCargados === 0) {
                            // Si no se han cargado registros, mostramos este mensaje
                            alert("Alumnos ya registrados");
                        } else {
                            // Si hay registros cargados, mostramos el mensaje original
                            alert(`Carga completada. ${registrosCargados} registros cargados exitosamente.`);
                        }

                        // Usar un objeto para almacenar errores únicos, identificados por el tipo de error y la cédula del alumno
                        let uniqueErrors = {};

                        // Verificar si hay errores
                        jsonData.errors.forEach((error) => {
                            let errorKey = `${error.type}-${error.registro[1]}`;  // Crear una clave única para el tipo de error y la cédula

                            // Solo agregar el error si no ha sido agregado antes
                            if (!uniqueErrors[errorKey]) {
                                uniqueErrors[errorKey] = true;  // Marcar el error como único
                                switch (error.type) {
                                    case 'Duplicate entry':
                                        errorMessage += `<li>Alumno YA REGISTRADO (ID_Alumno: ${error.registro[1]})</li>`;
                                        break;
                                    case 'Foreign Key Constraint':
                                        errorMessage += `<li> Violación de clave foránea (ID_Alumno: ${error.registro[1]})</li>`;
                                        break;
                                    case 'Null value violation':
                                        errorMessage += `<li> Falta un valor obligatorio (NULL) | (ID_Alumno: ${error.registro[1]})</li>`;
                                        break;
                                    case 'SQL Error':
                                        errorMessage += `<li> Error en la consulta SQL: ${error.message} | (ID_Alumno: ${error.registro[1]})</li>`;
                                        break;
                                    default:
                                        // Si el error no es conocido, se puede manejar de alguna manera
                                        break;
                                }
                            }
                        });

                        errorMessage += "</ul>";
                        showErrorModalERROR(errorMessage);  // Mostrar los errores en el modal

                        // **Aquí agregamos el contador de filas mostradas en el modal**
                        let filasMostradas = errorMessagesContainerERROR.getElementsByTagName("li").length;  // Contar las filas (<li>) en el modal
                        alert(`${filasMostradas} registros duplicados NO AÑADIDOS.`);
                    } else {
                        // Si la carga es exitosa, mostrar la cantidad de registros cargados
                        alert(`Carga exitosa. ${jsonData.registrosCargados} registros cargados exitosamente.`);
                    }
                } catch (e) {
                    console.error("Error al procesar la respuesta:", e);
                }
            })
            .catch(error => {
                console.error("Error al enviar datos al servidor:", error);
            })
            .finally(() => {
                // Reestablecer el estado de carga después de la operación
                isUploading = false;
                loadingContainer.style.display = "none";
            });
        };

        reader.readAsArrayBuffer(file);
    } else {
        alert("No se ha seleccionado ningún archivo.");
    }
});

// Barra de carga (para cuando se esté leyendo el archivo)
reader.onprogress = function(e) {
    if (e.lengthComputable) {
        const percentLoaded = (e.loaded / e.total) * 100;
        progressBar.value = percentLoaded;
    }
};

reader.onloadstart = function() {
    progressBar.style.display = "block";  // Mostrar la barra de carga
};

reader.onloadend = function() {
    progressBar.style.display = "none";  // Ocultar la barra de carga
};
