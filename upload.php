<?php
ini_set('max_input_vars', 5000); // Aumenta el límite de variables de entrada

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtén el contenido JSON del cuerpo de la solicitud
    $jsonData = file_get_contents('php://input');

    // Decodifica el JSON a un array asociativo
    $data = json_decode($jsonData, true);

    if (!$data) {
        echo json_encode(["status" => "error", "message" => "Datos inválidos o vacíos"]);
        exit();
    }

    // Extraer el nombre de la tabla y los datos
    $table = $data['table']; // El nombre de la tabla
    $excelData = $data['data']; // Los datos del archivo Excel (array de registros)
    $AnalistName = $data['NameUser']; // Nombre del analista
    $codigoDeTabla = $data['CodigoEscuela'];

    // Construir el nombre completo de la tabla con "record_estudiantes_" + nombre de la tabla
    $tableName = "record_estudiantes_" . $table;

    // Conéctate a tu base de datos (ajusta los parámetros según tu configuración)
    // $servername = "localhost"; // Cambia esto según tu configuración
    // $username = "root";
    // $password = "123456";
    // $dbname = "system_fcs_uc";
    include 'ConfigConex.php';

    // Crea una conexión
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verifica la conexión
    if ($conn->connect_error) {
        die(json_encode(["status" => "error", "message" => "Conexión fallida: " . $conn->connect_error]));
    }

    // Formatear la fecha y hora actual
    $timestamp = time();
    $formattedDate = date('Y-m-d H:i:s', $timestamp);

    // Validar si la tabla existe en la base de datos
    $checkTableQuery = "SHOW TABLES LIKE '$tableName'";
    $result = $conn->query($checkTableQuery);
    
    if ($result->num_rows == 0) {
        echo json_encode(["status" => "error", "message" => "La tabla $tableName no existe en la base de datos."]);
        exit();
    }

    // Vaciar la tabla y reiniciar el valor del auto-incremento
    $vaciarTablaQuery = "TRUNCATE TABLE $tableName";  // Elimina todos los registros y reinicia el auto-incremento
    if (!$conn->query($vaciarTablaQuery)) {
        echo json_encode(["status" => "error", "message" => "Error al vaciar la tabla: " . $conn->error]);
        $conn->close();
        exit();
    }

    // Usar una consulta preparada para evitar inyección SQL
    $stmt = $conn->prepare("INSERT INTO $tableName (ID_Alumno, AñoPeriodo_Escuela, 
    NroPeriodo_Escuela, CodAsignatura_Escuela, SeccionAsignatura_Escuela, 
    Condicion_Alumno_Escuela, Fecha_Act_Lista, Name_Analista) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    // Verificar si la consulta fue preparada correctamente
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Error en la preparación de la consulta: " . $conn->error]);
        $conn->close();
        exit();
    }

    foreach ($excelData as $row) {
        // Verifica si la fila está vacía (todas las columnas están vacías)
        if (empty(array_filter($row))) {
            continue;  // Si la fila está vacía, salta al siguiente registro
        }

        // Reemplazar los campos vacíos por "S/E" (Sin Especificar)
        $campo_MPeriodo = !empty($row['M_PERIODO']) ? $row['M_PERIODO'] : 'S/E';
        $campo_A_CI = !empty($row['A_CI']) ? substr($row['A_CI'], 1) : 'S/E'; // Elimina el primer dígito si no está vacío
        $campo_MClave = !empty($row['M_CLAVE']) ? $row['M_CLAVE'] : 'S/E';
        $campo_MSeccion = !empty($row['M_S']) ? $row['M_S'] : 'S/E';
        $campo_MCondicion = !empty($row['M_CON']) ? $row['M_CON'] : 'S/C';
        $campo_E_COD = !empty($row['E_COD']) ? $row['E_COD'] : '000';

        // Procesa el valor de M_PERIODO solo si tiene exactamente 3 caracteres
        if ($campo_MPeriodo !== 'S/E' && strlen($campo_MPeriodo) == 3) {
            // Los dos primeros caracteres para el año
            $campo_AnoPeriodo = substr($campo_MPeriodo, 0, 2);  // Primeros 2 caracteres: el año (ejemplo: 25 -> 25)
            $campo_AnoPeriodo = (int)$campo_AnoPeriodo + 2000; // Sumar 2000 para obtener el año completo (25 -> 2025)

            // El último carácter para el número de periodo
            $campo_NroPeriodo = substr($campo_MPeriodo, 2, 1);  // El último dígito: el número de periodo (ejemplo: 251 -> 1)
        } else {
            // Si el valor de M_PERIODO no tiene 3 caracteres o es "S/E", asignar valores por defecto
            $campo_AnoPeriodo = 0;
            $campo_NroPeriodo = 0;
        }

        // Asigna el valor de los otros campos (ya con valores "S/E" si estaban vacíos)
        $campo_Cedula = $campo_A_CI;
        $campo_CodAsignatura = $campo_MClave;
        $campo_SecAsignatura = $campo_MSeccion;
        $campo_Condicion = $campo_MCondicion;

        if ($campo_E_COD == $codigoDeTabla){

            $stmt->bind_param('ssssssss', $campo_Cedula, $campo_AnoPeriodo, $campo_NroPeriodo, 
            $campo_CodAsignatura, $campo_SecAsignatura, $campo_Condicion, 
            $formattedDate, $AnalistName);

            // Ejecuta la consulta
            if (!$stmt->execute()) {
            $stmt->close();
            $conn->close();
            exit();
            }

        }
        // Usar la consulta preparada para insertar los datos en la base de datos
       
    }

    // Cierra la declaración y la conexión
    $stmt->close();
    $conn->close();

    // Responde con un mensaje exitoso
    echo json_encode(["status" => "success", "message" => "Datos cargados exitosamente en la tabla $tableName"]);
} else {
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
}
?>
