"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";

interface UserCredentials {
  email: string;
  password: string;
}

export default function AuthForm() {
  const [credentials, setCredentials] = useState<UserCredentials>({ email: "", password: "" });
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
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      }

      const firebaseUid = userCredential.user.uid;
      const email = userCredential.user.email;

      // Sync user to PostgreSQL
      await axios.post("/api/sync-user", { firebaseUid, email });

      // Store token and redirect
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      router.push("/"); // Redirect to MoviesList
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">{isSignUp ? "Sign Up" : "Log In"}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
      <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-500 mt-2">
        {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
      </button>
    </div>
  );
}
