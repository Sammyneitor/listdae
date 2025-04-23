document.addEventListener("DOMContentLoaded", function() {
    const dropArea = document.getElementById('drop-area_Drop');
    const fileInput = document.getElementById('file-input_Drop');
    const fileNameDisplay = document.getElementById('file-name_Drop');
    const uploadButton = document.getElementById('upload-btn_Drop');
    const deleteButton = document.getElementById('delete-btn_Drop');
    const messageDiv = document.getElementById('message_Drop');
    const tableSelect = document.getElementById('table-name_Drop');
    const typeUser = document.getElementById('TypeUser').textContent;
    const loadingContainer = document.getElementById('loading-container'); // Contenedor de carga
    let dataCod;  // Declarada fuera para que sea accesible globalmente
    
    tableSelect.addEventListener('change', () => {
        // Obtener la opción seleccionada
        const opcionSeleccionada = tableSelect.selectedOptions[0];
        dataCod = opcionSeleccionada.dataset.cod;
       // alert('Codigo de la carrera: ' + opcionSeleccionada.dataset.cod);
        // Acceder al atributo data-cod de la opción seleccionada
      });

    let selectedFile = null;
    let excelData = [];

    // Prevenir la acción predeterminada de arrastrar y soltar
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.style.backgroundColor = '#e0e0e0';
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.style.backgroundColor = '';
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.style.backgroundColor = '';
        selectedFile = e.dataTransfer.files[0];

        if (selectedFile && (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || selectedFile.type === "application/vnd.ms-excel")) {
            fileNameDisplay.textContent = `Archivo seleccionado: ${selectedFile.name}`;
            readExcelFile(selectedFile);
        } else {
            fileNameDisplay.textContent = 'Por favor, selecciona un archivo Excel.';
            selectedFile = null;
        }
    });

    // Opción alternativa para seleccionar el archivo
    fileInput.addEventListener('change', (e) => {
        selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || selectedFile.type === "application/vnd.ms-excel")) {
            fileNameDisplay.textContent = `Archivo seleccionado: ${selectedFile.name}`;
            readExcelFile(selectedFile);
        } else {
            fileNameDisplay.textContent = 'Por favor, selecciona un archivo Excel.';
            selectedFile = null;
        }
    });

    // Función para leer el archivo Excel
    function readExcelFile(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            excelData = XLSX.utils.sheet_to_json(firstSheet);

            //alert("Datos leídos del Excel:\n" + excelData.map(row => JSON.stringify(row)).join(", "));
        };
        reader.readAsArrayBuffer(file);
    }

    // Evento del botón de carga
    uploadButton.addEventListener('click', () => {
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');

        // Verificar si los valores están vacíos o no existen
        if (!username || !password || username.trim() === '' || password.trim() === '') {
            window.location.replace('sgu_inicio_sesion.html');
            return;
        }

        // Validar si se ha seleccionado una tabla y un archivo
        const selectedTable = tableSelect.value;
        if (!selectedTable) {
            alert("Por favor, selecciona una tabla de la lista.");
            return;
        }

        if (!selectedFile) {
            alert("Por favor, selecciona o arrastra un archivo Excel.");
            //alert(codtabla);

            return;
        }

        if (excelData.length === 0) {
            alert("No se han leído datos del archivo Excel.");
            return;
        }

        // Confirmar antes de proceder con la carga
        const confirmation = confirm("¿Estás seguro de que deseas cargar los datos en la tabla seleccionada?");
        if (!confirmation) {
            return;
        }

        // Mostrar el loading container
        loadingContainer.style.display = 'flex'; // Muestra el contenedor de carga

        // Crear FormData y agregar el archivo, tabla seleccionada y datos del Excel
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('table', selectedTable);
        formData.append('data', JSON.stringify(excelData)); // Enviar los datos del Excel
        formData.append('typeUser', typeUser);
        formData.append('codCarrera', dataCod);
        //alert(dataCod);


        // Enviar los datos al servidor
        fetch('uploadDrop.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            // Ocultar el loading container
            loadingContainer.style.display = 'none'; // Ocultar el contenedor de carga

            if (data && data.status === 'success') {
                alert('Carga exitosa: ' + data.message);
                deleteFile(); // Llamar a la función de eliminación después de una carga exitosa
                resetTableSelect();
            } else {
                alert('Error: ' + (data.message || 'Error desconocido.'));
            }
        })
        .catch(error => {
            // Ocultar el loading container
            loadingContainer.style.display = 'none'; // Ocultar el contenedor de carga

            console.error('Error en la carga:', error);
            alert('Hubo un error en la carga.');
        });
    });

    // Lógica para el botón de eliminación
    deleteButton.addEventListener('click', () => {
        if (selectedFile) {
            selectedFile = null;
            excelData = [];
            fileNameDisplay.textContent = 'No se ha seleccionado ningún archivo.';
            dropArea.style.backgroundColor = '';
           // alert('El archivo ha sido eliminado.');
            resetTableSelect();
        } else {
          //  alert('No hay ningún archivo para eliminar.');
        }
    });

    // Función para eliminar el archivo
    function deleteFile() {
        if (selectedFile) {
            selectedFile = null;
            excelData = [];
            fileNameDisplay.textContent = 'No se ha seleccionado ningún archivo.';
            dropArea.style.backgroundColor = '';
           // alert('El archivo ha sido eliminado automáticamente después de la carga.');
        } else {
          //  alert('No hay ningún archivo para eliminar.');
        }
    }

    // Función para restablecer el SELECT a la primera opción
    function resetTableSelect() {
        tableSelect.selectedIndex = 0; // Establecer la opción seleccionada al primer elemento
    }
});
