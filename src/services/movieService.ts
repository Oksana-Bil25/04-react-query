import axios from "axios";
import type { MovieApiResponse } from "../types/movie";

const API_KEY = "import.meta.env.VITE_TMDB_API_KEY";

const BASE_URL = "https://api.themoviedb.org/3";

const tmdbApi = axios.create({
  baseURL: BASE_URL,
});

export const getFullImageUrl = (
  path: string | null,
  size: "w500" | "original" = "w500"
): string => {
  if (!path) {
    return `https://placehold.co/1280x720/cccccc/333333?text=No+Image`;
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const fetchMovies = async (
  query: string,
  page: number
): Promise<MovieApiResponse> => {
  if (!query) {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }

  const response = await tmdbApi.get<MovieApiResponse>("/search/movie", {
    params: {
      api_key: API_KEY,
      query,
      page,
      include_adult: false,
      language: "uk-UA",
    },
  });

  return response.data;
};
