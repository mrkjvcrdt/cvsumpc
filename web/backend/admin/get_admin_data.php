<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
include '../dbconn.php';

$response = ['success' => false];

try {
    // Staff accounts
    $staffResult = $conn->query("SELECT * FROM staffuser");
    $staffList = [];
    while ($row = $staffResult->fetch_assoc()) {
        $staffList[] = $row;
    }

    // Member accounts (status = 'Approved')
    $memberResult = $conn->query("SELECT * FROM accounts WHERE status='Approved'");
    $membersList = [];
    while ($row = $memberResult->fetch_assoc()) {
        $membersList[] = $row;
    }

    // Pending accounts (status = 'Pending')
    $pendingResult = $conn->query("SELECT * FROM accounts WHERE status='Pending'");
    $pendingList = [];
    while ($row = $pendingResult->fetch_assoc()) {
        $pendingList[] = $row;
    }

    $response['success'] = true;
    $response['staffList'] = $staffList;
    $response['membersList'] = $membersList;
    $response['pendingUsers'] = $pendingList;

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
$conn->close();
?>
