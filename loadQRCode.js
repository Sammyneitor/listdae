document.addEventListener('DOMContentLoaded', function() {
  const RolesUser = localStorage.getItem('role'); 
  if (RolesUser !== 'sup') {
      alert('ACCESO DENEGADO (SESIONES CERRADAS)');
      // Si el valor de 'role' no es 'prof', simular un clic en el botón de "salir de sesión"
      window.location.href = 'sgu_inicio_sesion.html';
  }

  function onScanSuccess(decodedText, decodedResult) {
    // Manejar el éxito con el texto o resultado decodificado
    console.log(`Scan result: ${decodedText}`, decodedResult);
    alert(`El código QR escaneado es: ${decodedText}`);
    // Detener el escaneo después de una lectura exitosa
    html5QrcodeScanner.stop();
  }

  // Obtener el botón de escanear y el contenedor de escaneo
  const btnEscanear = document.getElementById('btnEscanear');
  const contenedorEscaneo = document.getElementById('contenedorEscaneo');

  // Configurar el escáner pero no iniciarlo aún
  const html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

  // Cuando el usuario haga clic en el botón, mostrar el contenedor y activar el escaneo
  btnEscanear.addEventListener('click', () => {
    contenedorEscaneo.style.display = 'block'; // Mostrar el contenedor del escáner
    html5QrcodeScanner.render(onScanSuccess);  // Iniciar el escaneo al hacer clic
  });
});
