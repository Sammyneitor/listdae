document.addEventListener("DOMContentLoaded", function () {
    // Obtener los botones y el formulario
    const btnTempReg = document.getElementById('btnTempReg');
    const btnGuardar = document.getElementById('btnGuardar');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const formAlumno = document.getElementById('form-alumno');
  
    // Al cargar la página, asegurarse de que el botón "Guardar" esté visualmente bloqueado
    btnGuardar.classList.add('bloqueado');
    btnGuardar.disabled = true;
    btnGuardar.setAttribute('data-info', 'deshabilitado'); // Inicializamos el atributo data-info como "deshabilitado"
    btnTempReg.classList.add('rojo'); // El botón de habilitar/deshabilitar empieza con el color rojo
  
    // Función para mostrar el mensaje de advertencia al habilitar la edición
    function habilitarEdicion() {
      // Comprobar el valor del data-info del botón "Guardar"
      const estadoGuardar = btnGuardar.getAttribute('data-info');
      
      if (estadoGuardar === 'habilitado') {
        // Si ya está habilitado, no mostrar advertencia, pero deshabilitar el botón
        btnGuardar.classList.add('bloqueado');
        btnGuardar.disabled = true;
        btnGuardar.setAttribute('data-info', 'deshabilitado'); // Cambiar el estado del data-info a "deshabilitado"
  
        // Cambiar el texto y color del botón de "Habilitar Edición"
        btnTempReg.textContent = "Activar Edicion"; // Cambiar el texto
        btnTempReg.classList.remove('verde'); // Eliminar el color verde
        btnTempReg.classList.add('rojo'); // Cambiar a rojo
        return;
      }
  
      // Si no está habilitado, mostrar la advertencia
      const respuesta = confirm("ADVERTENCIA: Está a punto de habilitar la edición del registro de estudiantes. ¿Seguro que desea continuar?");
      
      if (respuesta) {
        // Si el usuario acepta, habilitar el botón "Guardar"
        btnGuardar.classList.remove('bloqueado'); // Eliminar el estilo de bloqueo visual
        btnGuardar.disabled = false; // Habilitar el botón para que pueda ser clickeado
        btnGuardar.setAttribute('data-info', 'habilitado'); // Cambiar el estado del data-info a "habilitado"
  
        // Cambiar el texto y color del botón de "Habilitar Edición"
        btnTempReg.textContent = "Desactivar Edicion"; // Cambiar el texto
        btnTempReg.classList.remove('rojo'); // Eliminar el color rojo
        btnTempReg.classList.add('verde'); // Cambiar a verde
      }
    }
  
    // Función para limpiar el formulario y deshabilitar el botón "Guardar" después de guardar
    function guardarFormulario(event) {
      event.preventDefault(); // Evitar el envío del formulario si es un submit
  
      // Limpiar el formulario
      formAlumno.reset();
      
      // Deshabilitar el botón "Guardar" nuevamente y bloquearlo visualmente
      btnGuardar.classList.add('bloqueado');
      btnGuardar.disabled = true;
      btnGuardar.setAttribute('data-info', 'deshabilitado'); // Cambiar el estado del data-info a "deshabilitado"
  
      // Cambiar el texto y color del botón de "Habilitar Edición"
      btnTempReg.textContent = "Activar Edicion"; // Cambiar el texto
      btnTempReg.classList.remove('verde'); // Eliminar el color verde
      btnTempReg.classList.add('rojo'); // Cambiar a rojo
    }
  
    // Función para limpiar el formulario y deshabilitar el botón "Guardar" al hacer clic en "Limpiar"
    function limpiarFormulario() {
      // Limpiar el formulario
      formAlumno.reset();
  
      // Deshabilitar el botón "Guardar" nuevamente y bloquearlo visualmente
      btnGuardar.classList.add('bloqueado');
      btnGuardar.disabled = true;
      btnGuardar.setAttribute('data-info', 'deshabilitado'); // Cambiar el estado del data-info a "deshabilitado"
  
      // Cambiar el texto y color del botón de "Habilitar Edición"
      btnTempReg.textContent = "Activar Edicion"; // Cambiar el texto
      btnTempReg.classList.remove('verde'); // Eliminar el color verde
      btnTempReg.classList.add('rojo'); // Cambiar a rojo
    }
  
    // Asignar eventos a los botones
    btnTempReg.addEventListener('click', habilitarEdicion);
    btnGuardar.addEventListener('click', guardarFormulario);
    btnLimpiar.addEventListener('click', limpiarFormulario);
  });
  
  

  function copiarYSimularEnter(event) {
    // Verificar si la tecla presionada es "Enter" (código de tecla 13)
    if (event.key === "Enter") {
        // Copiar el valor de EntryBusqueda al campo Cedula
        var entryValue = document.getElementById("EntryBusqueda").value;
        document.getElementById("Cedula").value = entryValue;

        // Simular el evento "Enter" en el campo Cedula
        var cedulaInput = document.getElementById("Cedula");
        var enterEvent = new KeyboardEvent('keydown', {
            key: "Enter",
            keyCode: 13,
            which: 13
        });
        cedulaInput.dispatchEvent(enterEvent);

        // Limpiar el valor de EntryBusqueda
        document.getElementById("EntryBusqueda").value = "";
    }
}
