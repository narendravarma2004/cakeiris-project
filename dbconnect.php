<?php
// Database connection settings
$host = "localhost"; // Hostname (e.g., localhost)
$username = "root";  // Database username
$password = "";      // Database password
$database = "registation"; // Database name

// Create a connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    echo "Connected successfully";
}
?>
