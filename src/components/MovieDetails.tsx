import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

interface Review {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  user: { name?: string };
}

interface Movie {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  posterUrl?: string;
  reviews: Review[];
}

export default function MovieDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (id) {
      axios.get(`/api/movies/${id}`).then((res) => setMovie(res.data));
    }
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{movie.title}</h1>
      {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} className="w-full h-96 object-cover my-4" />}
      <p>{movie.description}</p>
      <p className="text-gray-500 mt-2">Release Date: {new Date(movie.releaseDate).toDateString()}</p>

      <Link href={`/movies/${movie.id}/review`} className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Add Review
      </Link>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {movie.reviews.length > 0 ? (
          movie.reviews.map((review) => (
            <div key={review.id} className="border p-3 rounded my-2">
              <p>{review.content}</p>
              <p className="text-sm text-gray-600">Rating: {review.rating}/5</p>
              <p className="text-sm text-gray-600">By: {review.user.name || "Anonymous"}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
