   // Espera a que el contenido de la página esté cargado
   document.addEventListener('DOMContentLoaded', function() {
   const RolesUser = localStorage.getItem('role'); 
  //if (RolesUser !== 'sup'){
        
  // Obtenemos la fecha y hora actual
  var fechaHoraActual = new Date();
  
  // Obtener las partes de la fecha y hora
  var anio = fechaHoraActual.getFullYear();
  var mes = (fechaHoraActual.getMonth() + 1).toString().padStart(2, '0'); // Mes de 2 dígitos
  var dia = fechaHoraActual.getDate().toString().padStart(2, '0'); // Día de 2 dígitos
  var horas = fechaHoraActual.getHours().toString().padStart(2, '0'); // Horas de 2 dígitos
  var minutos = fechaHoraActual.getMinutes().toString().padStart(2, '0'); // Minutos de 2 dígitos
  var segundos = fechaHoraActual.getSeconds().toString().padStart(2, '0'); // Segundos de 2 dígitos

  // Formato deseado: YYYY-MM-DD HH:MM:SS
  var fechaFormateada = `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;

  // Asignamos la fecha formateada al campo oculto
  document.getElementById('last_log_user').value = fechaFormateada;

  // Obtener el nombre de usuario y la contraseña desde los campos de la página
  const username = document.getElementById('username_Log').value;
  const password = document.getElementById('password_Log').value;

  // Enviar la fecha y hora al servidor mediante fetch
  fetch('actualizar_last_log.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          username: username,
          password: password,
          last_log: fechaFormateada  // Enviamos la fecha en el formato deseado
      })
  })
  .then(response => response.json())
  .then(data => {
      console.log(data);  // Puedes manejar la respuesta aquí
  })
  .catch(error => {
      console.error('Error:', error);
  });

//}
  });
 