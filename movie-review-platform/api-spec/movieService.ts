import prisma from "@/lib/prisma";

export async function createMovie(
  title: string,
  description: string,
  releaseDate: string,
  posterUrl: string,
  createdById: number
) {
  try {
    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        releaseDate: new Date(releaseDate),
        posterUrl,
        createdById: createdById.toString(),
      },
    });
    return movie;
  } catch (error) {
    console.error("Error creating movie:", error);
    throw new Error("Failed to create movie");
  }
}

export async function getMovies() {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        reviews: true,
      },
    });
    return movies;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw new Error("Failed to fetch movies");
  }
}
