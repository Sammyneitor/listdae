document.addEventListener('DOMContentLoaded', function () {
    localStorage.clear();
    const form = document.getElementById('loginForm');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const btnLog = document.getElementById('Btn-Log');
    const loadingContainer = document.getElementById('loading-container'); // Contenedor de "Cargando"




    const usernameLS = localStorage.getItem('username');
    const passwordLS = localStorage.getItem('password');
    
    // Verificamos si hay datos de sesión en el localStorage
    if (usernameLS && passwordLS && usernameLS.trim() !== '' && passwordLS.trim() !== '') {
        // Si existen, mostramos el mensaje de sesión activa
        alert("Ya hay una sesión iniciada en este equipo. Cierrela antes de continuar");

        // Ocultamos el formulario de login
        const loginForm = document.getElementById('Btn-Log');
        const PassForm = document.getElementById('password');
        const UserForm = document.getElementById('username');

        loginForm.disabled = true;
        PassForm.disabled = true
        UserForm.disabled =true

        // Opcional: Redirigir automáticamente a la página principal después de 3 segundos
        //setTimeout(() => {
         //   window.location.href = 'pagina-principal.html';  // Cambia esta URL por la página que deseas redirigir
       // }, 3000);  // Espera 3 segundos antes de redirigir (para que el usuario vea el mensaje)
    }



















    // Detectar el evento de presionar "Enter" en el campo de contraseña
    password.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            // Si se presiona "Enter", simular un clic en el botón de login
            btnLog.click();
        }
    });

    btnLog.addEventListener('click', function (event) {

        const RolesUser = localStorage.getItem('role'); 
        // Comprobar si 'role' no está vacío y no es null
        if (RolesUser !== '' && RolesUser !== null) {
            alert('Ya existe una sesión en este dispositivo');
            
            // Redirigir al login
            window.location.href = 'sgu_inicio_sesion.html';            
            // Reemplazar el estado en el historial para evitar que el usuario regrese a la página
            history.replaceState(null, '', 'sgu_inicio_sesion.html');
        } else {


        // Evitar que el formulario se envíe
        event.preventDefault();

        
        // Obtener los valores de los campos
        const userValue = username.value;
        const passValue = password.value;       


        // Verificar que los campos no estén vacíos
        if (!userValue || !passValue) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Desactivar el botón para evitar múltiples clics
        btnLog.disabled = true;

        // Mostrar la ventana de "Cargando"
        loadingContainer.style.display = 'flex';

        // Enviar la solicitud al servidor
        authenticateUser(userValue, passValue);

        }


    });

    // Función para autenticar al usuario con AJAX
    function authenticateUser(username, password) {
        // Crear la solicitud de tipo POST con fetch
        fetch('login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        })
        .then(response => {
            // Verificar si la respuesta es exitosa (status 200)
            if (!response.ok) {
                throw new Error('Error de red o servidor');
            }
            return response.json(); // Procesar la respuesta JSON
        })
        .then(data => {
            // Ocultar el contenedor de "Cargando" después de recibir respuesta
            loadingContainer.style.display = 'none';

            // Si el inicio de sesión es exitoso
            if (data.status === 'success') {
                // Mostrar los datos recibidos en un alert, incluyendo la IP
                // alert(`
                //     Inicio de sesión exitoso:
                //     \n\nUsername: ${data.username}
                //     \nEmail: ${data.email}
                //     \nFirst Name: ${data.firstName}
                //     \nSecond Name: ${data.secondName}
                //     \nLast Log: ${data.lastLog}
                //     \nRole: ${data.role}
                //     \nIP: ${data.lastIP}
                //     \nStatus: ${data.estatus}
                //     \nTelephone: ${data.telephone}
                //     \nPassword: ${data.password}
                //     \nGenero : ${data.GenUser}
                    
                // `);

                // Guardar los datos en localStorage
                localStorage.setItem('username', data.username);
                localStorage.setItem('email', data.email);
                localStorage.setItem('firstName', data.firstName);
                localStorage.setItem('secondName', data.secondName);
                localStorage.setItem('lastLog', data.lastLog);
                localStorage.setItem('role', data.role);
                localStorage.setItem('lastIP', data.lastIP);
                localStorage.setItem('estatus', data.estatus);
                localStorage.setItem('telephone', data.telephone);
                localStorage.setItem('password', data.password);
                localStorage.setItem('GenUser', data.GenUser);



                
                // Redirigir dependiendo del rol
                redirectUser(data);
            } else if (data.status === 'session_active') {
                // Si hay una sesión activa, preguntar al usuario
                handleActiveSession(data);
            } else if (data.status === 'error') {
                // Si la autenticación falla, mostramos un mensaje de error
                alert(data.message);  // Aquí se muestra el mensaje de error que se pasa desde PHP
            }


        })
        .catch(error => {
            // Ocultar el contenedor de "Cargando" en caso de error
            loadingContainer.style.display = 'none';
            // Mostrar un mensaje de error detallado
            alert(`Error: ${error.message}. Por favor, intente más tarde.`);
        })
        .finally(() => {
            // Rehabilitar el botón de login después de la respuesta
            btnLog.disabled = false;
        });

       

    }

    // Función para redirigir al usuario según su rol
    function redirectUser(data) {


        if (data.role === 'admin') {
            // Redirigir a admin sin guardar la página en el historial
            window.location.replace('sgu_cargar_listados.html');
        } else if (data.role === 'prof') {
            // Redirigir a profesor sin guardar la página en el historial
            window.location.replace('sgu_descargar_listados.html');
        } else {
            // Página por defecto sin guardar la página en el historial
            window.location.replace('sgu_index.html');
        }
    }
    

    // Manejar el caso cuando hay una sesión activa
    function handleActiveSession(data) {
        if (confirm(data.message)) {
            // Si el usuario acepta, cerramos la sesión anterior
            closePreviousSession(data.username);
        } else {
            // Si no acepta, limpiamos los campos
            username.value = '';
            password.value = '';
        }
    }

    // Función para cerrar la sesión anterior (actualizar el estatus a 0)
    function closePreviousSession(username) {
        fetch('close_session.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(username)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('La sesión anterior fue cerrada correctamente. Ahora puedes iniciar sesión.');
                btnLog.click(); // Reintentar el login
            } else {
                alert('Hubo un error al intentar cerrar la sesión anterior. Por favor, intente nuevamente.');
            }
        })
        .catch(error => {
            alert(`Error: ${error.message}`);
        });
    }
});

// document.querySelectorAll('a').forEach(function (link) {
//     link.addEventListener('click', function (event) {
//         event.preventDefault(); // Prevenir la acción predeterminada del enlace

//         // Actualizar la URL con el hash usando history.replaceState
//         // Esto cambia la URL sin que se agregue al historial
//         history.replaceState(null, '', window.location.pathname);
//     });
// });

