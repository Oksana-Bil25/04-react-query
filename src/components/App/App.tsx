import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { useQuery } from "@tanstack/react-query";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import { fetchMovies } from "../../services/movieService";
import type { Movie, MovieApiResponse } from "../../types/movie";

import styles from "./App.module.css";

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const { data, isLoading, isError, isFetching } = useQuery<MovieApiResponse>({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: !!searchQuery,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  const paginationComponent = totalPages > 1 && (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => setPage(selected + 1)}
      forcePage={page - 1}
      containerClassName={styles.pagination}
      activeClassName={styles.active}
      nextLabel="→"
      previousLabel="←"
    />
  );

  return (
    <div className={styles.wrapper}>
      <SearchBar onSubmit={handleSearch} />

      {paginationComponent}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isFetching && !isLoading && <Loader />}
      {!isLoading && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}
      {paginationComponent}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default App;
