import MovieDetails from "@/components/MovieDetails";
import Navbar from "@/components/Navbar";

export default function MoviePage() {
  return (
    <>
      <Navbar />
        <div className="container mx-auto">
          <MovieDetails />
        </div>
    </>
    );
}