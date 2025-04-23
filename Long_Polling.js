// Guardar las referencias de los elementos una vez al principio

const usernameElement = document.getElementById('username_Log');
const passwordElement = document.getElementById('password_Log');
const lastLogElement = document.getElementById('last_log_user');
const messageElement = document.getElementById('message');
const lastLogValueElement = document.getElementById('lastLogValue');

// Función que realiza el long polling
function longPolling() {
    // Recuperar los valores actuales de los inputs ocultos
    const username = usernameElement.value;
    const password = passwordElement.value;
    const currentLastLog = lastLogElement.value;

    // Realizar la solicitud al servidor para comprobar si el Last_Log ha cambiado
    fetch('long_poll.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            username: username,
            password: password,
            last_log: currentLastLog
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.changed) {
            // Si hubo un cambio en Last_Log, mostrar el mensaje
            messageElement.style.display = 'block'; // Mostrar el div de mensaje
            lastLogValueElement.innerText = `Nuevo valor de Last_Log: ${data.new_last_log}`;

            // Actualizar el input con el nuevo valor de Last_Log
            lastLogElement.value = data.new_last_log;

            window.location.href = 'sgu_inicio_sesion.html';
            history.replaceState(null, '', 'sgu_inicio_sesion.html');

            // Borrar el localStorage
            localStorage.clear();
        } else {
            // Si no hubo cambios, continuar con el polling después de un intervalo
            scheduleNextPolling(); // Llamar a la función para esperar antes de hacer la siguiente solicitud
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        scheduleNextPolling(); // Intentar nuevamente en caso de error
    });
}

// Función para esperar un intervalo antes de hacer la siguiente solicitud
function scheduleNextPolling() {
    setTimeout(longPolling, 4000); // Esperar 3 segundos antes de hacer la siguiente solicitud
}

// Iniciar el long polling al cargar la página
document.addEventListener("DOMContentLoaded", function() {
   // alert('iniciaLP');

    longPolling(); // Llamar a la función de long polling cuando la página esté lista
});