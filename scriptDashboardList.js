$(document).ready(function() {
    // Bloquear la interacción con la página inicialmente
    $('body').css('pointer-events', 'none');  // Deshabilitar interacción
    $('body').css('background-color', 'rgba(0, 0, 0, 0.5)');  // Fondo para indicar bloqueo

    // Hacer la consulta AJAX
    $.ajax({       
        url: 'ConsultaDashboardList.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            $('#DSBListEstudents').text(data.nroEstudiantes);
            $('#DSBListEstudentsNew').text(data.nuevosEstudiantes);
            $('#DSBListEstudentsReg').text(data.regularesEstudiantes);

            // Simular clic en el enlace al cargar la página
            var enlace = document.getElementById("enlaceMedicina"); // ID del enlace que deseas simular el clic
            if (enlace) {
                enlace.click(); // Simula el clic
            }
        },
        error: function(xhr, status, error) {
            console.error('Error en la consulta AJAX:', error);
        }
    });

    const RolesUser = localStorage.getItem('role'); 
    //if (RolesUser === 'admin' ) {
      //  alert ('ACCESO DENEGADO (SESIONES CERRADAS)');
        // Si el valor de 'role' no es 'prof', simular un clic en el botón de "salir de sesión"
          // Simula un clic en el botón de salir
        //  window.location.href = 'loging.html';
          //history.replaceState(null, '', 'loging.html');
    //}


    // Recuperar los valores del localStorage
    const firstName = localStorage.getItem('firstName');
    const secondName = localStorage.getItem('secondName');
    const email = localStorage.getItem('email');
    const lastLog = localStorage.getItem('lastLog'); // Recuperar el campo lastLog
    
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password'); // Recuperar el campo password

    // Mostrar el First Name y Second Name en el H1 con id="TypeUser"
    const typeUserElement = document.getElementById('TypeUser');
    if (firstName && secondName) {
        typeUserElement.textContent = `${firstName} ${secondName}`;  // Mostrar el nombre completo
    } else {
        typeUserElement.textContent = 'Usuario Desconocido';  // Si no hay datos
    }
    
    // Mostrar el email en el label con id="NameUser"
    const userEmailElement = document.getElementById('NameUser');
    if (email) {
        userEmailElement.textContent = email;  // Mostrar el email
    } else {
        userEmailElement.textContent = 'Email no disponible';  // Si no hay email
    }
    
    // Mostrar el Last Log en una nueva etiqueta (H2 o label)
    const lastLogElement = document.getElementById('lastLogDate'); // Asegúrate de tener un id para esta etiqueta en tu HTML
    if (lastLog) {
        lastLogElement.textContent = `${lastLog}`;  // Mostrar la fecha del último acceso
    } else {
        lastLogElement.textContent = 'No disponible';  // Si no hay fecha de último acceso
    }

    // Asignar los valores de username y password a los campos de login
    document.getElementById('username_Log').value = username;
    document.getElementById('password_Log').value = password;

    // Función para comprobar si los valores de username y password son válidos
    function checkLoginValidity() {
        if (username && password && username.trim() !== '' && password.trim() !== '') {
            // Si los valores son válidos, desbloquear la página
            $('body').css('pointer-events', 'auto');  // Habilitar interacción
            $('body').css('background-color', '');    // Quitar el fondo bloqueado
        } else {
            // Si los valores no son válidos, mantener la página bloqueada
            alert('Por favor, inicie sesion antes de continuar.');
            window.location.replace ('sgu_inicio_sesion.html');
        }
    }

    // Llamar a la función que revisa la validez del login al cargar la página
    checkLoginValidity();
});

document.querySelectorAll('.nav a').forEach(function (link) {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // Prevenir la acción predeterminada del enlace

        // Actualizar la URL con el hash usando history.replaceState
        // Esto cambia la URL sin que se agregue al historial
        history.replaceState(null, '', window.location.pathname);
    });
});

document.addEventListener('click', function() {
    // Recuperar los valores de username y password de localStorage
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    // Comprobar si los valores están vacíos
    if (!username || !password || username.trim() === '' || password.trim() === '') {
        // Si alguno de los valores está vacío, mostrar el mensaje de alerta y redirigir
        alert('Por favor, inicie sesión antes de continuar.');
        window.location.replace('sgu_inicio_sesion.html');  // Redirige a la página de login
    }
});


window.addEventListener('unload', function() {
    // Limpiar los datos del localStorage
    //console.log('La página se está cerrando, limpiando localStorage...');
    if (RolesUse === 'prof'){
        localStorage.clear();
    }
});
