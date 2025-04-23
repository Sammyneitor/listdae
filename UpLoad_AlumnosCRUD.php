<?php
// Configuración de la base de datos
// $servername = "localhost";
// $username = "root";
// $password = "123456";
// $dbname = "system_fcs_uc";
include 'ConfigConex.php';

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Leer los datos enviados desde el cliente
$data = json_decode(file_get_contents('php://input'), true);

// Verificar si se recibieron datos
if ($data && isset($data['data'])) {
    $registros = $data['data'];
    $errores = [];  // Para almacenar los errores de duplicados u otros
    $registrosCargados = 0;  // Variable para contar los registros cargados exitosamente

    // Preparar la consulta INSERT
    $stmt = $conn->prepare("
        INSERT INTO alumnos (
            ID_Alumno, FirstName_Alumno, FirstName_AlumnoV2, SecondName_Alumno, SecondName_AlumnoV2,
            Nacionalidad_Alumno, Estatus_Alumno, CodActivo_Alumno, CodCarrera_Alumno
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    // Iterar sobre los registros para insertar en la base de datos
    foreach ($registros as $registro) {
        // Verificar si se tiene la cédula (A_CI)
        $cedula = isset($registro[1]) ? $registro[1] : ''; // Verificar que la cédula exista
        $statusAlumno = '0'; // Estado por defecto (0=Activo)
        $CodigoActivo = '3'; // Código de activo por defecto (modificar si es necesario)

        // Inicializar valores de los campos procesados
        $nacionalidad = '';
        $id_alumno = '';

        // Validación y procesamiento de la cédula
        if (!empty($cedula) && is_numeric($cedula)) {
            // Procesar la cédula para determinar la nacionalidad e ID
            $primer_digito = substr($cedula, 0, 1);  // Primer dígito de la cédula
            if ($primer_digito == '0') {
                $nacionalidad = 'V';  // Nacionalidad Venezolana
            } elseif ($primer_digito == '1') {
                $nacionalidad = 'E';  // Nacionalidad Extranjera
            }

            // El resto de la cédula es el ID del alumno
            $id_alumno = substr($cedula, 1);  // El ID es el resto de la cédula
        } else {
            // Si la cédula no es válida, agregar un error
            $errores[] = ['type' => 'Invalid ID', 'registro' => $registro];
            continue;  // Si hay error, saltar a la siguiente iteración
        }

        // Obtener y procesar el nombre completo (A_NOMBRE)
        $nombre_completo = isset($registro[2]) ? $registro[2] : '';  // Asegurarse de que el nombre exista

        $second_name_alumno_v2 = 'S/E';
        $second_name_alumno = 'S/E';
        $first_name_alumno = 'S/E';
        $first_name_alumno_v2 = 'S/E';

        if (!empty($nombre_completo)) {
            // Limpiar múltiples espacios consecutivos y eliminar espacios al inicio y final
            $nombre_completo = preg_replace('/\s+/', ' ', trim($nombre_completo));

            // Separar el nombre completo por espacios
            $partes_nombre = explode(' ', $nombre_completo);

            // Validar la cantidad de partes
            $numero_partes = count($partes_nombre);

            // Caso con 2 partes: primer apellido y primer nombre
            if ($numero_partes == 2) {
                $second_name_alumno = trim($partes_nombre[0]);
                $first_name_alumno = trim($partes_nombre[1]);
            } 

            // Caso con 4 partes: los primeros 2 son apellidos, los últimos 2 son nombres
            elseif ($numero_partes == 4) {
                $second_name_alumno = trim($partes_nombre[0]);
                $second_name_alumno_v2 = trim($partes_nombre[1]);
                $first_name_alumno = trim($partes_nombre[2]);
                $first_name_alumno_v2 = trim($partes_nombre[3]);
            } 

            // Si la cantidad de partes es par
            elseif ($numero_partes % 2 == 0) {
                $mitad = $numero_partes / 2;
                $second_name_alumno = implode(' ', array_slice($partes_nombre, 0, $mitad));
                $first_name_alumno = implode(' ', array_slice($partes_nombre, $mitad));
            }

            // Si la cantidad de partes es impar
            elseif ($numero_partes % 2 != 0) {
                $second_name_alumno = trim($partes_nombre[0]);
                $first_name_alumno = implode(' ', array_slice($partes_nombre, 1));
            }

        } else {
            $errores[] = ['type' => 'Missing Name', 'registro' => $registro];
            continue;
        }

        // Vincular los parámetros
        $codigoCarrera = isset($registro[3]) ? $registro[3] : '';  // Si no existe, asignamos un valor por defecto

        $stmt->bind_param("sssssssss", 
            $id_alumno,  // ID_Alumno
            $first_name_alumno,  
            $first_name_alumno_v2,  
            $second_name_alumno,
            $second_name_alumno_v2, 
            $nacionalidad,   // Nacionalidad_Alumno
            $statusAlumno,
            $CodigoActivo,  
            $codigoCarrera  // Código de carrera
        );

        // Ejecutar la consulta
        try {
            $stmt->execute();
            $registrosCargados++;  // Incrementar el contador si la ejecución fue exitosa
        } catch (mysqli_sql_exception $e) {
            // Manejo de errores
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                 
                $errores[] = ['type' => 'Duplicate entry', 'registro' => $registro];
            } elseif (strpos($e->getMessage(), 'FOREIGN KEY constraint fails') !== false) {
                $errores[] = ['type' => 'Foreign Key Constraint', 'registro' => $registro];
            } elseif (strpos($e->getMessage(), 'Column cannot be null') !== false) {
                $errores[] = ['type' => 'Null value violation', 'registro' => $registro];
            } else {
                $errores[] = ['type' => 'SQL Error', 'registro' => $registro, 'message' => $e->getMessage()];
            }
            // No hacer continue aquí para que los registros cargados sigan contando
        }
    }

    // Cerrar la conexión después de todos los inserts
    $stmt->close();
    $conn->close();

    // Enviar respuesta con los resultados
    if (count($errores) > 0) {
        echo json_encode([
            'success' => false,
            'errors' => $errores,  // Enviamos todos los errores
            'registrosCargados' => $registrosCargados
        ]);
    } else {
        // Si no hubo errores, confirmamos que la carga fue exitosa y el número de registros cargados
        echo json_encode([
            'success' => true,
            'message' => 'Carga de registros exitosa.',
            'registrosCargados' => $registrosCargados  // Devolver el número de registros cargados exitosamente
        ]);
    }

} else {
    // Si no se recibieron datos válidos, enviar un mensaje de error
    echo json_encode([
        'success' => false,
        'errorType' => 'Invalid data',
        'message' => 'No se recibieron datos válidos.'
    ]);
}
?>
