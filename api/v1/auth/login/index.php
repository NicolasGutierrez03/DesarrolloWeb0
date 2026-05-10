<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
header('Content-Type: application/json; charset=utf-8');

try {
    include_once __DIR__ . '/../../version1.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido', 405);
    }

    include_once __DIR__ . '/../../conexion.php';
    $cx = new Conexion();
    $db = $cx->getConnection();

    $rawBody = file_get_contents('php://input');
    $body = json_decode($rawBody, true);
    if (!is_array($body)) $body = $_POST;

    // AHORA ESPERAMOS 'email'
    $email    = trim($body['email'] ?? ''); 
    $password = (string)($body['password'] ?? '');

    if ($email === '' || $password === '') {
        throw new Exception('Faltan campos: email, password', 400);
    }

    // BUSCAR POR EMAIL
    $sql = "SELECT id, username, email, password, persona_id, fecha_nacimiento, activo FROM usuario WHERE email = ? LIMIT 1";
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    $row = mysqli_fetch_assoc($res);
    mysqli_stmt_close($stmt);

    if (!$row) {
        throw new Exception('Correo o contraseña incorrectos', 401);
    }

    if ((int)$row['activo'] !== 1) {
        throw new Exception('Usuario desactivado', 403);
    }

    if (!password_verify($password, $row['password'])) {
        throw new Exception('Correo o contraseña incorrectos', 401);
    }

    echo json_encode([
        'access_token' => 'udp.2025',
        'refresh_token' => 'udp.2025.refresh',
        'token_type' => 'Bearer',
        'expires_in' => 3600,
        'user' => [
            'id' => (int)$row['id'],
            'username' => $row['username'],
            'email' => $row['email'],
            'persona_id' => $row['persona_id'],
            'fecha_nacimiento' => $row['fecha_nacimiento']
        ]
    ]);

} catch (Throwable $e) {
    $code = $e->getCode();
    http_response_code(($code >= 400 && $code < 600) ? $code : 500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>