import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ReviewForm() {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("/api/reviews", { content, rating, movieId: id, userId: "user-id" });
    router.push(`/movies/${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Add Review</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea placeholder="Your Review" value={content} onChange={(e) => setContent(e.target.value)} required className="border p-2 w-full" />
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border p-2 w-full">
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} Stars
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit Review</button>
      </form>
    </div>
  );
}
