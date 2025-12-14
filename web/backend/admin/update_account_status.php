<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include '../dbconn.php';

$data = json_decode(file_get_contents("php://input"), true);

$account_id = $data["account_id"] ?? null;
$action = $data["action"] ?? null;

if (!$account_id || !$action) {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit;
}

$status = ($action === "approve") ? "Approved" : "Rejected";

$conn->begin_transaction();

try {

    // 1️⃣ Update account status
    $sql = "UPDATE accounts 
            SET status = ?, updated_at = NOW() 
            WHERE account_id = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Prepare failed (accounts): " . $conn->error);
    }

    $stmt->bind_param("si", $status, $account_id);
    $stmt->execute();
    $stmt->close();

    // 2️⃣ Create savings account ONLY if approved
    if ($action === "approve") {

        $sqlSavings = "
            INSERT IGNORE INTO savings_account (account_id)
            VALUES (?)
        ";

        $stmtSavings = $conn->prepare($sqlSavings);

        if (!$stmtSavings) {
            throw new Exception("Prepare failed (savings): " . $conn->error);
        }

        $stmtSavings->bind_param("i", $account_id);
        $stmtSavings->execute();
        $stmtSavings->close();
    }

    // 3️⃣ Commit everything
    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Account has been " . strtolower($status) . "."
    ]);

} catch (Exception $e) {

    // 🔥 Rollback if anything fails
    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conn->close();
