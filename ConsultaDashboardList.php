<?php
   // Conexión a la base de datos
   
  //  $servername = "localhost"; // Cambia esto según tu configuración
  //  $username = "root";
  //  $password = "123456";
  //  $dbname = "system_fcs_uc";
  include 'ConfigConex.php';

   $conn = new mysqli($servername, $username, $password, $dbname);

   if ($conn->connect_error) {
       die("Conexión fallida: " . $conn->connect_error);
   }

   // Realiza la consulta
   $sql = "SELECT COUNT(DISTINCT ID_Alumno) AS contador_distintos FROM alumnos;";
   $result = $conn->query($sql);

   //$sql1 = "SELECT COUNT(DISTINCT ID_Alumno) AS contador_distintos FROM alumnos;";
   //$result1 = $conn->query($sql1);

   $sql2 = "SELECT COUNT(DISTINCT ID_Alumno) AS contador_nuevos FROM alumnos WHERE alumnos.CodActivo_alumno=1;";
   $result2 = $conn->query($sql2);

   $sql3 = "SELECT COUNT(DISTINCT ID_Alumno) AS contador_regulares FROM alumnos WHERE alumnos.CodActivo_alumno=3;";
   $result3 = $conn->query($sql3);



   //$datos = [];
   //if ($result->num_rows > 0) {
       // Almacena el resultado en un array

       $NroStudents = $result->fetch_assoc()['contador_distintos'];
       //$PromedioNotas = $result1->fetch_assoc()['columna2'];
       $NuevosStudents = $result2->fetch_assoc()['contador_nuevos'];
       $RegularesStudents = $result3->fetch_assoc()['contador_regulares'];
      // $row = $result->fetch_assoc();
       //$datos['contador'] = $row['contador_distintos'];
   //}
   
   //else {
     //  $datos['contador'] = 0; // Si no hay resultados, devuelve 0
   //}
   
   // Devuelve los datos en formato JSON
   echo json_encode(['nroEstudiantes'=>$NroStudents,'nuevosEstudiantes'=>$NuevosStudents,'regularesEstudiantes'=>$RegularesStudents]);
   $conn->close();
   ?>