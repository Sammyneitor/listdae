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
$valor = $data['valor'] ?? '';  // Valor del campo
$campo = $data['campo'] ?? '';  // Campo dinámico (data-info)

// Si el valor y el campo no están vacíos
if (!empty($valor) && !empty($campo)) {
    // Preparar la consulta para buscar en el campo dinámico
    $sql = "SELECT * FROM alumnos WHERE $campo LIKE ?";
    $stmt = $conn->prepare($sql);

    // Aplicar el comodín % antes y después del valor para búsqueda parcial
    $searchTerm = "%" . $valor . "%";  // Agregar el comodín para búsqueda parcial

    // Enlazar el parámetro a la consulta
    $stmt->bind_param("s", $searchTerm);  // 's' para indicar que el parámetro es una cadena

    // Ejecutar la consulta
    $stmt->execute();
    $result = $stmt->get_result();

    // Si encontramos registros
    if ($result->num_rows > 0) {
        $alumnos = [];
        while ($row = $result->fetch_assoc()) {
            // Agregar cada alumno al array de resultados
            $alumnos[] = $row;
        }
        // Devolver los resultados como JSON (un array con los registros seleccionados)
        echo json_encode($alumnos);
    } else {
        // Si no se encuentran registros
        echo json_encode([]);
    }

    // Cerrar la declaración
    $stmt->close();
} else {
    // Si no se recibe valor o campo, devolver un array vacío
    echo json_encode([]);
}

// Cerrar la conexión a la base de datos
$conn->close();
?>
