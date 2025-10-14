<?php
header("Content-Type: application/json");
// Enable CORS for Expo
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
include '../dbconn.php';

// Get JSON POST data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(["success" => false, "message" => "No data received"]);
    exit;
}

// Map input safely with defaults
$lastName = mysqli_real_escape_string($conn, $input['last_name'] ?? '');
$firstName = mysqli_real_escape_string($conn, $input['first_name'] ?? '');
$middleName = mysqli_real_escape_string($conn, $input['middle_name'] ?? '');
$suffix = mysqli_real_escape_string($conn, $input['suffix'] ?? '');
$sex = mysqli_real_escape_string($conn, $input['sex'] ?? '');
$birthday = mysqli_real_escape_string($conn, $input['birthday'] ?? '');
$email = mysqli_real_escape_string($conn, $input['email'] ?? '');
$street = mysqli_real_escape_string($conn, $input['street'] ?? '');
$barangay = mysqli_real_escape_string($conn, $input['barangay'] ?? '');
$municipality = mysqli_real_escape_string($conn, $input['municipality'] ?? '');
$province = mysqli_real_escape_string($conn, $input['province'] ?? '');
$zip = mysqli_real_escape_string($conn, $input['zip_code'] ?? '');

// Extra fields for pending_users table
$termsAgreed = 1; // always agreed if coming from Phase2
$status = 'Pending';
$remarks = '';
$createdAt = date('Y-m-d H:i:s');

// Insert query
$query = "INSERT INTO pending_users (
    last_name, first_name, middle_name, suffix, sex, birthday, email,
    street, barangay, municipality, province, zip_code,
    terms_agreed, status, remarks, created_at
) VALUES (
    '$lastName', '$firstName', '$middleName', '$suffix', '$sex', '$birthday', '$email',
    '$street', '$barangay', '$municipality', '$province', '$zip',
    $termsAgreed, '$status', '$remarks', '$createdAt'
)";

if (mysqli_query($conn, $query)) {
    echo json_encode(["success" => true, "message" => "Registration submitted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error: " . mysqli_error($conn)]);
}

mysqli_close($conn);
?>
