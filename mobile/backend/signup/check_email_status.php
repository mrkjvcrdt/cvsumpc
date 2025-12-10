<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include_once '../dbconn.php';

//READ JSON
$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? "";

if (!$email) {
    echo json_encode(["error" => true, "message" => "Email is required"]);
    exit;
}

$email = mysqli_real_escape_string($conn, $email);

// Query pending_users table
$sql = "SELECT status, remarks FROM pending_users WHERE email = '$email' ORDER BY pending_id DESC LIMIT 1";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);
    echo json_encode([
        "exists" => true,
        "status" => $row['status'],
        "remarks" => $row['remarks']
    ]);
} else {
    echo json_encode([
        "exists" => false
    ]);
}

mysqli_close($conn);
?>