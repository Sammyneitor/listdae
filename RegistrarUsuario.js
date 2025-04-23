document.getElementById('submitButton').addEventListener('click', function() {
    // Recuperar los valores de los campos del formulario
    const userName = document.getElementById('userName').value;
    const passwordUser = document.getElementById('passwordUser').value;
    const email = document.getElementById('email').value;
    const firstName = document.getElementById('firstName').value;
    const secondName = document.getElementById('secondName').value;
    const firstLastName = document.getElementById('firstLastName').value;
    const secondLastName = document.getElementById('secondLastName').value;
    const roleUser = document.getElementById('roleUser').value;
    const telephoneNumber = document.getElementById('telephoneNumber').value;
    const userBio = document.getElementById('userBio').value;
    const genero = document.querySelector('input[name="genero"]:checked')?.value; // Genero seleccionado (M/F)

    // Comprobar que no haya campos vacíos
    if (!userName || !passwordUser || !email || !firstName || !firstLastName || !roleUser || !genero) {
        alert('Por favor, complete todos los campos requeridos.');
        return;
    }

    // Crear un objeto con los datos del formulario
    const formData = {
        userName,
        passwordUser,
        email,
        firstName,
        secondName,
        firstLastName,
        secondLastName,
        roleUser,
        telephoneNumber,
        userBio,
        genero
    };

    // Mostrar los datos en un alert antes de enviar
    // alert('Datos leídos del formulario:\n' + JSON.stringify(formData, null, 2));

    // Enviar los datos mediante AJAX
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'registerUser.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json'); // Para enviar JSON al servidor

    // Cuando la respuesta esté lista
    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
                alert('Usuario registrado exitosamente.');
                // Limpiar el formulario
                document.getElementById('userName').value = '';
                document.getElementById('passwordUser').value = '';
                document.getElementById('email').value = '';
                document.getElementById('firstName').value = '';
                document.getElementById('secondName').value = '';
                document.getElementById('firstLastName').value = '';
                document.getElementById('secondLastName').value = '';
                document.getElementById('roleUser').value = 'prof'; // Valor predeterminado
                document.getElementById('telephoneNumber').value = '';
                document.getElementById('userBio').value = '';
                document.querySelector('input[name="genero"]:checked').checked = false;
            } else {
                alert(response.message || 'Hubo un error al registrar el usuario.');
            }
        }
    };

    // Enviar los datos como JSON
    xhr.send(JSON.stringify(formData));
});

// Lógica para el botón "Limpiar"
document.getElementById('clearButton').addEventListener('click', function() {
    // Limpiar todos los campos del formulario
    document.getElementById('userName').value = '';
    document.getElementById('passwordUser').value = '';
    document.getElementById('email').value = '';
    document.getElementById('firstName').value = '';
    document.getElementById('secondName').value = '';
    document.getElementById('firstLastName').value = '';
    document.getElementById('secondLastName').value = '';
    document.getElementById('roleUser').value = 'prof'; // Valor predeterminado
    document.getElementById('telephoneNumber').value = '';
    document.getElementById('userBio').value = '';
    document.querySelector('input[name="genero"]:checked').checked = false;
});
