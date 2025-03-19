"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

interface Movie {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  posterUrl?: string;
}

export default function MoviesList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("/api/get-movie");
        setMovies(res.data);
      } catch (err) {
        setError("Failed to load movies.");
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Movies</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.id}`} className="h-full">
            <div className="border p-4 rounded-lg shadow-md hover:shadow-xl transition h-[500px] flex flex-col">
              {/* Image with 2:3 aspect ratio */}
              {movie.posterUrl && (
                <div className="relative w-full aspect-[2/3] overflow-hidden">
                  <Image 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Movie details */}
              <div className="flex-1 flex flex-col justify-between mt-2">
                <h2 className="text-xl font-semibold">{movie.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-3">{movie.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
