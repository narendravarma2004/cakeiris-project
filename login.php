<?php
// Include the database connection file
include 'dbconnect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the username and password from the form
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prepare an SQL query to check if the user exists
    $sql = "SELECT password FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);

    // Execute the query
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Fetch the stored hashed password
        $stmt->bind_result($hashed_password);
        $stmt->fetch();

        // Verify the password
        if (password_verify($password, $hashed_password)) {
            // Redirect to a new page upon successful login
            header("Location: blood.html");
            exit;
        } else {
            echo "Incorrect password. Please try again.";
        }
    } else {
        echo "No user found with this username.";
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
}
?>
