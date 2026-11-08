<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
header('Content-Type: application/json; charset=utf-8');

try {
    include_once __DIR__ . '/../../version1.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método no permitido", 405);
    }

    include_once __DIR__ . '/../../conexion.php';
    $cx = new Conexion();
    $db = $cx->getConnection();

    $rawBody = file_get_contents('php://input');
    $body = json_decode($rawBody, true);
    if (!is_array($body)) $body = $_POST;

    $username   = trim($body['username'] ?? '');
    $email      = trim($body['mail'] ?? ''); // Ojo: JS envía 'mail'
    $password   = (string)($body['password'] ?? '');
    $persona_id = trim($body['persona_id'] ?? ''); // RUT
    $fechaNac   = trim($body['fechaNacimiento'] ?? '');

    if (!$username || !$email || !$password || !$persona_id) {
        throw new Exception("Faltan datos obligatorios");
    }

    // 1. VALIDAR SI EL RUT YA EXISTE (Requerimiento principal)
    $sql = "SELECT id FROM usuario WHERE persona_id = ? LIMIT 1";
    $st  = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($st, "s", $persona_id);
    mysqli_stmt_execute($st);
    if (mysqli_stmt_fetch($st)) {
        throw new Exception("Este RUT ya está registrado", 409);
    }
    mysqli_stmt_close($st);

    // 2. VALIDAR SI EL EMAIL YA EXISTE
    $sql = "SELECT id FROM usuario WHERE email = ? LIMIT 1";
    $st  = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($st, "s", $email);
    mysqli_stmt_execute($st);
    if (mysqli_stmt_fetch($st)) {
        throw new Exception("Este correo ya está registrado", 409);
    }
    mysqli_stmt_close($st);

    // 3. INSERTAR CON NUEVOS CAMPOS
    $pwdHash = password_hash($password, PASSWORD_DEFAULT);
    $fechaSQL = !empty($fechaNac) ? $fechaNac : null;

    $sql = "INSERT INTO usuario (username, email, password, persona_id, fecha_nacimiento, activo) VALUES (?, ?, ?, ?, ?, 1)";
    $st  = mysqli_prepare($db, $sql);
    // "sssss" -> username, email, password, rut, fecha
    mysqli_stmt_bind_param($st, "sssss", $username, $email, $pwdHash, $persona_id, $fechaSQL);
    
    mysqli_stmt_execute($st);
    $newId = mysqli_insert_id($db);

    echo json_encode(['success' => 'Usuario creado', 'id' => $newId]);

} catch (Throwable $e) {
    $code = $e->getCode();
    http_response_code(($code >= 400 && $code < 600) ? $code : 500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>