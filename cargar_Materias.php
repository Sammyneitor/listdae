<?php

// $servername = "localhost"; // Cambia esto según tu configuración
// $username = "root";
// $password = "123456";
// $dbname = "system_fcs_uc";

include 'ConfigConex.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener la opción seleccionada
$carrera = $conn->real_escape_string($_GET['Escuela']);
$escuelaInfo = $conn->real_escape_string($_GET['EscuelaInfo']); // Obtener el valor de 'EscuelaInfo'
$tabla = "record_estudiantes_" . $carrera; // Esto formará el nombre de la tabla

// Consulta según la opción seleccionada y el valor de EscuelaInfo
$sql = "SELECT DISTINCT CodAsignatura_Escuela, Nombre_Materia 
    FROM $tabla 
    JOIN pensum ON pensum.Cod_materia = $tabla.CodAsignatura_Escuela AND pensum.ID_CodEscuela_Materia = ?";
$stmt = $conn->prepare($sql);

// Vincular el parámetro EscuelaInfo a la consulta
$stmt->bind_param("s", $escuelaInfo); // 's' indica que es una cadena

$stmt->execute();
$resultado = $stmt->get_result();

// Generar las opciones para el segundo select
$options = "";
$options .= "<option value=''>--Seleccione Materia--</option>";
while ($fila = $resultado->fetch_assoc()) {
    $options .= "<option value='" . htmlspecialchars($fila['CodAsignatura_Escuela']) . "'>" . htmlspecialchars($fila['Nombre_Materia']) . "</option>";
}

echo "<input  type='text' placeholder='Codigo Asignatura' id='CodAsigSrc' name='CodAsigSrc' readonly >";
echo $options;

$stmt->close();
$conn->close();
?>
