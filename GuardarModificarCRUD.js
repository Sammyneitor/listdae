document.getElementById("btnGuardar").addEventListener("click", function(event) {
    event.preventDefault(); // Evita el comportamiento por defecto del botón (en caso de que sea parte de un formulario)
    const formulario = document.getElementById("form-alumno");

    // Recoger los valores de los inputs, selects y radio buttons
    const primerNombre = document.getElementById("primer_nombre").value;
    const segundoNombre = document.getElementById("FirstName_AlumnoV2").value;
    const primerApellido = document.getElementById("SecondName_Alumno").value;
    const segundoApellido = document.getElementById("SecondName_AlumnoV2").value;
    const cedula = document.getElementById("Cedula").value;
    const nacionalidad = document.getElementById("Nacionalidad").value;
    const escuelaAsignada = document.getElementById("Escuela_Asignada").value;
    const modoIngreso = document.getElementById("modo_ingreso").value;
    const genero = document.getElementById("Genero").value;
    const estadoCivil = document.getElementById("Estado_Civil").value;
    const fechaNacimiento = document.getElementById("Fecha_Nacimiento").value;
    const paisOrigen = document.getElementById("Pais_Origen").value;
    const estadoActual = document.getElementById("Estado_Actual").value;
    const direccion = document.getElementById("Direccion").value;
    const telLocal = document.getElementById("Tel_Local").value;
    const telCelular = document.getElementById("Tel_Celular").value;
    const email = document.getElementById("E_mail").value;
    const observaciones = document.getElementById("Observaciones").value;

    // Recoger los valores de los radio buttons (estatus alumno)
    const estatusAlumno = document.querySelector('input[name="estatusAlumno"]:checked')?.value; // Obtener el valor del radio button seleccionado

    // Recoger los valores de los radio buttons (tipo alumno)
    const tipoAlumno = document.querySelector('input[name="tipoAlumno"]:checked')?.value; // Obtener el valor del radio button seleccionado

    // Validar que los campos obligatorios no estén vacíos
    if (!primerNombre || !primerApellido || !nacionalidad || !escuelaAsignada || !tipoAlumno || !estatusAlumno || !cedula) {
        alert("Los siguientes campos son obligatorios: Primer nombre, Primer apellido, Nacionalidad, Escuela asignada, Tipo de alumno y Estatus del alumno.");
        return; // Evita el envío del formulario si falta algún campo obligatorio
    }

    const anoIngreso = document.getElementById("ano_ingreso").value;
    const periodoIngreso = document.getElementById("periodo_ingreso").value;

    // Crear un objeto con los datos que se enviarán al servidor
    const data = {
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido,
        cedula,
        nacionalidad,
        escuelaAsignada,
        modoIngreso,
        genero,
        estadoCivil,
        fechaNacimiento,
        paisOrigen,
        estadoActual,
        direccion,
        telLocal,
        telCelular,
        email,
        observaciones,
        estatusAlumno, // Aquí enviamos el valor del estatus
        tipoAlumno,    // Aquí enviamos el valor del tipo de alumno
        anoIngreso,
        periodoIngreso
    };

    //alert("Datos que se enviarán al servidor: " + JSON.stringify(data, null, 2));

    // Enviar los datos al servidor usando Fetch
    fetch('SaveAlumnoCRUD.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Alumno guardado/actualizado con éxito.");
            limpiarFormulario(formulario);
        } else {
            alert("Compruebe los campos obligatorios (Primer nombre, Primer Apellido, Cedula, Nacionalidad, Escuela, Estatus y tipo de alumno)");
            limpiarFormulario(formulario);
        }
    })
    .catch(error => {
        console.error('Error al guardar los datos:', error);
        alert("Hubo un problema con la conexión.");
    });
});
