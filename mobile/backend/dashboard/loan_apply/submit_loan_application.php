<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include '../../dbconn.php';

// Handle JSON data or multipart/form-data
$account_id = $_POST['account_id'] ?? null;
$type_id = $_POST['type_id'] ?? null;
$amount = $_POST['amount'] ?? null;
$tenure = $_POST['tenure'] ?? null;

// Payslip file
$payslip_pic = null;
if (isset($_FILES['payslip']) && $_FILES['payslip']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = "../../uploads/payslips/";
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $ext = pathinfo($_FILES['payslip']['name'], PATHINFO_EXTENSION);
    $filename = uniqid("payslip_") . "." . $ext;
    $targetFile = $uploadDir . $filename;

    if (move_uploaded_file($_FILES['payslip']['tmp_name'], $targetFile)) {
        $payslip_pic = "uploads/payslips/" . $filename;
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Failed to upload payslip"
        ]);
        exit;
    }
}

if (!$account_id || !$type_id || !$amount || !$tenure) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);
    exit;
}

// Insert into DB
$stmt = $conn->prepare("
    INSERT INTO loan_application
        (account_id, type_id, amount, tenure, status, payslip_pic, application_date)
    VALUES (?, ?, ?, ?, 'Pending', ?, NOW())
");

$stmt->bind_param(
    "iidis",
    $account_id,
    $type_id,
    $amount,
    $tenure,
    $payslip_pic
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Loan application submitted successfully",
        "application_id" => $stmt->insert_id
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to submit loan application"
    ]);
}

$stmt->close();
$conn->close();
