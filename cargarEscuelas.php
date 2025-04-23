<?php
// $servername = "localhost";
// $username = "root";
// $password = "123456";
// $dbname = "system_fcs_uc";
include 'ConfigConex.php';

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta para obtener todas las escuelas
    $sql = "SELECT DISTINCT ID_CodEscuela_Materia FROM pensum";
    $stmt = $pdo->query($sql);
    $escuelas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convertimos los resultados a formato JSON y los devolvemos
    echo json_encode($escuelas);

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión: ' . $e->getMessage()]);
}
?>
