window.onload = function() {
    // Obtener el valor de 'role' desde el localStorage
    const role = localStorage.getItem('role');
    
    // Obtener el enlace <li> y el <a> dentro de él
    const homeLink = document.getElementById('homeLink');
    const homeLinkAnchor = homeLink.querySelector('a');
    
    // Verificar el valor del 'role' y ajustar el enlace de acuerdo con ello
    if (role === 'admin') {
        // Si el role es 'admin', redirigir al admin dashboard
        homeLinkAnchor.href = 'sgu_cargar_listados.html'; // Cambia con la página que desees para admins
        //homeLinkAnchor.textContent = 'HOME'; // Cambia el texto si es necesario
    } else if (role === 'prof') {
        // Si el role es 'prof', redirigir a la página del profesor
        homeLinkAnchor.href = 'sgu_descargar_listados.html'; // Cambia con la página que desees para profesores
       // homeLinkAnchor.textContent = 'HOME'; // Cambia el texto si es necesario
    } else if (role === 'sup') {
        // Si el role es 'sup', redirigir a la página del supervisor
        homeLinkAnchor.href = 'sgu_index.html'; // Cambia con la página que desees para supervisor
       // homeLinkAnchor.textContent = 'HOME'; // Cambia el texto si es necesario
    } else {
        // Si no se encuentra el 'role', puede ser un visitante o un rol no asignado, redirigir a la página de inicio
        homeLinkAnchor.href = 'index.html'; // Página predeterminada o de inicio
      //  homeLinkAnchor.textContent = 'HOME';
    }
};
