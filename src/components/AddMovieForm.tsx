"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface Movie {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  posterUrl?: string;
  createdById: string; // Add this line
}

export default function AddMovieForm() {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [error, setError] = useState("");
  const [editMovie, setEditMovie] = useState<Movie | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not logged in");
          return;
        }

        const adminRes = await axios.get(`/api/check-admin?firebaseUid=${user.uid}`);

        if (adminRes.data.isAdmin) {
          setAdminId(adminRes.data.adminId);
          fetchMovies(adminRes.data.adminId);
        } else {
          setError("Access Denied: You are not an admin.");
          router.push("/");
        }
      } catch (error: unknown) { // Change 'any' to 'unknown'
        console.error("Error checking admin status:", error);
        setError("Failed to verify admin status.");
      }
    };

    fetchAdmin();
  }, [router]);

  const fetchMovies = async (adminId: string) => {
    try {
      const res = await axios.get(`/api/get-movie`);
      const adminMovies = res.data.filter((movie: Movie) => movie.createdById === adminId);
      setMovies(adminMovies);
    } catch (error: unknown) { // Change 'any' to 'unknown'
      console.error("Error fetching movies:", error);
      
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!adminId) {
      setError("Admin verification failed.");
      return;
    }

    try {
      await axios.post("/api/add-movie", {
        title,
        description,
        releaseDate,
        posterUrl,
        createdById: adminId,
      });

      setTitle("");
      setDescription("");
      setReleaseDate("");
      setPosterUrl("");
      fetchMovies(adminId);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || "Failed to add movie.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
    
  };

  const handleEditMovie = async () => {
    if (!editMovie) return;
    try {
      await axios.put(`/api/update-movie/${editMovie.id}`, {
        title: editMovie.title,
        description: editMovie.description,
        releaseDate: editMovie.releaseDate,
        posterUrl: editMovie.posterUrl,
      });

      setEditMovie(null);
      fetchMovies(adminId!);
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Card className="p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">🎬 Add New Movie</CardTitle>
        </CardHeader>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Movie Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Poster URL (optional)"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Add Movie
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-center">📽️ Your Added Movies</h2>
        {movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {movies.map((movie) => (
              <Card key={movie.id} className="overflow-hidden shadow-md hover:shadow-lg transition">
                {movie.posterUrl ? (
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    width={500}
                    height={600}
                    className="w-full h-60 object-cover"
                  />
                ) : (
                  <Skeleton className="w-full h-60" />
                )}
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{movie.title}</h3>
                  <p className="text-sm text-gray-600">{movie.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Release Date: {new Date(movie.releaseDate).toDateString()}
                  </p>
                  <Button
                    className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600"
                    onClick={() => setEditMovie(movie)}
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">No movies added yet.</p>
        )}
      </div>

      {/* Edit Movie Modal */}
      {editMovie && (
        <Dialog open={!!editMovie} onOpenChange={() => setEditMovie(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Movie</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              value={editMovie.title}
              onChange={(e) => setEditMovie({ ...editMovie, title: e.target.value })}
            />
            <Textarea
              value={editMovie.description}
              onChange={(e) => setEditMovie({ ...editMovie, description: e.target.value })}
            />
            <Input
              type="date"
              value={editMovie.releaseDate}
              onChange={(e) => setEditMovie({ ...editMovie, releaseDate: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Poster URL"
              value={editMovie.posterUrl}
              onChange={(e) => setEditMovie({ ...editMovie, posterUrl: e.target.value })}
            />
            <Button onClick={handleEditMovie} className="w-full bg-green-500 hover:bg-green-600">
              Save Changes
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
