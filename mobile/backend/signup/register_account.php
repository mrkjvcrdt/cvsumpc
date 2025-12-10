<?php
// Allow CORS requests (Expo Go)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include '../dbconn.php'; // Make sure path is correct

// Get the raw POST data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "No data received."]);
    exit;
}

// Required fields
$required = [
    "email",
    "password",
    "last_name",
    "first_name",
    "contact_number",
    "nationality",
    "barangay",
    "municipality",
    "province",
    "zipcode"
];

foreach ($required as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        echo json_encode(["success" => false, "message" => "$field is required."]);
        exit;
    }
}

// Sanitize and assign variables
$email = trim($data['email']);
$password = password_hash($data['password'], PASSWORD_DEFAULT);

$last_name = trim($data['last_name']);
$first_name = trim($data['first_name']);
$middle_name = isset($data['middle_name']) ? trim($data['middle_name']) : null;
$suffix = isset($data['suffix']) ? trim($data['suffix']) : null;

$contact_number = trim($data['contact_number']);
$gender = isset($data['gender']) ? trim($data['gender']) : null;
$nationality = trim($data['nationality']);
$birthday = isset($data['birthday']) ? trim($data['birthday']) : null;

$street = isset($data['street']) ? trim($data['street']) : null;
$barangay = trim($data['barangay']);
$municipality = trim($data['municipality']);
$province = trim($data['province']);
$zipcode = trim($data['zipcode']);

$status = "Pending";
$account_status = "Active";
$created_at = date("Y-m-d H:i:s");
$updated_at = $created_at;

// Check if email already exists
$stmt = $conn->prepare("SELECT account_id FROM accounts WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already exists."]);
    exit;
}

// Insert into accounts table
$stmt = $conn->prepare("
    INSERT INTO accounts 
    (email, password, last_name, first_name, middle_name, suffix, contact_number, gender, nationality, birthday, street, barangay, municipality, province, zipcode, status, account_status, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "sssssssssssssssssss",
    $email,
    $password,
    $last_name,
    $first_name,
    $middle_name,
    $suffix,
    $contact_number,
    $gender,
    $nationality,
    $birthday,
    $street,
    $barangay,
    $municipality,
    $province,
    $zipcode,
    $status,
    $account_status,
    $created_at,
    $updated_at
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Account registered successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>