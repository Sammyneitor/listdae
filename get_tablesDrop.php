<?php
header('Content-Type: application/json');

// $host = "localhost"; // Cambia esto según tu configuración
// $user = "root";
// $password = "123456";
// $dbname = "system_fcs_uc";
include 'ConfigConex.php';

$prefix = 'record_'; // El prefijo con el que deben comenzar las tablasd

try {
    // Conexión a la base de datos
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Consulta SQL para obtener tablas que comienzan con el prefijo específicof
    $stmt = $pdo->prepare("SHOW TABLES LIKE :prefix");
    $stmt->bindValue(':prefix', $prefix . '%');
    $stmt->execute();
    
    // Obtener los resultados
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo json_encode(['tables' => $tables]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error al obtener tablas: ' . $e->getMessage()]);
}
?>