<?php
// Conexión a la base de datos (ajusta los datos de conexión)
// $servername = "localhost"; 
// $username = "root";
// $password = "123456";
// $dbname = "system_fcs_uc";
include 'ConfigConex.php';

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Obtener los valores enviados desde JavaScript y sanitizarlos
$escuelaFCS = mysqli_real_escape_string($conn, $_POST['Nom_Escuela']);
$CodAsignatura = mysqli_real_escape_string($conn, $_POST['Cod_Asignatura']);
$NroSeccion = (int)$_POST['Nro_Seccion']; // Asegurarte que sea un entero

$Periodo = $_POST['Nro_Periodo']; // Por ejemplo, '2024-1'
// Separar el valor en año y número
list($anio, $numero) = explode(',', $Periodo);

$tabla = "record_estudiantes_" . $escuelaFCS;

// Usar consultas preparadas para mayor seguridad
$stmt = $conn->prepare("SELECT DISTINCT R.Fecha_Act_Lista FROM $tabla R WHERE R.CodAsignatura_Escuela = ? AND R.SeccionAsignatura_Escuela = ? AND R.AñoPeriodo_Escuela = ? AND R.NroPeriodo_Escuela = ?");
$stmt->bind_param("siii", $CodAsignatura, $NroSeccion,$anio, $numero); // 's' para string, 'i' para integer
$stmt->execute();
$result = $stmt->get_result();

// Verificar errores en la consulta
if (!$result) {
    die("Error en la consulta: " . $conn->error);
}

// Crear las opciones del selectResultado
$html = "";

if ($result->num_rows > 0) {
    $html .= "<option value=''>--Seleccione Fecha--</option>";

    while($row = $result->fetch_assoc()) {
        $html .= "<option value='" . htmlspecialchars($row["Fecha_Act_Lista"]) . "'>" . htmlspecialchars($row["Fecha_Act_Lista"]) . "</option>"; 
    }
} else {
    $html .= "<option value=''>--Seleccione Fecha--</option>";
}

echo $html;

// Cerrar statement y conexión
$stmt->close();
$conn->close();
?>