<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
include '../../dbconn.php'; // Adjust path as needed

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['account_id'])) {
    echo json_encode(["success" => false, "message" => "Account ID missing."]);
    exit;
}

$account_id = intval($data['account_id']);

$stmt = $conn->prepare("SELECT current_balance FROM savings_account WHERE account_id = ? AND status = 'Active'");
$stmt->bind_param("i", $account_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "No active savings account found."]);
    exit;
}

$row = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "current_balance" => $row['current_balance']
]);

$stmt->close();
$conn->close();
?>
