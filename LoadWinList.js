window.onload = function() {
    const tabla = document.getElementById('TablaListAlumnos');
   // alert("aja");
    // Eliminar todos los elementos de la lista
    while (tabla.rows.length > 0) {
        tabla.deleteRow(0);
    }

    for (let i = 0; i < 10; i++) { // Cambia el número según cuántas filas vacías quieras
        const nuevaFila = tabla.insertRow();
        for (let j = 0; j < 4; j++) { // Suponiendo que hay 3 columnas
            const nuevaCelda = nuevaFila.insertCell(j);
            nuevaCelda.textContent = ''; // Dejar la celda vacía
        }
    }
};