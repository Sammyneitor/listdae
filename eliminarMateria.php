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

// Obtener los datos enviados desde el cliente (JSON)
$data = json_decode(file_get_contents("php://input"));

$codMateria = $data->Cod_Materia;
$idEscuelaMateria = $data->ID_CodEscuela_Materia;

// Verificar si el registro con el mismo Cod_Materia y ID_CodEscuela_Materia existe en la base de datos
$sqlCheck = "SELECT COUNT(*) FROM pensum WHERE Cod_Materia = ? AND ID_CodEscuela_Materia = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("si", $codMateria, $idEscuelaMateria);  // Parámetros preparados
$stmtCheck->execute();
$stmtCheck->bind_result($count);  // Almacenamos el resultado
$stmtCheck->fetch();
$stmtCheck->close();

// Si el registro no existe, devolver un mensaje de error
if ($count == 0) {
    echo json_encode(['status' => 'error', 'message' => 'No se encontró una materia con el Código de Materia y el ID de Escuela proporcionados.']);
} else {
    // Si el registro existe, proceder con la eliminación
    $sqlDelete = "DELETE FROM pensum WHERE Cod_Materia = ? AND ID_CodEscuela_Materia = ?";
    $stmtDelete = $conn->prepare($sqlDelete);
    $stmtDelete->bind_param("ss", $codMateria, $idEscuelaMateria);  // Parámetros preparados

    if ($stmtDelete->execute()) {
        // Si la eliminación es exitosa
        echo json_encode(['status' => 'success', 'message' => 'Materia eliminada con éxito.']);
    } else {
        // Si ocurre un error durante la eliminación
        echo json_encode(['status' => 'error', 'message' => 'Error al eliminar la materia.']);
    }

    $stmtDelete->close();
}

// Cerrar la conexión a la base de datos
$conn->close();
?>
