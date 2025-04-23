
document.addEventListener("DOMContentLoaded", function() {

const genUser = localStorage.getItem('GenUser'); // 'M' o 'F'
//const RolesUser = localStorage.getItem('role'); // 'M' o 'F'


// Obtener el elemento de la imagen del avatar
const avatarElement = document.querySelector('.imagen-redonda');

// Comprobar el valor y cambiar la imagen del avatar según corresponda
if (genUser === 'M') {
    avatarElement.src = 'img/AvatarMale.png'; // Cambia esta ruta por la imagen masculina que desees
    avatarElement.alt = 'Avatar';
} else if (genUser === 'F') {
    avatarElement.src = 'img/AvatarFemale.jpg'; // Cambia esta ruta por la imagen femenina que desees
    avatarElement.alt = 'Avatar';
} else {
    // Si no hay valor o el valor no es 'M' ni 'F', usa una imagen por defecto
    avatarElement.src = 'img/AvatarDefault.jpg';
    avatarElement.alt = 'Avatar';
}
});
