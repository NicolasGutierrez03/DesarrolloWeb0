<?php
$_method = $_SERVER['REQUEST_METHOD'];
$_uri    = $_SERVER['REQUEST_URI'];
$_partes = explode('/', $_uri);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$authHeader = null;
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
} elseif (function_exists('getallheaders')) {
    $headers = array_change_key_case(getallheaders(), CASE_LOWER);
    if (isset($headers['authorization'])) {
        $authHeader = $headers['authorization'];
    }
}

if ($authHeader !== 'Bearer udp.2025') {
    http_response_code(401);
    echo json_encode(['error' => 'No tiene autorizacion']);
    exit;
}

$last = $_partes[count($_partes) - 1];

if (strpos($last, '?') !== false) {
    $_parametros = explode('?', $last)[1];
    parse_str($_parametros, $params);
    $_parametroID = $params['id'] ?? null;
    $_personaId   = $params['personaId'] ?? null;
} else {
    $_parametroID = null;
    $_personaId   = null;
}
?>