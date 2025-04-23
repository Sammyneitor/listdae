<?php
// $servername = "localhost";
// $username = "root";
// $password = "123456";
// $dbname = "system_fcs_uc";
include 'ConfigConex.php';

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$sql = "SELECT id, paisnombre FROM pais";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Mostrar los países en el formato adecuado para el datalist
    while($row = $result->fetch_assoc()) {
        echo '<option value="' . $row['paisnombre'] . '" data-info="' . $row['id'] . '">';
    }
} else {
    echo "0 resultados";
}

$conn->close();
?>
