<?php
// $servername = "localhost";
// $username = "root";
// $password = "123456";
// $dbname = "system_fcs_uc";
include 'ConfigConex.php';

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if (isset($_GET['pais_id'])) {
    $pais_id = $_GET['pais_id'];
    $sql = "SELECT id, estadonombre FROM estado WHERE ubicacionpaisid = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $pais_id); // Valiar el parámetro como un entero
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Mostrar los estados en el formato adecuado para el datalist
        while ($row = $result->fetch_assoc()) {
            echo '<option value="' . $row['estadonombre'] . '" data-info="' . $row['id'] . '">';
        }
    } else {
        echo '<option value="">No hay estados disponibles</option>';
    }

    $stmt->close();
} else {
    echo '<option value="">Selecciona un país primero</option>';
}

$conn->close();
?>
