document.addEventListener('DOMContentLoaded', function() {
    const RolesUser = localStorage.getItem('role'); 
    //alert('queta');
    if (RolesUser === 'prof') {
        alert ('ACCESO DENEGADO (SESIONES CERRADAS)');
        // Si el valor de 'role' no es 'prof', simular un clic en el botón de "salir de sesión"
          // Simula un clic en el botón de salir
          window.location.href = 'sgu_inicio_sesion.html';
          history.replaceState(null, '', 'sgu_inicio_sesion.html');
    }



    /////////////////////////////////////////////////////////////////////d
    const selectTable = document.getElementById('table-name_Drop');

    // Obtener las tablas disponibles del backend
    fetch('get_tablesDrop.php')
    .then(response => response.json())
    .then(data => {
      if (data.tables && data.tables.length > 0) {
        data.tables.forEach(table => {
          const option = document.createElement('option');
          option.value = table; // El valor sigue siendo el nombre de la tabla con prefijo
  
          // Obtener el texto a mostrar desde el data-value (que ya tiene el formato deseado)
          let tableText = table.replace(/record_/g, ''); // Elimina "record_"
          tableText = tableText.replace(/_/g, ' ');       // Reemplaza "_" con espacios
          tableText = tableText.toUpperCase(); // Convierte a mayúsculas

          option.dataset.value = table; // Establece el atributo data-value
          option.textContent = tableText; // Muestra el texto modificado
  
          switch (table) {
            case "record_estudiantes_medicina":
                option.dataset.cod = "117";
                break;
            case "record_estudiantes_bioanalisis":
                option.dataset.cod = "112";
                break;
            case "record_estudiantes_lic_fisioterapia":
                option.dataset.cod = "171";
                break;
            case "record_estudiantes_tsu_enfermeria":
                option.dataset.cod = "157";
                break;
            case "record_estudiantes_lic_enfermeria":
                option.dataset.cod = "115";
                break;
            case "record_estudiantes_tsu_regist_estad_salud":
                option.dataset.cod = "166";
                break;
            case "record_estudiantes_tsu_terapia_psicosocial":
                option.dataset.cod = "165";
                break;
            case "record_estudiantes_lic_psicologia":
                option.dataset.cod = "172";
                break;
            case "record_estudiantes_tsu_imagenologia":
                option.dataset.cod = "164";
                break;
            case "record_estudiantes_tsu_histotecnologia":
                option.dataset.cod = "163";
                break;
            case "record_estudiantes_tsu_citotecnologia":
                option.dataset.cod = "161";
                break;
            case "record_estudiantes_tsu_tec_cardiopulmonar":
                option.dataset.cod = "162";
                break;
            default:
                option.dataset.cod = "unknown"; // Valor por defecto si no coincide con ningún caso
        }
   
          selectTable.appendChild(option);
        });
            } else {
                selectTable.innerHTML = '<option value="" disabled>No hay tablas disponibles</option>';
            }
        })
        .catch(error => {
            console.error('Error al cargar las tablas:', error);
            selectTable.innerHTML = '<option value="" disabled>No se pudo cargar las tablas</option>';
        });

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

    // Asignar los valores a los campos de login
    document.getElementById('username_Log').value = username;
    document.getElementById('password_Log').value = password;

    // Bloquear la interacción con la página al principio
    const bodyElement = document.body;
    bodyElement.style.pointerEvents = 'none'; // Deshabilita los clics y la interacción

    // Función para comprobar si los valores de username y password son válidos
    function checkLoginValidity() {
        if (username && password && username.trim() !== '' && password.trim() !== '') {
            // Si los valores son válidos, desbloquear la página
            bodyElement.style.pointerEvents = 'auto';  // Habilitar la interacción
            bodyElement.style.backgroundColor = '';    // Quitar el fondo bloqueado (si se aplicó uno)
            

        } else {
            // Si los valores no son válidos, mantener la página bloqueada
            alert('Por favor, inicie sesion antes de continuar.');
            window.location.replace ('sgu_inicio_sesion.html');
        }
    }
    
    // Llamar a la función que revisa la validez del login al cargar la página
    checkLoginValidity();
    
    //startLongPolling();
});


//-------------------------------------//

 
document.addEventListener('click', function() {
    // Recuperar los valores de username y password de localStoraged
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    const userOriginal = document.getElementById('username_Log');
    const claveOriginal = document.getElementById('password_Log');

    // Comprobar si los valores están vacíos o si son distintos a los valores en los campos de entrada
    if (
        !username || 
        !password || 
        username.trim() === '' || 
        password.trim() === '' || 
        username !== userOriginal.value || 
        password !== claveOriginal.value
    ) {
        // Si alguna de las condiciones es verdadera, mostrar el mensaje de alerta y redirigir
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
