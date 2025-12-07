import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import {
  fetchMovies,
  type MovieApiResponse,
} from "../../services/movieService";
import type { Movie } from "../../types/movie";

import styles from "./App.module.css";

const initialData: MovieApiResponse = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const { data, isLoading, isError, isFetching } = useQuery<MovieApiResponse>({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: !!searchQuery,

    placeholderData: (previousData: MovieApiResponse | undefined) =>
      previousData ?? initialData,
    staleTime: 1000 * 60 * 5,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (
      !isLoading &&
      !isFetching &&
      data &&
      data.results.length === 0 &&
      searchQuery
    ) {
      toast.error(`No results found for "${searchQuery}". Try another query.`);
    }
  }, [data, isLoading, isFetching, searchQuery]);

  let content;

  if (isLoading && !isFetching) {
    content = <Loader />;
  } else if (isError) {
    content = <ErrorMessage />;
  } else if (movies.length === 0 && !searchQuery) {
    content = null;
  } else if (movies.length === 0 && searchQuery) {
    content = (
      <p className={styles.noResultsMessage}>
        No movies found for "{searchQuery}".
      </p>
    );
  } else {
    content = <MovieGrid movies={movies} onSelect={openModal} />;
  }

  const paginationComponent =
    totalPages > 1 ? (
      <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={handlePageChange}
        forcePage={page - 1}
        containerClassName={styles.pagination}
        activeClassName={styles.active}
        nextLabel="→"
        previousLabel="←"
      />
    ) : null;

  return (
    <div className={styles.wrapper}>
      <Toaster position="top-right" reverseOrder={false} />

      <SearchBar onSubmit={handleSearch} />

      {paginationComponent}

      {content}

      {isFetching && !isLoading && (
        <p className={styles.fetchingMessage}>Updating results...</p>
      )}

      {paginationComponent}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
};

export default App;
