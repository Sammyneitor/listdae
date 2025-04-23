<?php
// Configuración de la base de datos
// $host = "localhost";
// $usernameDB = "root";
// $passwordDB = "123456";
// $dbname = "system_fcs_uc";
include 'ConfigConex.php';

// Establecer la conexión
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $usernameDB, $passwordDB);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Error de conexión: ' . $e->getMessage();
    exit;
}

// Obtener los datos recibidos en formato JSON
$data = json_decode(file_get_contents('php://input'), true);

// Validación y preparación para insertar
if ($data) {
    // Verificamos que los campos obligatorios no estén vacíos
    if (empty($data['userName']) || empty($data['passwordUser']) || empty($data['email']) || empty($data['firstName']) || empty($data['firstLastName']) || empty($data['roleUser']) || empty($data['genero'])) {
        echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios.']);
        exit;
    }

    // Recuperamos los datos del formulario
    $userName = $data['userName'];
    $passwordUser = $data['passwordUser']; // No se cifra la contraseña en este ejemplo
    $email = $data['email'];
    $firstName = $data['firstName'];
    $secondName = $data['secondName'] ?? ''; // Usamos el operador de fusión de null para evitar un valor no definido
    $firstLastName = $data['firstLastName'];
    $secondLastName = $data['secondLastName'] ?? ''; // Lo mismo para segundo apellido
    $roleUser = $data['roleUser'];
    $telephoneNumber = $data['telephoneNumber'] ?? ''; // Número telefónico es opcional
    $userBio = $data['userBio'] ?? ''; // Información adicional es opcional
    $genero = $data['genero'] ?? 'M'; // Asignamos 'M' por defecto si no se pasó el valor

    // Verificar si el nombre de usuario ya existe
    $sql_check = "SELECT COUNT(*) FROM sis_logfcs WHERE User_Name = ?";
    $stmt_check = $pdo->prepare($sql_check);
    $stmt_check->execute([$userName]);
    $userExists = $stmt_check->fetchColumn();

    if ($userExists > 0) {
        echo json_encode(['success' => false, 'message' => 'Usuario ya registrado, intente con otro nombre de usuario.']);
        exit;
    }

    // Preparar la consulta SQL para insertar en la base de datos
    $sql = "INSERT INTO sis_logfcs (User_Name, Password_User, E_mail, First_Name, First_NameV2, Second_Name, Second_NameV2, Estatus, Rol_User, Telephon_Number, Info_UserBio, Genero_User) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $pdo->prepare($sql);
    
    // Ejecutar la consulta con los valores recibidos
    $stmt->execute([
        $userName,
        $passwordUser,
        $email,
        $firstName,
        $secondName,  // Segundo Nombre
        $firstLastName,
        $secondLastName,  // Segundo Apellido
        0,  // Estatus: 1 (activo)
        $roleUser,
        $telephoneNumber,
        $userBio,
        $genero
    ]);

    // Respuesta JSON
    echo json_encode(['success' => true, 'message' => 'Usuario registrado exitosamente.']);
} else {
    echo json_encode(['success' => false, 'message' => 'No se recibieron datos válidos.']);
}
?>
