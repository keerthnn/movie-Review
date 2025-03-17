import MoviesList from "@/components/MoviesList";
import Navbar from "@/components/Navbar";

export default function MoviesPage() {
  return (
    <>
    <Navbar />
      <div className="container mx-auto">
        <MoviesList />
      </div>
      </>
  );
}
