
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
    $opcion = $_GET['opcion'];
    $escuelaFCS = $_GET['escuelaFCS'];
    $tabla = "record_estudiantes_" . $escuelaFCS;

    // Consulta según la opción seleccionada
    $query = "SELECT DISTINCT SeccionAsignatura_Escuela FROM $tabla WHERE CodAsignatura_Escuela = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $opcion);
    $stmt->execute();
    $resultado = $stmt->get_result();

    // Generar las opciones para el segundo select
    $options = "";
    $options .= "<option value=''>--Seleccione Seccion--</option>";

    while ($fila = $resultado->fetch_assoc()) {
        $options .= "<option value='" . $fila['SeccionAsignatura_Escuela'] . "'>" . $fila['SeccionAsignatura_Escuela'] . "</option>";
    }

    echo $options;

    $stmt->close();
    $conn->close();
?>