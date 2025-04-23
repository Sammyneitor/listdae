<?php
// $servername = "localhost"; 
// $username = "root";
// $password = "123456";
// $dbname = "system_fcs_uc";
include 'ConfigConex.php';

// Crear la conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar si la conexión fue exitosa
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Obtener los datos enviados desde el cliente
$data = json_decode(file_get_contents("php://input"));

$codMateria = $data->Cod_Materia;
$nombreMateria = $data->Nombre_Materia;
$nivelMateria = $data->Nivel_Materia;
$ucMateria = $data->UC_Materia;
$nroMateria = $data->Nro_Materia;
$prelacionUno = $data->PrelacionUno_Materia;
$prelacionDos = $data->PrelacionDos_Materia;
$prelacionTres = $data->PrelacionTres_Materia;
$idEscuelaMateria = $data->ID_CodEscuela_Materia;

// Verificar si ya existe una materia con el mismo codMateria y idEscuelaMateria
$sqlCheck = "SELECT COUNT(*) FROM pensum WHERE Cod_Materia = ? AND ID_CodEscuela_Materia = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("ss", $codMateria, $idEscuelaMateria);
$stmtCheck->execute();
$stmtCheck->bind_result($count);
$stmtCheck->fetch();
$stmtCheck->close();

if ($count > 0) {
    // Si ya existe un registro, devolver un mensaje de error
    echo json_encode(['status' => 'error', 'message' => 'Ya existe una materia con el mismo Código de Materia y ID de Escuela.']);
} else {
    // Si no existe, insertar el nuevo registro
    $sql = "INSERT INTO pensum (Cod_Materia, Nombre_Materia, Nivel_Materia, UC_Materia, Nro_Materia, PrelacionUno_Materia, PrelacionDos_Materia, PrelacionTres_Materia, ID_CodEscuela_Materia)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssss", $codMateria, $nombreMateria, $nivelMateria, $ucMateria, $nroMateria, $prelacionUno, $prelacionDos, $prelacionTres, $idEscuelaMateria);

    if ($stmt->execute()) {
        // Si la inserción es exitosa
        echo json_encode(['status' => 'success', 'message' => 'Materia registrada con éxito.']);
    } else {
        // Si hay un error en la inserción
        echo json_encode(['status' => 'error', 'message' => 'Error al registrar la materia.']);
    }

    $stmt->close();
}

// Cerrar la conexión a la base de datos
$conn->close();
?>
