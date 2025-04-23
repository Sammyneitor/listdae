<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $materia = $_POST['opcionesMateriaFormList'];
    $seccion = $_POST['opcionesSeccionFormList'];
    $CodAsigSrc = $_POST['periodoFormList'];
    $opciones = $_POST['CBStatus'];
    if (isset($_POST['EscuelaID'])) {
        $escuelaFCS = $_POST['EscuelaID'];
    } else {
        echo "El parámetro EscuelaID no fue enviado.";
    }
    
    // Definir la tabla según el parámetro EscuelaID
    $tabla = "record_estudiantes_" . $escuelaFCS;
    $listaValoresEstatus = implode(',', $opciones);

    // Conexión a la base de datos
    // $servername = "localhost"; // Cambia esto según tu configuración
    // $username = "root";
    // $password = "123456";
    // $dbname = "system_fcs_uc";
    include 'ConfigConex.php';

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Convertir explícitamente $seccion a string (esto asegura que sea tratado como un valor VARCHAR)
    $seccion = (string)$seccion; // Convertir a string para evitar problemas con el tipo de dato

    // Consulta SQL
    $query = "SELECT DISTINCT P.FirstName_Alumno, P.SecondName_Alumno, R.ID_Alumno, R.Condicion_Alumno_Escuela, R.Fecha_Act_Lista, R.Name_Analista
              FROM $tabla R 
              JOIN alumnos P ON R.ID_Alumno = P.ID_Alumno 
              WHERE R.CodAsignatura_Escuela = '$materia' 
              AND P.CodActivo_Alumno IN ($listaValoresEstatus) 
              AND R.SeccionAsignatura_Escuela = '$seccion'  /* Sección tratada como string */
              AND R.AñoPeriodo_Escuela IN ($CodAsigSrc) 
              AND R.NroPeriodo_Escuela IN ($CodAsigSrc)";

    // Ejecutar la consulta
    $result = $conn->query($query);

    // Mostrar los resultados en una tabla HTML
    echo "<table id='table'>";        
    echo "<thead>";
    echo "<tr>";
    echo "<th onclick='alert(\"Hizo clic columna 1\")'>Nro.</th>";
    echo "<th onclick='alert(\"Hizo clic columna 2\")'>Cédula</th>";
    echo "<th ondblclick='alert(\"Hizo clic columna 3\")'>&nbsp Apellido y Nombre</th>";
    echo "<th ondblclick='alert(\"Hizo clic columna 4\")'>Condición</th>";
    echo "<th ondblclick='alert(\"Hizo clic columna 5\")' style='display:none;'>Fecha de última Actualización</th>";
    echo "<th ondblclick='alert(\"Hizo clic columna 5\")' style='display: none;'>Analista Encargado</th>";
    echo "</tr>";
    echo "</thead>";

    echo "<tbody id='TablaListAlumnos'>";
    $contador_consul = 0;
    while ($row = $result->fetch_assoc()) {
        $contador_consul++;
        echo "<tr>";
        echo "<td>" . $contador_consul . "</td>";
        echo "<td>" . $row['ID_Alumno'] . "</td>";
        echo "<td>" . $row['SecondName_Alumno'] . ' ' . $row['FirstName_Alumno'] . "</td>";
        echo "<td>" . $row['Condicion_Alumno_Escuela'] . "</td>";
        echo "<td style='display: none;'>" . $row['Fecha_Act_Lista'] . "</td>";
        echo "<td style='display: none;'>" . $row['Name_Analista'] . "</td>";
        echo "</tr>";
    }
    echo "</tbody>";
    echo "</table>";

    // Cerrar la conexión
    $conn->close();
}
?>
