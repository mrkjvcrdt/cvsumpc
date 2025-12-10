<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
include '../dbconn.php';

$response = ["success" => false, "pendingUsers" => []];

try {
    $sql = "SELECT * FROM accounts WHERE status = 'Pending' ORDER BY account_id DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    $response["success"] = true;
    $response["pendingUsers"] = $users;

} catch (Exception $e) {
    $response["message"] = "Error fetching accounts: " . $e->getMessage();
}

echo json_encode($response);
$stmt->close();
$conn->close();
