<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
include '../dbconn.php';

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || (!isset($data['identifier']) || !isset($data['password']))) {
    echo json_encode(["success" => false, "message" => "No data received."]);
    exit;
}

$identifier = trim($data['identifier']); // email or contact_number
$password = $data['password'];

// Check if account exists (email OR contact_number)
$stmt = $conn->prepare("SELECT account_id, email, contact_number, password, PIN, status FROM accounts WHERE email = ? OR contact_number = ?");
$stmt->bind_param("ss", $identifier, $identifier);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Email or phone number is incorrect."]);
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['password'])) {
    echo json_encode(["success" => false, "message" => "Password is incorrect."]);
    exit;
}

// ✅ Check account status
$status = strtolower($user['status']); // case-insensitive

if ($status === 'pending') {
    echo json_encode([
        "success" => false,
        "message" => "Your account is still pending approval."
    ]);
    exit;
} elseif ($status === 'rejected') {
    echo json_encode([
        "success" => false,
        "message" => "Your account has been rejected."
    ]);
    exit;
} elseif ($status !== 'approved') {
    // Catch any unexpected value
    echo json_encode([
        "success" => false,
        "message" => "Your account status is invalid."
    ]);
    exit;
}

// Success
echo json_encode([
    "success" => true,
    "message" => "Login successful.",
    "account_id" => $user['account_id'],
    "PIN_set" => !empty($user['PIN']) ? true : false
]);

$stmt->close();
$conn->close();
?>
