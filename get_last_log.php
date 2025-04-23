<?php
// Recuperar los datos JSON enviados por el cliente
$inputData = json_decode(file_get_contents("php://input"), true);

// Verificamos que 'password_user' y 'username' estén presentes
if (isset($inputData['password_user']) && isset($inputData['username'])) {
    $password_user = $inputData['password_user']; // Recuperamos el valor de password_user
    $username = $inputData['username']; // Recuperamos el valor de username

    // Configuración de la base de datos
    // $servername = "localhost";
    // $username_db = "root";
    // $password_db = "123456";
    // $dbname = "system_fcs_uc";
    include 'ConfigConex.php';

    // Crear la conexión
    $conn = new mysqli($servername, $username_db, $password_db, $dbname);

    // Verificar si hubo algún error de conexión
    if ($conn->connect_error) {
        die(json_encode(['error' => 'Conexión fallida: ' . $conn->connect_error]));
    }

    // Consulta para obtener Last_Log de la base de datos
    $stmt = $conn->prepare("SELECT Last_Log FROM sis_logfcs WHERE Password_User = ? AND User_Name = ?");
    $stmt->bind_param('ss', $password_user, $username);
    $stmt->execute();
    $result = $stmt->get_result();

    // Verificar si existe el registro
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $lastLog = $row['Last_Log'];
        
        // Enviar el valor de Last_Log de vuelta al cliente
        echo json_encode(['last_log' => $lastLog]);
    } else {
        echo json_encode(['error' => 'No se encontró el registro']);
    }

    // Cerrar la conexión
    $stmt->close();
    $conn->close();
} else {
    // Si no se enviaron password_user o username, devolver error
    echo json_encode(['error' => 'Faltan los parámetros password_user o username']);
}
?>
