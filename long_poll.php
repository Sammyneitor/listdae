<?php
// Conexión a la base de datos
// $host = "localhost"; 
// $usernameDB = "root";
// $passwordDB = "123456";
// $dbname = "system_fcs_uc";
include 'ConfigConex.php';

try {
    // Crear conexión
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $usernameDB, $passwordDB);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error en la conexión a la base de datos']);
    exit();
}

// Recuperar los datos enviados por POST
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';
$currentLastLog = $data['last_log'] ?? '';

// Verificar que se recibió el valor de Last_Log
if (empty($username) || empty($password) || empty($currentLastLog)) {
    echo json_encode(['status' => 'error', 'message' => 'Faltan los datos necesarios']);
    exit();
}

// Preparar la consulta para obtener el valor actual de Last_Log basado en el username y password
$query = "SELECT Last_Log FROM sis_logfcs WHERE User_Name = :username AND Password_User = :password LIMIT 1";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':username', $username);
$stmt->bindParam(':password', $password);
$stmt->execute();

// Obtener el registro del usuario
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['status' => 'error', 'message' => 'Usuario no encontrado o contraseña incorrecta']);
    exit();
}

// Verificar si el valor de Last_Log ha cambiado
$newLastLog = $user['Last_Log'];

if ($currentLastLog !== $newLastLog) {
    // Si hay un cambio en Last_Log, devolver el nuevo valor
    echo json_encode(['changed' => true, 'new_last_log' => $newLastLog]);
} else {
    // Si no hay cambios, indicar que no ha cambiado
    echo json_encode(['changed' => false]);
}
?>
