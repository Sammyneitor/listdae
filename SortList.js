function ordenarTabla(columna) {
    const tabla = document.getElementById("table");
    const tbody = tabla.tBodies[0];
    let filas = Array.from(tbody.rows);
    
    filas.sort((a, b) => {
        const celdaA = a.cells[columna].innerText;
        const celdaB = b.cells[columna].innerText;

        if (!isNaN(celdaA) && !isNaN(celdaB)) {
            return Number(celdaA) - Number(celdaB); // Ordenar numéricamente
        }
        
        return celdaA.localeCompare(celdaB); // Ordenar alfabéticamente
    });

    // Eliminar todas las filas del tbody
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // Reinsertar las filas ordenadas
    filas.forEach(fila => tbody.appendChild(fila));
}