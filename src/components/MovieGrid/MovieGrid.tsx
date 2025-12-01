import React from "react";
import { type Movie } from "../../types/movie";
import { getFullImageUrl } from "../../services/movieService";
import styles from "./MovieGrid.module.css";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, onSelect }) => {
  return (
    <ul className={styles.grid}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <button
            type="button"
            className={styles.card}
            onClick={() => onSelect(movie)}
            aria-label={`Open details for ${movie.title}`}
          >
            <img
              className={styles.image}
              src={getFullImageUrl(movie.poster_path, "w500")}
              alt={movie.title}
              loading="lazy"
            />
            <h2 className={styles.title}>{movie.title}</h2>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default MovieGrid;
