function filtrarTabla(selectElement) {
    const filtro = selectElement.value; // Ahora usamos this (selectElement)
    const filas = document.querySelectorAll('#table tbody tr');
    //alert (filtro)
    filas.forEach(fila => {
        const dateMod = fila.cells[4].textContent;
       // alert (dateMod)

       
    if (dateMod === filtro) {
        fila.style.display = ''; // Mostrar fila
    } else {
        fila.style.display = 'none'; // Ocultar fila
    }
    });
}