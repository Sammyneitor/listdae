<?php
// Configuración de la base de datos
// $host = "localhost";
// $usernameDB = "root";
// $passwordDB = "123456";
// $dbname = "system_fcs_uc";

include 'ConfigConex.php';

// Crear conexión
$conn = new mysqli($host, $usernameDB, $passwordDB, $dbname);

// Comprobar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener los datos enviados por POST
$data = json_decode(file_get_contents('php://input'), true);

$username = $data['username'];
$password = $data['password'];
$lastLog = $data['last_log'];

// Preparar y ejecutar la consulta para actualizar el campo 'Last_Log'
$sql = "UPDATE sis_logfcs SET Last_Log = ? WHERE User_Name = ? AND Password_User = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $lastLog, $username, $password);

if ($stmt->execute()) {
    // Responder con un mensaje de éxito
    echo json_encode(["success" => true, "message" => "Fecha y hora actualizadas correctamente."]);
} else {
    // Responder con un mensaje de error
    echo json_encode(["success" => false, "message" => "Error al actualizar la base de datos."]);
}

$stmt->close();
$conn->close();
?>
