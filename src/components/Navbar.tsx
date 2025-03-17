"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged, User } from "firebase/auth"; // Import User type
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        sessionStorage.setItem("loggedIn", "true");
      } else {
        setUser(null);
        sessionStorage.removeItem("loggedIn");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem("loggedIn");
    setUser(null); // Ensure UI updates immediately
    router.push("/");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        MovieReview
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm sm:text-base">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="px-4 py-2 bg-blue-600 rounded">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
