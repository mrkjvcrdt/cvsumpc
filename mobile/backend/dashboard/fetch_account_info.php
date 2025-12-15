<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../dbconn.php"; 

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['account_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Account ID missing"
    ]);
    exit;
}

$accountId = $data['account_id'];

$stmt = $conn->prepare("
    SELECT first_name, last_name, suffix
    FROM accounts
    WHERE account_id = ?
    LIMIT 1
");

$stmt->bind_param("i", $accountId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();

    echo json_encode([
        "success" => true,
        "first_name" => $row['first_name'],
        "last_name" => $row['last_name'],
        "suffix" => $row['suffix']
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Account not found"
    ]);
}

$stmt->close();
$conn->close();
