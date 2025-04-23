<?php
// $servername = "localhost";
// $username = "root";
// $password = "123456";
// $dbname = "system_fcs_uc";

include 'ConfigConex.php';

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if (isset($_GET['escuelaId'])) {
        $escuelaId = $_GET['escuelaId'];

        // Consulta para obtener las materias correspondientes a la escuela seleccionada
        $sql = "SELECT * FROM pensum WHERE ID_CodEscuela_Materia = :escuelaId";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':escuelaId', $escuelaId, PDO::PARAM_INT);
        $stmt->execute();

        $materias = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Convertimos los resultados a formato JSON y los devolvemos
        echo json_encode($materias);
    }

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión: ' . $e->getMessage()]);
}
?>
