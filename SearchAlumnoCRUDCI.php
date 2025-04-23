<?php
// Configuración de la base de datos
// $servername = "localhost";
// $username = "root";
// $password = "123456";
// $dbname = "system_fcs_uc";
include 'ConfigConex.php';

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Obtener los datos enviados por AJAX (JSON)
$data = json_decode(file_get_contents('php://input'), true);
$cedula = $data['cedula'] ?? '';

// Si la cédula no está vacía
if (!empty($cedula)) {
    // Preparar la consulta para buscar el alumno por ID_Alumno
    $sql = "SELECT * FROM alumnos WHERE ID_Alumno = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $cedula);  // 's' para cadena, ajusta si el tipo de datos es otro
    $stmt->execute();
    $result = $stmt->get_result();

    // Si encontramos un registro
    if ($result->num_rows > 0) {
        // Obtener el primer (y único) resultado
        $row = $result->fetch_assoc();
        // Devolver el resultado como JSON
        echo json_encode($row);
    } else {
        // Si no se encuentra el alumno
        echo json_encode(null);
    }

    $stmt->close();
} else {
    // Si no se recibe cédula
    echo json_encode(null);
}

// Cerrar la conexión
$conn->close();
?>
