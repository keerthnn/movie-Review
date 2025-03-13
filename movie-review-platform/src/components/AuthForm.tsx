"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "@/styles/globals.css";

interface UserCredentials {
  id?: string;
  name?: string;
  email: string;
  password: string;
}

export default function AuthForm() {
  const [credentials, setCredentials] = useState<UserCredentials>({
    id: "",
    name: "",
    email: "",
    password: "",
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isAdmin) {
        // 🔹 Admin login: Verify in PostgreSQL, no Firebase auth
        const response = await axios.post("/api/auth-admin", {
          id: credentials.id,
          email: credentials.email,
          password: credentials.password,
        });

        const { token } = response.data;
        localStorage.setItem("token", token);
        router.push("/add-movie"); // Redirect Admin
      } else {
        // 🔹 User Login
        let userCredential;

        if (isSignUp) {
          // Sign up new user in Firebase
          userCredential = await createUserWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
        } else {
          // Check if user exists in PostgreSQL **before attempting Firebase login**
          const userExists = await axios.post("/api/check-user", {
            email: credentials.email,
          });

          if (!userExists.data.exists) {
            throw new Error("User does not exist. Please sign up first.");
          }

          // Proceed with Firebase login
          userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
        }

        const firebaseUid = userCredential.user.uid;
        const email = userCredential.user.email;
        const name = isSignUp ? credentials.name : undefined;

        // Sync only if signing up
        if (isSignUp) {
          await axios.post("/api/sync-user", { firebaseUid, email, name });
        }

        // Store token and redirect
        const token = await userCredential.user.getIdToken();
        localStorage.setItem("token", token);
        

        const userIdResponse = await axios.post("/api/get-user-id", {
          email: credentials.email,
        });
        const userId = userIdResponse.data.userId;

        console.log("User ID:", userId);

        // 🔹 Store user ID in localStorage if needed
        localStorage.setItem("userId", userId);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">
        {isAdmin ? "Admin Login" : isSignUp ? "User Sign Up" : "User Log In"}
      </h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isAdmin && (
          <input
            type="text"
            name="id"
            placeholder="Admin ID"
            value={credentials.id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        )}
        {!isAdmin && isSignUp && (
          <input
            type="text"
            name="name"
            placeholder="Name"
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
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded"
        >
          {isAdmin ? "Admin Log In" : isSignUp ? "Sign Up" : "Log In"}
        </button>
      </form>

      {!isAdmin && (
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 mt-2"
        >
          {isSignUp
            ? "Already have an account? Log in"
            : "Don't have an account? Sign up"}
        </button>
      )}

      <button
        onClick={() => setIsAdmin(!isAdmin)}
        className="text-gray-500 mt-2 block"
      >
        {isAdmin ? "Switch to User Login" : "Admin Login"}
      </button>
    </div>
  );
}
