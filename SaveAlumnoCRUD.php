<?php
// Datos de conexión a la base de datos
// $servername = "localhost";
// $username = "root";
// $password = "123456";
// $dbname = "system_fcs_uc";
include 'ConfigConex.php';

// Conectar a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener los datos del formulario (en formato JSON)
$data = json_decode(file_get_contents("php://input"), true);

// Validar si los datos existen
if (!$data) {
    echo json_encode(["success" => false, "message" => "Datos no válidos"]);
    exit;
}

// Recuperar los valores del array recibido
$primerNombre = !empty($data['primerNombre']) ? $data['primerNombre'] : "S/E";
$segundoNombre = !empty($data['segundoNombre']) ? $data['segundoNombre'] : "S/E";
$primerApellido = !empty($data['primerApellido']) ? $data['primerApellido'] : "S/E";
$segundoApellido = !empty($data['segundoApellido']) ? $data['segundoApellido'] : "S/E";
$cedula = $data['cedula'];
$nacionalidad = !empty($data['nacionalidad']) ? $data['nacionalidad'] : "S/E";
$escuelaAsignada = !empty($data['escuelaAsignada']) ? $data['escuelaAsignada'] : "S/E";
$modoIngreso = !empty($data['modoIngreso']) ? $data['modoIngreso'] : "S/E";
$genero = !empty($data['genero']) ? $data['genero'] : "S/E";
$estadoCivil = !empty($data['estadoCivil']) ? $data['estadoCivil'] : "S/E";
$fechaNacimiento = !empty($data['fechaNacimiento']) ? $data['fechaNacimiento'] : "S/E";
$paisOrigen = !empty($data['paisOrigen']) ? $data['paisOrigen'] : "S/E";
$estadoActual = !empty($data['estadoActual']) ? $data['estadoActual'] : "S/E";
$direccion = !empty($data['direccion']) ? $data['direccion'] : "S/E";
$telLocal = !empty($data['telLocal']) ? $data['telLocal'] : "S/E";
$telCelular = !empty($data['telCelular']) ? $data['telCelular'] : "S/E";
$email = !empty($data['email']) ? $data['email'] : "S/E";
$observaciones = !empty($data['observaciones']) ? $data['observaciones'] : "S/E";
$estatusAlumno = !empty($data['estatusAlumno']) ? $data['estatusAlumno'] : "S/E";
$tipoAlumno = !empty($data['tipoAlumno']) ? $data['tipoAlumno'] : "S/E";
$anoIngreso = !empty($data['anoIngreso']) ? $data['anoIngreso'] : "S/E";
$periodoIngreso = !empty($data['periodoIngreso']) ? $data['periodoIngreso'] : "S/E";

// Validaciones para campos obligatorios
if (empty($primerNombre) || empty($primerApellido) || empty($cedula) || empty($escuelaAsignada) || empty($estatusAlumno) || empty($tipoAlumno) || empty($nacionalidad)) {
    echo json_encode(["success" => false, "message" => "Los siguientes campos son obligatorios: primer nombre, primer apellido, cédula, escuela asignada, estatus alumno, tipo alumno y nacionalidad."]);
    exit;
}

// Valor por defecto para "Revisado"
$revisado = 0;

// Verificar si ya existe un registro con la cédula como ID_Alumno
$checkQuery = "SELECT * FROM alumnos WHERE ID_Alumno = ? AND CodCarrera_Alumno = ?" ;
$checkStmt = $conn->prepare($checkQuery);
$checkStmt->bind_param("ss", $cedula,$escuelaAsignada);
$checkStmt->execute();
$result = $checkStmt->get_result();


//EL P{ROBLEMA ESTA EN ACTUALIZAR LOS DATOS< PORQUE AL REGIUSTRARLA TODO ESTA BIEN} (PERO YA LO SOLUCIONE) IGUAL REVISAR TEMPRANO 
//AHORA FALTA CHECAR EL DE LA CARGA DEL EXCEL Y AUNQUE YA LO HICE Y TAMBIEN CARGA DOS CEDULAS CON CARRERAS DIFERENTES, ANOCHES, HACER MAS PRUEBITAS.

if ($result->num_rows > 0) {
    // Si ya existe, actualizar los datos
    $updateQuery = "UPDATE alumnos SET 
        FirstName_Alumno = ?, FirstName_AlumnoV2 = ?, SecondName_Alumno = ?, SecondName_AlumnoV2 = ?,
        Nacionalidad_Alumno = ?, Nombre_Nacionalidad = ?, Estatus_Alumno = ?, CodActivo_Alumno = ?,
        CodCarrera_Alumno = ?, AñoIngreso_Alumno = ?, PeriodoIngreso_Alumno = ?, Modalidad_Ingreso = ?,
        Genero_Alumno = ?, Edo_CivilAlumno = ?, DOB_Alumno = ?, Edo_Residencia_Alumno = ?, Direccion_Alumno = ?,
        Telf_Local_Alumno = ?, Tel_Movil_Alumno = ?, Email_Alumno = ?, Observacion_Alumno = ?, Revisado = ? 
        WHERE ID_Alumno = ? AND CodCarrera_Alumno = ?";
    
    $updateStmt = $conn->prepare($updateQuery);
    $updateStmt->bind_param("ssssssssssssssssssssssss", 
        $primerNombre, $segundoNombre, $primerApellido, $segundoApellido, 
        $nacionalidad, $paisOrigen, $estatusAlumno, $tipoAlumno, 
        $escuelaAsignada, $anoIngreso, $periodoIngreso, $modoIngreso, 
        $genero, $estadoCivil, $fechaNacimiento, $estadoActual, $direccion, 
        $telLocal, $telCelular, $email, $observaciones, $revisado, $cedula,$escuelaAsignada);
    
    if ($updateStmt->execute()) {
        echo json_encode(["success" => true, "message" => "Alumno actualizado con éxito"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar el alumno: " . $updateStmt->error]);
    }
    
    $updateStmt->close();
} else {
    // Si no existe, insertar los datos nuevos
    $insertQuery = "INSERT INTO alumnos (ID_Alumno, 
        FirstName_Alumno, FirstName_AlumnoV2, SecondName_Alumno, SecondName_AlumnoV2,
        Nacionalidad_Alumno, Nombre_Nacionalidad, Estatus_Alumno, CodActivo_Alumno,
        CodCarrera_Alumno, AñoIngreso_Alumno, PeriodoIngreso_Alumno, Modalidad_Ingreso,
        Genero_Alumno, Edo_CivilAlumno, DOB_Alumno, Edo_Residencia_Alumno, Direccion_Alumno,
        Telf_Local_Alumno, Tel_Movil_Alumno, Email_Alumno, Observacion_Alumno, Revisado) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->bind_param("sssssssssssssssssssssss", 
        $cedula, $primerNombre, $segundoNombre, $primerApellido, $segundoApellido,
        $nacionalidad, $paisOrigen, $estatusAlumno, $tipoAlumno,
        $escuelaAsignada, $anoIngreso, $periodoIngreso, $modoIngreso,
        $genero, $estadoCivil, $fechaNacimiento, $estadoActual, $direccion,
        $telLocal, $telCelular, $email, $observaciones, $revisado);
    
    if ($insertStmt->execute()) {
        echo json_encode(["success" => true, "message" => "Alumno guardado con éxito"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al guardar el alumno: " . $insertStmt->error]);
    }

    $insertStmt->close();
}

// Cerrar la conexión
$conn->close();
?>
