<?php
// $servername = "localhost";
// $username = "root";
// $password = "123456";
// $dbname = "system_fcs_uc";
include 'ConfigConex.php';

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verificamos que se hayan enviado ambos parámetros
    if (isset($_GET['codMateria']) && isset($_GET['escuelaId'])) {
        $codMateria = $_GET['codMateria'];
        $escuelaId = $_GET['escuelaId'];

        // Consulta para obtener los detalles de la materia
        $sql = "SELECT * FROM pensum WHERE Cod_Materia = :codMateria AND ID_CodEscuela_Materia = :escuelaId";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':codMateria', $codMateria, PDO::PARAM_STR);
        $stmt->bindParam(':escuelaId', $escuelaId, PDO::PARAM_INT);
        $stmt->execute();

        $materia = $stmt->fetch(PDO::FETCH_ASSOC);

        // Comprobamos si la materia fue encontrada
        if ($materia) {
            // Devolvemos los datos de la materia en formato JSON
            echo json_encode($materia);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Materia no encontrada']);
        }

    } else {
        echo json_encode(['status' => 'error', 'message' => 'Faltan parámetros']);
    }

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión: ' . $e->getMessage()]);
}
?>
