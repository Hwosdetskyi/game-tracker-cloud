<?php
require_once 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
if(empty($data['username']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Please fill in all fields"]);
    exit();
}

$username = trim($data['username']);
$password = password_hash($data['password'], PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->execute([$username, $password]);
    echo json_encode(["message" => "Registration successful"]);
} catch(PDOException $e) {
    http_response_code(400);
    echo json_encode(["error" => "User already exists"]);
}
?>