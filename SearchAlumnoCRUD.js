const inputCedula = document.getElementById('Cedula');
const inputPnombre = document.getElementById('primer_nombre');
const inputSnombre = document.getElementById('FirstName_AlumnoV2');
const inputPapellido = document.getElementById('SecondName_Alumno');
const inputSapellido = document.getElementById('SecondName_AlumnoV2');
const selectNacionalidad = document.getElementById('Nacionalidad');
const selectEscuela = document.getElementById('Escuela_Asignada');
const selectGenero = document.getElementById('Genero');
const selectEdoCivil = document.getElementById('Estado_Civil');
const selectDOB = document.getElementById('Fecha_Nacimiento');
const selectPaisSrc = document.getElementById('Pais_Origen');
const selectEstadoSrc = document.getElementById('Estado_Actual');
const inputDireccion = document.getElementById('Direccion');
const inputTelLocal = document.getElementById('Tel_Local');
const inputTelMovil = document.getElementById('Tel_Celular');
const inputEmail = document.getElementById('E_mail');
const inputAnoIngreso = document.getElementById('ano_ingreso');
const inputPeriodoIngreso = document.getElementById('periodo_ingreso');
const selectModo_ingreso = document.getElementById('modo_ingreso');
const inputObservaciones = document.getElementById('Observaciones');

// Función que asigna los datos del alumno a los campos del formulario
function asignarDatosAlumno(alumno) {
    inputCedula.value = alumno.ID_Alumno; // Asignamos el valor a Cedula
    inputPnombre.value = alumno.FirstName_Alumno;
    inputSnombre.value = alumno.FirstName_AlumnoV2;
    inputPapellido.value = alumno.SecondName_Alumno;
    inputSapellido.value = alumno.SecondName_AlumnoV2;
    inputObservaciones.value = alumno.Observacion_Alumno;

    function addOptionIfNotExist(selectElement, value, text) {
        // Verificar si la opción ya existe
        const options = Array.from(selectElement.options);
        const existingOption = options.find(option => option.value === value);

        if (!existingOption) {
            // Si no existe, crear una nueva opción
            const newOption = document.createElement("option");
            newOption.value = value;
            newOption.textContent = text;
            selectElement.appendChild(newOption);  // Agregar la nueva opción al select
        }
    }
    addOptionIfNotExist(selectModo_ingreso, alumno.Modalidad_Ingreso, alumno.Modalidad_Ingreso);

    selectModo_ingreso.value = alumno.Modalidad_Ingreso;

    // Asignar Nacionalidad
    selectNacionalidad.value = alumno.Nacionalidad_Alumno === 'V' ? 'V' : alumno.Nacionalidad_Alumno === 'E' ? 'E' : '';

    // Asignar Escuela
    if ([117, 112, 157, 115, 166, 165, 164, 163, 161, 162,172,171].includes(alumno.CodCarrera_Alumno)) {
        selectEscuela.value = Number(alumno.CodCarrera_Alumno);
    } else {
        selectEscuela.value = '';
    }

    // Asignar Género
    selectGenero.value = alumno.Genero_Alumno === 'M' || alumno.Genero_Alumno === 'F' ? alumno.Genero_Alumno : '';

    // Asignar Estado Civil
    //const estadosCiviles = ['Soltero', 'Casado', 'Viudo', 'Divorciado', 'Otro'];
    selectEdoCivil.value = alumno.Edo_CivilAlumno;

    // Asignar Fecha de Nacimiento
    selectDOB._flatpickr.setDate(alumno.DOB_Alumno);

    // Asignar País y Estado de Residencia
    selectPaisSrc.value = alumno.Nombre_Nacionalidad;
    selectEstadoSrc.value = alumno.Edo_Residencia_Alumno;

    // Asignar Dirección, Teléfonos y Email
    inputDireccion.value = alumno.Direccion_Alumno;
    inputTelLocal.value = alumno.Telf_Local_Alumno;
    inputTelMovil.value = alumno.Tel_Movil_Alumno;
    inputEmail.value = alumno.Email_Alumno;

    // Asignar Estatus
    if (alumno.Estatus_Alumno === 1) {
        document.getElementById('estatusInactivo').checked = true;
    } else if (alumno.Estatus_Alumno === 0) {
        document.getElementById('estatusActivo').checked = true;
    }

    // Asignar Tipo de Alumno
    if (alumno.CodActivo_Alumno === 1) {
        document.getElementById('tipoNuevo').checked = true;
    } else if (alumno.CodActivo_Alumno === 3) {
        document.getElementById('tipoRegular').checked = true;
    } else if (alumno.CodActivo_Alumno === 2) {
        document.getElementById('tipoGraduado').checked = true;
    }

    // Asignar Año y Periodo de Ingreso
    inputAnoIngreso.value = alumno.AñoIngreso_Alumno;
    inputPeriodoIngreso.value = alumno.PeriodoIngreso_Alumno === 1 || alumno.PeriodoIngreso_Alumno === 2 ? alumno.PeriodoIngreso_Alumno : '';
}

// Función para buscar por cédula y mostrar los datos
function buscarCRUDCedula() {
    const cedula = document.getElementById('Cedula').value.trim();
    if (cedula !== '') {
        let data = { cedula: cedula };
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'SearchAlumnoCRUDCI.php', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                const resultado = JSON.parse(xhr.responseText);
                if (resultado) {
                    asignarDatosAlumno(resultado);
                } else {
                    alert('No se encontró el alumno con la cédula proporcionada.');
                    limpiarFormulario(formulario);

                    
                }
            } else {
                alert("Error en la consulta ");
            }
        };
        xhr.send(JSON.stringify(data));
    }
}

