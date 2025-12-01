import React, { useEffect, useCallback, type FC } from "react";
import { createPortal } from "react-dom";
import { type Movie } from "../../types/movie";
import { getFullImageUrl } from "../../services/movieService";
import styles from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const modalRoot = document.getElementById("modal-root");
if (!modalRoot) {
  const newModalRoot = document.createElement("div");
  newModalRoot.setAttribute("id", "modal-root");
  document.body.appendChild(newModalRoot);
}

const MovieModal: FC<MovieModalProps> = ({ movie, onClose }) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const handleBackdropClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (evt.target === evt.currentTarget) onClose();
  };

  const backdropPath = getFullImageUrl(movie.backdrop_path, "original");
  const rating = movie.vote_average.toFixed(1);

  return createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        <img src={backdropPath} alt={movie.title} className={styles.image} />
        <div className={styles.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {rating}/10
          </p>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
};

export default MovieModal;
