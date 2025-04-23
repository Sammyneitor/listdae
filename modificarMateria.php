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

// Verificar si el registro con el mismo Cod_Materia y ID_CodEscuela_Materia existe en la base de datos
$sqlCheck = "SELECT COUNT(*) FROM pensum WHERE Cod_Materia = ? AND ID_CodEscuela_Materia = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("si", $codMateria, $idEscuelaMateria);
$stmtCheck->execute();
$stmtCheck->bind_result($count);
$stmtCheck->fetch();
$stmtCheck->close();

// Si el registro no existe, devolver un mensaje de error
if ($count == 0) {
    echo json_encode(['status' => 'error', 'message' => 'No se encontró una materia con el Código de Materia y el ID de Escuela proporcionados.']);
} else {
    // Si el registro existe, proceder con la actualización
    $sqlUpdate = "UPDATE pensum 
                  SET Nombre_Materia = ?, Nivel_Materia = ?, UC_Materia = ?, Nro_Materia = ?, PrelacionUno_Materia = ?, PrelacionDos_Materia = ?, PrelacionTres_Materia = ?
                  WHERE Cod_Materia = ? AND ID_CodEscuela_Materia = ?";

    $stmtUpdate = $conn->prepare($sqlUpdate);
    $stmtUpdate->bind_param("sssssssss", $nombreMateria, $nivelMateria, $ucMateria, $nroMateria, $prelacionUno, $prelacionDos, $prelacionTres, $codMateria, $idEscuelaMateria);

    if ($stmtUpdate->execute()) {
        // Si la actualización es exitosa
        echo json_encode(['status' => 'success', 'message' => 'Materia actualizada con éxito.']);
    } else {
        // Si ocurre un error durante la actualización
        echo json_encode(['status' => 'error', 'message' => 'Error al actualizar la materia.']);
    }

    $stmtUpdate->close();
}

// Cerrar la conexión a la base de datos
$conn->close();
?>
