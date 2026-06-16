<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$host = '127.0.0.1';
$db_name = getenv('DB_NAME') ?: 'game_tracker';
$username = getenv('DB_USER') ?: 'root'; 
$password = getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : '';     

try {
    $dsn = "mysql:host=$host;dbname=$db_name;charset=utf8";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500); 
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit();
}

function getUserIdOrDie() {
    $headers = getallheaders();
    if (!isset($headers['Authorization']) || empty($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit();
    }
    return intval($headers['Authorization']);
}
?>