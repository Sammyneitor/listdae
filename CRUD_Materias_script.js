// Función para cargar los ID de las escuelas
function loadEscuelas() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'cargarEscuelas.php', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
           // document.getElementById('idEscuelaMateria-pensum').disabled = false;

            const escuelas = JSON.parse(xhr.responseText);
            const escuelaSelect = document.getElementById('idEscuela-pensum');
            escuelas.forEach(escuela => {
                const option = document.createElement('option');
                option.value = escuela.ID_CodEscuela_Materia;
                option.textContent = escuela.ID_CodEscuela_Materia;
                escuelaSelect.appendChild(option);
            });
        }
    };
    xhr.send();
}

// Función para cargar las materias según el ID de la escuela seleccionada
function loadMaterias() {
    const escuelaId = document.getElementById('idEscuela-pensum').value;  // Cambié 'idEscuela' a 'idEscuela-pensum'
    if (!escuelaId) return;
    //document.getElementById('idEscuelaMateria-pensum').disabled = false;
    
    limpiarFormulario();
    document.getElementById('idEscuelaMateria-pensum').value = escuelaId;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `cargarMaterias.php?escuelaId=${escuelaId}`, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const materias = JSON.parse(xhr.responseText);
            const tbody = document.getElementById('materiasTable-pensum').querySelector('tbody');  // Cambié 'materiasTable' a 'materiasTable-pensum'
            tbody.innerHTML = '';
            materias.forEach(materia => {
                const row = document.createElement('tr');
                row.dataset.id = materia.Cod_Materia;
                row.dataset.escuelaId = materia.ID_CodEscuela_Materia;  // Añadimos el ID_CodEscuela_Materia a los datos de la fila
                row.innerHTML = `
                    <td>${materia.Cod_Materia}</td>
                    <td>${materia.Nombre_Materia}</td>
                <td>
                <a href="#materiaForm-pensum">
                    <button class="editar-pensum" onclick="editarMateria('${materia.Cod_Materia}', '${materia.ID_CodEscuela_Materia}')">Editar</button>
                </a>
                </td>                `;
                tbody.appendChild(row);
            });
        }
    };
    xhr.send();
}

// Función para editar materia
function editarMateria(codMateria) {
    const escuelaId = document.getElementById('idEscuela-pensum').value; // Obtener el ID de la escuela seleccionada
    if (!escuelaId) return; // Asegurarse de que una escuela esté seleccionada

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `obtenerMateria.php?codMateria=${codMateria}&escuelaId=${escuelaId}`, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const materia = JSON.parse(xhr.responseText);
            if (materia.status === 'error') {
                alert(materia.message); // Mostrar el mensaje de error si no se encuentra la materia
            } else {
               // document.getElementById('idEscuelaMateria-pensum').disabled = true;

                // Rellenar el formulario con los datos obtenidos
                document.getElementById('codMateria-pensum').value = materia.Cod_Materia;
                document.getElementById('nombreMateria-pensum').value = materia.Nombre_Materia;
                document.getElementById('nivelMateria-pensum').value = materia.Nivel_Materia;
                document.getElementById('ucMateria-pensum').value = materia.UC_Materia;
                document.getElementById('nroMateria-pensum').value = materia.Nro_Materia;
                document.getElementById('prelacionUno-pensum').value = materia.PrelacionUno_Materia;
                document.getElementById('prelacionDos-pensum').value = materia.PrelacionDos_Materia;
                document.getElementById('prelacionTres-pensum').value = materia.PrelacionTres_Materia;
                
                // Cargar el ID de la Escuela en el formulario
                document.getElementById('idEscuelaMateria-pensum').value = materia.ID_CodEscuela_Materia;
            }
        }
    };
    xhr.send();
}

// Función para registrar nueva materia
function registrarMateria() {
    // Confirmación antes de registrar
    if (!confirm("¿Estás seguro de que quieres registrar esta materia?")) {
        alert("Operación cancelada.");
        return;
    }

    // Obtener los datos del formulario
    const materiaData = getMateriaData();

    // Validar campos obligatorios
    if (!materiaData.Cod_Materia || !materiaData.Nombre_Materia || !materiaData.ID_CodEscuela_Materia) {
        // Mostrar mensaje de error si alguno de los campos obligatorios está vacío
        alert("Los campos 'Código de Materia', 'Nombre de Materia' y 'ID de Escuela' son obligatorios.");
        return;  // Detener la ejecución si falta algún campo obligatorio
    }

    // Crear la solicitud XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'registrarMateria.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            // Parsear la respuesta JSON del servidor
            const response = JSON.parse(xhr.responseText);

            // Mostrar el mensaje recibido desde el servidor
            alert(response.message);

            // Si la inserción fue exitosa, actualizar la lista de materias y limpiar el formulario
            if (response.status === 'success') {
                loadMaterias();
                limpiarFormulario();
            }
        } else {
            // Manejar el error de la solicitud si es necesario
            alert("Hubo un error al registrar la materia.");
        }
    };

    // Enviar los datos al servidor
    xhr.send(JSON.stringify(materiaData));
}

