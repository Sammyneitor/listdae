  // Espera a que el contenido de la página esté cargado
  document.addEventListener('DOMContentLoaded', function() {
    // Obtiene todos los enlaces con la clase 'open-link'
    const links = document.querySelectorAll('.open-link');
    
    // Agrega un evento de clic a cada enlace
    links.forEach(function(link) {
      link.addEventListener('click', function(event) {
        // Previene la acción por defecto del enlace (no navegaremos directamente)
        event.preventDefault();
        
        // Obtiene el atributo href del enlace
        const url = link.getAttribute('href');
        
        // Abre el enlace en una nueva pestaña
        window.open(url, '_blank');
      });
    });
  });
