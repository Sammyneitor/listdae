<?php

// $servername = "localhost"; // Cambia esto según tu configuración
// $username = "root";
// $password = "123456";
// $dbname = "system_fcs_uc";
include 'ConfigConex.php';

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if (isset($_GET['escuela'])) {
    // Obtener la escuela seleccionada desde el parámetro GET
    $escuela = $_GET['escuela'];

    // Construir la consulta SQL dinámica
    $sql = "SELECT DISTINCT AñoPeriodo_Escuela, NroPeriodo_Escuela FROM Record_estudiantes_" . $escuela;
    $result = $conn->query($sql);

    $periodos = [];

    // Si hay resultados, agregarlos al array
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $periodos[] = [
                'AñoPeriodo_Escuela' => $row['AñoPeriodo_Escuela'],
                'NroPeriodo_Escuela' => $row['NroPeriodo_Escuela'],
            ];
        }
        // Devolver los resultados como JSON
        echo json_encode($periodos);
    } else {
        echo json_encode([]); // Si no hay resultados, devolver un array vacío
    }

    // Cerrar la conexión
    $conn->close();
} else {
    echo json_encode([]); // Si no se pasa el parámetro 'escuela', devolver un array vacío
}
?>