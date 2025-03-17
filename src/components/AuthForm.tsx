"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

interface UserCredentials {
  name?: string;
  email: string;
  password: string;
}

export default function AuthForm() {
  const [credentials, setCredentials] = useState<UserCredentials>({
    name: "",
    email: "",
    password: "",
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        // 🔹 User Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        const firebaseUid = userCredential.user.uid;
        await axios.post("/api/sync-user", { firebaseUid, email: credentials.email, name: credentials.name });
        router.push("/");
      } else {
        // 🔹 User Login
        const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
        const firebaseUid = userCredential.user.uid;

        // 🔹 Get User Role
        const response = await axios.post("/api/check-role", { email: credentials.email });

        if (response.data.role === "admin") {
          router.push("/add-movie");
        } else if (response.data.role === "user") {
          router.push("/");
        } else {
          setError("Unauthorized user role");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">{isSignUp ? "Sign Up" : "Log In"}</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={credentials.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
          {isSignUp ? "Sign Up" : "Log In"}
        </button>
      </form>

      <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-500 mt-4">
        {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
      </button>
    </div>
  );
}
