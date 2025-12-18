<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include '../dbconn.php';

$data = json_decode(file_get_contents("php://input"), true);

$application_id = $data['application_id'] ?? null;
$approved_amount = $data['approved_amount'] ?? null;
$status = $data['status'] ?? null;
$expected_disbursement_date = !empty($data['expected_disbursement_date']) ? $data['expected_disbursement_date'] : date("Y-m-d");

if (!$application_id || !$status) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

// Fetch original loan application
$stmt = $conn->prepare("SELECT * FROM loan_application WHERE application_id = ?");
$stmt->bind_param("i", $application_id);
$stmt->execute();
$result = $stmt->get_result();
$loanApp = $result->fetch_assoc();
$stmt->close();

if (!$loanApp) {
    echo json_encode(["success" => false, "message" => "Loan application not found"]);
    exit;
}

// Fetch rate_percentage from loan_type table
$loanTypeStmt = $conn->prepare("SELECT rate_percentage FROM loan_type WHERE type_id = ?");
$loanTypeStmt->bind_param("i", $loanApp['type_id']);
$loanTypeStmt->execute();
$rateResult = $loanTypeStmt->get_result()->fetch_assoc();
$rate = floatval($rateResult['rate_percentage'] ?? 0); 
$loanTypeStmt->close();

// Update loan_application table
$updateStmt = $conn->prepare("
    UPDATE loan_application 
    SET approved_amount = ?, status = ?, expected_disbursement_date = ?, updated_at = NOW()
    WHERE application_id = ?
");
$updateStmt->bind_param("dssi", $approved_amount, $status, $expected_disbursement_date, $application_id);
if (!$updateStmt->execute()) {
    echo json_encode(["success" => false, "message" => "Failed to update loan request"]);
    exit;
}
$updateStmt->close();

// If approved, insert into loans table and generate repayment schedule
if ($status === "Approved") {
    $principal = floatval($approved_amount);
    $tenure = intval($loanApp['tenure']); // months

    // Calculation logic
    $baseMonthly = ($tenure > 0) ? ($principal / $tenure) : 0;

    // Monthly interest for specific periods
    $monthlyInterestRate = ($rate / 100);
    $interest13to24 = $baseMonthly * $monthlyInterestRate;
    $interest25to36 = $baseMonthly * $monthlyInterestRate;

    $totalInterest = 0;
    for ($m = 1; $m <= $tenure; $m++) {
        $interest = 0;
        if ($m >= 13 && $m <= 24) $interest = $interest13to24;
        if ($m >= 25) $interest = $interest25to36;
        $totalInterest += $interest;
    }

    $totalPayable = $principal + $totalInterest;
    $remaining_balance = $totalPayable;

    // Start and End dates
    $startDate = $expected_disbursement_date;
    $endDate = date("Y-m-d", strtotime("+$tenure months", strtotime($startDate)));

    // Corrected bind_param: 
    // i: application_id, i: account_id, d: principal, d: rate, d: total_payable, s: start, s: end, d: remaining
    $loanStmt = $conn->prepare("
        INSERT INTO loans 
        (application_id, account_id, principal_amount, interest_rate, total_payable, start_date, end_date, current_status, created_at, updated_at, remaining_balance)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Active', NOW(), NOW(), ?)
    ");

    $loanStmt->bind_param(
        "iidddssd",
        $application_id,
        $loanApp['account_id'],
        $principal,
        $rate,
        $totalPayable,
        $startDate,
        $endDate,
        $remaining_balance
    );

    if (!$loanStmt->execute()) {
        echo json_encode(["success" => false, "message" => "SQL Error: " . $loanStmt->error]);
        exit;
    }

    $loan_id = $loanStmt->insert_id;
    $loanStmt->close();

    // Repayment schedule generation
    $scheduleStmt = $conn->prepare("
        INSERT INTO repayment_schedule 
        (loan_id, installment_number, due_date, scheduled_amount, status, paid_amount, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'Due', 0, NOW(), NOW())
    ");

    $dueDate = new DateTime($startDate);
    for ($m = 1; $m <= $tenure; $m++) {
        $dueDate->modify("+1 month");

        $interest = 0;
        if ($m >= 13 && $m <= 24) $interest = $interest13to24;
        if ($m >= 25) $interest = $interest25to36;

        $monthlyPayment = $baseMonthly + $interest;
        $due_date_str = $dueDate->format("Y-m-d");

        $scheduleStmt->bind_param("iisd", $loan_id, $m, $due_date_str, $monthlyPayment);
        $scheduleStmt->execute();
    }
    $scheduleStmt->close();
}

echo json_encode(["success" => true, "message" => "Loan request updated successfully"]);
$conn->close();
?>