// Función para modificar materia
function modificarMateria() {
    // Confirmación antes de modificar
    if (!confirm("¿Estás seguro de que quieres modificar esta materia?")) {
        alert("Operación cancelada.");
        return;
    }

    // Obtener los datos del formulario
    const materiaData = getMateriaData();

    // Validar campos obligatorios
    if (!materiaData.Cod_Materia || !materiaData.Nombre_Materia || !materiaData.ID_CodEscuela_Materia) {
        // Mostrar mensaje de error si alguno de los campos obligatorios está vacío
        alert("Seleccione una materia de la lista antes de modificarla");
        return;  // Detener la ejecución si falta algún campo obligatorio
    }
    // Crear la solicitud XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'modificarMateria.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Definir la función que se ejecutará cuando la respuesta llegue
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Parsear la respuesta JSON del servidor
            const response = JSON.parse(xhr.responseText);
            //  document.getElementById('idEscuelaMateria-pensum').disabled = false;

            // Mostrar el mensaje recibido desde el servidor
            alert(response.message); // Aquí mostramos el mensaje de éxito o error

            // Si la actualización fue exitosa, actualizar la lista de materias y limpiar el formulario
            if (response.status === 'success') {
                loadMaterias();  // Refrescar la lista de materias
                limpiarFormulario();  // Limpiar el formulario
            }
        } else {
            // Manejar el error de la solicitud si es necesario
            alert("Hubo un error al modificar la materia.");
        }
    };

    // Enviar los datos al servidor
    xhr.send(JSON.stringify(materiaData));
}

// Función para eliminar materia
function eliminarMateria() {
    // Confirmación antes de eliminar
    if (!confirm("¿Estás seguro de que quieres eliminar esta materia?")) {
        alert("Operación cancelada.");
        return;
    }

    const codMateria = document.getElementById('codMateria-pensum').value;
    const idEscuelaMateria = document.getElementById('idEscuelaMateria-pensum').value;  // Obtener el ID de la escuela

    // Verificar si ambos campos son válidos
    if (!codMateria || !idEscuelaMateria) {
        alert("Por favor, complete los campos 'Código de Materia' e 'ID de Escuela'.");
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'eliminarMateria.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);  // Parsear la respuesta JSON del servidor

            // Mostrar el mensaje de respuesta recibido desde el servidor
            alert(response.message);

            if (response.status === 'success') {
                //loadEscuelas();
                loadMaterias();
                limpiarFormulario();
            }
        } else {
            alert("Hubo un error al intentar eliminar la materia.");
        }
    };

    // Enviar los datos al servidor (Cod_Materia y ID_CodEscuela_Materia)
    xhr.send(JSON.stringify({ Cod_Materia: codMateria, ID_CodEscuela_Materia: idEscuelaMateria }));
}

// Función para limpiar formulario
function limpiarFormulario() {
    document.getElementById('codMateria-pensum').value = '';
    document.getElementById('nombreMateria-pensum').value = '';
    document.getElementById('nivelMateria-pensum').value = '';
    document.getElementById('ucMateria-pensum').value = '';
    document.getElementById('nroMateria-pensum').value = '';
    document.getElementById('prelacionUno-pensum').value = '';
    document.getElementById('prelacionDos-pensum').value = '';
    document.getElementById('prelacionTres-pensum').value = '';
   // document.getElementById('idEscuelaMateria-pensum').value = '';
    //alert('Operación realizada exitosamente')
}

// Obtener datos del formulario
function getMateriaData() {
    return {
        Cod_Materia: document.getElementById('codMateria-pensum').value.toUpperCase(), // Convertir a mayúsculas
        Nombre_Materia: document.getElementById('nombreMateria-pensum').value.toUpperCase(), // Convertir a mayúsculas
        Nivel_Materia: document.getElementById('nivelMateria-pensum').value.toUpperCase(), // Convertir a mayúsculas
        UC_Materia: document.getElementById('ucMateria-pensum').value.toUpperCase(), // Convertir a mayúsculas
        Nro_Materia: document.getElementById('nroMateria-pensum').value.toUpperCase(), // Convertir a mayúsculas
        PrelacionUno_Materia: document.getElementById('prelacionUno-pensum').value.toUpperCase(), // Convertir a mayúsculas
        PrelacionDos_Materia: document.getElementById('prelacionDos-pensum').value.toUpperCase(), // Convertir a mayúsculas
        PrelacionTres_Materia: document.getElementById('prelacionTres-pensum').value.toUpperCase(), // Convertir a mayúsculas
        ID_CodEscuela_Materia: document.getElementById('idEscuelaMateria-pensum').value
    };
}

// Cargar escuelas al inicio
//window.onload = loadEscuelas;
document.getElementById('idEscuelaMateria-pensum').disabled = true;
