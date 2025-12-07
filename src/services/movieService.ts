// src/services/movieService.ts

import axios from "axios";
// 💡 Примітка: Імпортуємо тільки Movie з файлу типів. MovieApiResponse оголошуємо тут.
import type { Movie } from "../types/movie";

// =========================================================================
// 1. Інтерфейс відповіді API (Розміщений тут, а не в types/movie.ts)
// =========================================================================

export interface MovieApiResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// =========================================================================
// 2. Конфігурація та допоміжні функції
// =========================================================================

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

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

// =========================================================================
// 3. Основна функція запиту
// =========================================================================

export const fetchMovies = async (
  query: string,
  page: number
): Promise<MovieApiResponse> => {
  if (!query) {
    // Повертаємо пусту відповідь, якщо запит порожній
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
