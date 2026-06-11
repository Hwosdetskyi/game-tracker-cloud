<?php
require_once 'config.php';

$userId = getUserIdOrDie(); 
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $stmt = $pdo->prepare("SELECT * FROM games WHERE user_id = ?");
        $stmt->execute([$userId]);
        $games = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($games);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if(empty($data['title']) || empty($data['platform']) || empty($data['genre'])) {
            http_response_code(400);
            echo json_encode(["error" => "Incomplete data"]);
            break;
        }
        $stmt = $pdo->prepare("INSERT INTO games (user_id, title, platform, genre, status, rating) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $data['title'], $data['platform'], $data['genre'], $data['status'] ?? 'In progress', $data['rating'] ?? 5]);
        echo json_encode(["message" => "Game added successfully", "id" => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if(empty($data['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Game ID is required"]);
            break;
        }
        $stmt = $pdo->prepare("UPDATE games SET title=?, platform=?, genre=?, status=?, rating=? WHERE id=? AND user_id=?");
        $stmt->execute([$data['title'], $data['platform'], $data['genre'], $data['status'], $data['rating'], $data['id'], $userId]);
        echo json_encode(["message" => "Game updated successfully"]);
        break;

    case 'DELETE':
        if(!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Game ID is required"]);
            break;
        }
        $stmt = $pdo->prepare("DELETE FROM games WHERE id=? AND user_id=?");
        $stmt->execute([$_GET['id'], $userId]);
        echo json_encode(["message" => "Game deleted successfully"]);
        break;
}
?>