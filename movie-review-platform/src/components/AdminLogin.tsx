"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "@/styles/globals.css";
import axios from "axios";

interface AdminCredentials {
  id: string;
  email: string;
  password: string;
}

export default function AdminLogin() {
  const [credentials, setCredentials] = useState<AdminCredentials>({ id: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const firebaseUid = userCredential.user.uid;
      const email = userCredential.user.email;

      // Sync admin to PostgreSQL
      const response = await axios.post("/api/sync-admin", { id: credentials.id, firebaseUid, email });

      if (response.data.isAdmin) {
        // Store token and redirect
        const token = await userCredential.user.getIdToken();
        localStorage.setItem("token", token);
        router.push("/add-movie"); // Redirect to Admin Dashboard
      } else {
        setError("Unauthorized access");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">Admin Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="id"
          placeholder="Admin ID"
          value={credentials.id}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
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
          Login
        </button>
      </form>
    </div>
  );
}
