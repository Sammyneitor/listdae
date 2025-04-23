document.addEventListener('DOMContentLoaded', function () {
    // Escuchar el evento de clic en el botón de Cerrar sesión
    document.querySelector('.LogOutCabecera').addEventListener('click', function () {
        // Obtener los valores de los inputs ocultos
        const username = document.getElementById('username_Log').value;
        const password = document.getElementById('password_Log').value;

        // Mostrar el contenedor de carga (spinner)
        document.getElementById('loading-container').style.display = 'flex';

        // Enviar la solicitud al servidor para cerrar la sesión
        fetch('cerrar_sesion.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Eliminar toda la información del localStorage
                localStorage.removeItem('username');
                localStorage.removeItem('email');
                localStorage.removeItem('firstName');
                localStorage.removeItem('secondName');
                localStorage.removeItem('lastLog');
                localStorage.removeItem('role');
                localStorage.removeItem('lastIP');
                localStorage.removeItem('estatus');
                localStorage.removeItem('telephone');
                localStorage.removeItem('password'); // Aquí eliminamos la contraseña también

                // Esperar un breve tiempo para mostrar el spinner
                setTimeout(function() {
                    // Redirigir a la página de login después de unos segundos
                    window.location.replace ('sgu_inicio_sesion.html');
                }, 500); // Espera de 2 segundos (ajustable)

            } else {
                alert('Hubo un error al cerrar la sesión. Por favor, intente de nuevo.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error con la conexión. Por favor, intente más tarde.');
        });
    });
});

