"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "@/styles/globals.css";


export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    router.push("/"); // Redirect to login page
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        MovieReview
      </Link>

      <div>
        {user ? (
          <div className="relative group">
            <button className="px-4 py-2 bg-gray-700 rounded">
              {user.email}
            </button>
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-200 w-full text-left">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <Link href="/login" className="px-4 py-2 bg-blue-600 rounded">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
