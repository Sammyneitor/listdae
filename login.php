<?php
// Iniciar sesión para manejar la sesión del usuario
session_start();

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

// Obtener los datos enviados por POST
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

// Verificar si los campos están vacíos
if (empty($username) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Por favor, complete todos los campos.']);
    exit();
}

// Preparar la consulta para verificar el usuario
$query = "SELECT * FROM sis_logfcs WHERE User_Name = :username LIMIT 1";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':username', $username);
$stmt->execute();

// Verificar si el usuario existe
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Si el usuario no existe
if (!$user) {
    echo json_encode(['status' => 'error', 'message' => 'Usuario no encontrado.']);
    exit();
}

// Verificar si la contraseña es correcta
if ($password === $user['Password_User']) {
    // Si la contraseña es correcta, revisamos si hay una sesión activa
    if ($user['Estatus'] == 1) {
        // Si el estatus es 1, significa que ya hay una sesión activa
        echo json_encode([
            'status' => 'session_active',
            'message' => 'Ya tienes una sesión abierta. ¿Deseas cerrarla y continuar?',
            'username' => $username
        ]);
        exit();
    }

    // Obtener la IP real del cliente
    $ip = $_SERVER['REMOTE_ADDR']; // IP remota
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        // Si el encabezado 'X-Forwarded-For' contiene múltiples IPs, tomamos la primera
        $ip = trim($ips[0]);
    }

    // Obtener la fecha y hora actual
    $newLastLog = date('Y-m-d H:i:s'); // Fecha y hora actual

    // **Enviar la respuesta primero con la fecha de Last_Log**
    echo json_encode([
        'status' => 'success',
        'message'  => 'Inicio de sesión exitoso',
        'password' => $user['Password_User'],
        'username' => $user['User_Name'],
        'email' => $user['E_mail'],
        'firstName' => $user['First_Name'],
        'secondName' => $user['Second_Name'],
        'role' => $user['Rol_User'],
        'lastLog' => $user['Last_Log'], // Enviar la fecha de logueo actualizada
        'lastIP' => $ip,  // Enviar la IP del dispositivo
        'estatus' => $user['Estatus'],
        'telephone' => $user['Telephon_Number'],
        'GenUser' => $user['Genero_User']

    ]);

    // Ahora, proceder con la actualización de los datos en la base de datos
    $updateQuery = "UPDATE sis_logfcs SET Last_Log = :lastLog, Estatus = 1, Last_IP = :lastIP WHERE User_Name = :username";
    $updateStmt = $pdo->prepare($updateQuery);
    $updateStmt->bindParam(':lastLog', $newLastLog);
    $updateStmt->bindParam(':lastIP', $ip);
    $updateStmt->bindParam(':username', $username);
    $updateStmt->execute();

} else {
    // Si la contraseña es incorrecta
    echo json_encode(['status' => 'error', 'message' => 'Contraseña incorrecta.']);
}
?>
