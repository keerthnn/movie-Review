import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddMovieForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("/api/movies", { title, description, releaseDate, posterUrl, createdById: "admin-id" });
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add Movie</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <Input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required />
            <Input type="text" placeholder="Poster URL" value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} />
            <Button type="submit" className="w-full">Add Movie</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