// Función para buscar por nombre y mostrar los datos
function buscarCRUDPName(event) {
    const inputValue = event.target.value.trim();
    const dataInfo = event.target.getAttribute('data-info');
    if (inputValue !== '') {
        let data = { valor: inputValue, campo: dataInfo };
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'SearchAlumnoCRUDPName.php', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                const resultado = JSON.parse(xhr.responseText);
                if (Array.isArray(resultado) && resultado.length > 1) {
                    mostrarModal(resultado);
                } else if (resultado.length === 1) {
                    asignarDatosAlumno(resultado[0]);
                } else {
                    alert('No se encontraron alumnos con ese nombre');
                    limpiarFormulario(formulario);

                }
            } else {
                alert("Error en la consulta ");
            }
        };
        xhr.send(JSON.stringify(data));
    }
}

// Función para mostrar los resultados en un modal
function mostrarModal(resultado) {
    document.getElementById('modalResultados').style.display = 'block';
    const lista = document.getElementById('resultadoLista');
    lista.innerHTML = '';
    resultado.sort((a, b) => `${a.FirstName_Alumno} ${a.SecondName_Alumno}`.localeCompare(`${b.FirstName_Alumno} ${b.SecondName_Alumno}`));
    resultado.forEach((alumno, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${alumno.FirstName_Alumno} ${alumno.SecondName_Alumno} | Cod.Escuela: ${alumno.CodCarrera_Alumno} | (${alumno.Nacionalidad_Alumno} ${alumno.ID_Alumno})`;
        li.onclick = function () {
            asignarDatosAlumno(alumno);
            cerrarModal();
        };
        lista.appendChild(li);
    });
}

// Función para cerrar el modal
function cerrarModal() {
    document.getElementById('modalResultados').style.display = 'none';
}

// Función para verificar "Enter" en el campo de cédula
function verificarEnterCedula(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        buscarCRUDCedula();
    }
}

// Función para verificar "Enter" en el campo de nombre
function verificarEnterPNombre(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        buscarCRUDPName(event);
    }
}

window.onload = function () {
    fetch('get_paises.php')
        .then(response => response.text())
        .then(data => {
            document.getElementById('Paises_options').innerHTML = data;
        })
        .catch(error => console.error('Error al cargar países:', error));

    flatpickr("#Fecha_Nacimiento", {
        dateFormat: "d/m/Y",
        altInput: true,
        altFormat: "d/m/Y",
        locale: "es"
    });

    const anosList = document.getElementById('anosList');
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 50; i++) {
        const year = currentYear - i;
        const option = document.createElement('option');
        option.value = year;
        anosList.appendChild(option);
    }
};

document.getElementById('Pais_Origen').addEventListener('change', function () {
    let paisId = null;
    const inputValue = this.value;
    const options = document.querySelectorAll('#Paises_options option');
    options.forEach(option => {
        if (option.value === inputValue) {
            paisId = option.getAttribute('data-info');
        }
    });

    if (paisId) {
        fetch(`get_estados.php?pais_id=${paisId}`)
            .then(response => response.text())
            .then(data => {
                document.getElementById('Estados_options').innerHTML = data;
            })
            .catch(error => console.error('Error al cargar estados:', error));
    } else {
        document.getElementById('Estados_options').innerHTML = '';
    }
});

////////***************CONFIRMACIO DE LIMPIEZA */


// Función para limpiar el formulario
function limpiarFormulario(formulario) {
    // Resetea el formulario (vacía los campos de texto, deselecciona los checkboxes y radio buttons)
    formulario.reset(); 

    // Restaurar los valores de los selects a la opción por defecto (usualmente la primera opción)
    const selects = formulario.querySelectorAll('select');
    selects.forEach(select => {
        select.selectedIndex = 0;  // Restablece la opción por defecto
    });

    // Restaurar los radio buttons y checkboxes a su estado inicial
    const radios = formulario.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    radios.forEach(radio => {
        radio.checked = false;  // Desmarca todos los radio buttons y checkboxes
    });

    // Restaurar cualquier input de texto que esté vacío o contenga algún valor
    const inputsTexto = formulario.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    inputsTexto.forEach(input => {
        input.value = '';  // Limpia los valores de los campos de texto
    });
    
    // Si tienes campos específicos con `datalist`, puedes restablecerlos como vacíos también
    const datalists = formulario.querySelectorAll('input[list]');
    datalists.forEach(input => {
        input.value = '';  // Limpia los datalists
    });
}


// Seleccionamos el formulario y el botón de limpiar
const formulario = document.getElementById("form-alumno");
const btnLimpiar = document.getElementById("btnLimpiar");

// Evento para el clic en el botón de limpiar
btnLimpiar.addEventListener("click", function() {
    // Mostrar un cuadro de confirmación
    const confirmacion = window.confirm("¿Estás seguro de que deseas limpiar todos los campos del formulario?");

    // Si el usuario acepta (clic en "Aceptar"), limpiamos el formulario
    if (confirmacion) {
       limpiarFormulario(formulario);
    } else {
        console.log("El formulario no fue limpiado.");
    }
});



