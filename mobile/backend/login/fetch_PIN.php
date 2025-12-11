<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include '../dbconn.php';

// Read input
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['account_id']) || !isset($input['pin'])) {
    echo json_encode(["success" => false, "message" => "Missing data"]);
    exit;
}

$account_id = intval($input['account_id']);
$pin = $input['pin'];

// Fetch hashed PIN from database
$stmt = $conn->prepare("SELECT PIN FROM accounts WHERE account_id = ?");
$stmt->bind_param("i", $account_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Account not found"]);
    exit;
}

$user = $result->fetch_assoc();

// Verify entered PIN with hashed PIN
if (password_verify($pin, $user['PIN'])) {
    echo json_encode(["success" => true, "message" => "PIN correct"]);
} else {
    echo json_encode(["success" => false, "message" => "Incorrect PIN"]);
}

$stmt->close();
$conn->close();
?>
