<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../dbconn.php";

try {
    $stmt = $conn->prepare("SELECT * FROM pending_users ORDER BY created_at DESC");
    $stmt->execute();
    $result = $stmt->get_result();

    $pendingUsers = [];
    while ($row = $result->fetch_assoc()) {
        $pendingUsers[] = $row;
    }

    echo json_encode([
        "success" => true,
        "pendingUsers" => $pendingUsers
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error fetching pending users: " . $e->getMessage()
    ]);
}

$stmt->close();
$conn->close();
?>
