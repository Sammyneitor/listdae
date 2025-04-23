// Función para recuperar el Last_Log desde el PHP
function obtenerLastLog() {
    // Recuperar los valores de username y password desde los inputs ocultos
    const username = document.getElementById('username_Log').value;
    const password_user = document.getElementById('password_Log').value;

    // Hacer la solicitud al PHP para obtener el Last_Log
    fetch('get_last_log.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password_user: password_user
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.last_log) {
            // Si encontramos Last_Log, lo guardamos en el input oculto
            document.getElementById('last_log_user').value = data.last_log;

            // Mostrar el valor recuperado (para fines de prueba)
            console.log('Last Log:', data.last_log);
        } else if (data.error) {
            // Si hubo un error (por ejemplo, no se encontró el registro)
            console.error('Error:', data.error);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
}

// Llamamos a la función al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  //  alert('OBTENGOGLL');

    obtenerLastLog(); // Llama a la función cuando el DOM esté completamente cargado
});