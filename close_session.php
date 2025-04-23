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

// Obtener el nombre de usuario enviado por POST
$username = $_POST['username'] ?? '';

if (empty($username)) {
    echo json_encode(['status' => 'error', 'message' => 'Nombre de usuario no proporcionado.']);
    exit();
}

// Actualizar el estatus a 0 (cerrar la sesión)
$updateQuery = "UPDATE sis_logfcs SET Estatus = 0 WHERE User_Name = :username";
$updateStmt = $pdo->prepare($updateQuery);
$updateStmt->bindParam(':username', $username);
$updateStmt->execute();

echo json_encode(['status' => 'success', 'message' => 'Sesión anterior cerrada correctamente.']);
?>
