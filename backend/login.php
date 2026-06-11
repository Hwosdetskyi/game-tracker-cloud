<?php
require_once 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
if(empty($data['username']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Please fill in all fields"]);
    exit();
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$data['username']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($data['password'], $user['password'])) {
    echo json_encode([
        "message" => "Login successful",
        "userId" => $user['id'],
        "username" => $user['username']
    ]);
} else {
    http_response_code(401);
    echo json_encode(["error" => "Invalid username or password"]);
}
?>