"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const signInUser = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      "gowthambhat550@gmail.com", // Replace with your email
      "manjeshw@r123A" // Replace with your password
    );

    // Get ID token
    const token = await userCredential.user.getIdToken();
    console.log("Firebase ID Token:", token);

    // Store token in local storage or send it to your backend
    localStorage.setItem("token", token);

  } catch (error) {
    console.error("Error signing in:", error);
  }
};

const Login = () => {
  return (
    <div>
      <button onClick={signInUser}>Sign In</button>
    </div>
  );
};

export default Login;
