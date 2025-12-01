import { useState, type FC } from "react";
import toast from "react-hot-toast";
import styles from "./SearchBar.module.css";

export interface SearchBarProps {
  onSubmit: (searchQuery: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = inputValue.trim();

    if (!query) {
      toast.error("Будь ласка, введіть свій пошуковий запит.");
      return;
    }

    onSubmit(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            type="text"
            name="query"
            value={inputValue}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Шукати фільми..."
            autoFocus
          />
          <button className={styles.button} type="submit">
            Шукати
          </button>
        </form>
      </div>
    </header>
  );
};

export default SearchBar;
