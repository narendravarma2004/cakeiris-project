// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔹 Your Firebase project config (copy from Firebase Console → Project Settings → SDK setup)
const firebaseConfig = {
  apiKey: "AIzaSyAGGpBpDPP7QhYxJCvCAuo6V_1hyLwsxFg",
  authDomain: "cakeiris-2803.firebaseapp.com",
  projectId: "cakeiris-2803",
  storageBucket: "cakeiris-2803.firebasestorage.app",
  messagingSenderId: "591841002818",
  appId: "1:591841002818:web:fb77ad7a05d9c8e68cf4db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔹 Handle Registration
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: fullname });
      alert("Registration successful!");
      window.location.href = "index.html"; // redirect to login
    } catch (error) {
      alert(error.message);
    }
  });
}

// 🔹 Handle Login
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      window.location.href = "home.html"; // redirect to home/orders page
    } catch (error) {
      alert(error.message);
    }
  });
}
