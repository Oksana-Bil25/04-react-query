import axios from "axios";
import type { MovieApiResponse } from "../types/movie";

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYWM0N2ZiOWJiNjEyOGMxNzJhMDE5MmQ4ZmM0Y2UwZSIsIm5iZiI6MTc2Mjg1NzQ3OS41MDQ5OTk5LCJzdWIiOiI2OTEzMTIwN2QwNDUwZmEzMDYzYTM2N2QiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.nj1JlhrOTDtXhfIzto7u-bT3TnRsFvIDvapvJ2BAiMQ";

const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  },
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
      query,
      page,
      include_adult: false,
      language: "uk-UA",
    },
  });

  return response.data;
};
