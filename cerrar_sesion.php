<?php
// Iniciar sesión
//session_start();

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
    // Si no se puede conectar a la base de datos
    echo json_encode(['status' => 'error', 'message' => 'Error en la conexión a la base de datos']);
    exit();
}

// Obtener los datos enviados por POST (username y password)
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

// Verificar que los valores no estén vacíos
if (empty($username) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Usuario o contraseña vacíos']);
    exit();
}

// Preparar la consulta para verificar el usuario
$query = "SELECT * FROM sis_logfcs WHERE User_Name = :username LIMIT 1";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':username', $username);
$stmt->execute();

// Verificar si el usuario existe
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    // Comprobar si la contraseña proporcionada coincide con la almacenada en la base de datos (comparación directa)
    if ($password === $user['Password_User']) {
        // Actualizar el estatus a 0 (inactivo)
        $updateQuery = "UPDATE sis_logfcs SET Estatus = 0 WHERE User_Name = :username";
        $updateStmt = $pdo->prepare($updateQuery);
        $updateStmt->bindParam(':username', $username);
        
        if ($updateStmt->execute()) {
            // Responder con éxito
            echo json_encode(['status' => 'success', 'message' => 'Sesión cerrada correctamente.']);
        } else {
            // Error al actualizar
            echo json_encode(['status' => 'error', 'message' => 'Error al cerrar la sesión']);
        }
    } else {
        // Si la contraseña no coincide
        echo json_encode(['status' => 'error', 'message' => 'Contraseña incorrecta']);
    }
} else {
    // Si el usuario no se encuentra
    echo json_encode(['status' => 'error', 'message' => 'Usuario no encontrado']);
}
?>
