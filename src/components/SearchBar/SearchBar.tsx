import { type FC, useRef } from "react";
import toast from "react-hot-toast";
import styles from "./SearchBar.module.css";

export interface SearchBarProps {
  onSubmit: (searchQuery: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSubmit }) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormAction = (formData: FormData) => {
    // Отримуємо значення поля 'query' за його атрибутом name
    const query = formData.get("query") as string;
    const trimmedQuery = query.trim();

    // Валідація
    if (!trimmedQuery) {
      toast.error("Будь ласка, введіть свій пошуковий запит.");
      return;
    }

    onSubmit(trimmedQuery);

    formRef.current?.reset();
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

        <form action={handleFormAction} className={styles.form} ref={formRef}>
          <input
            className={styles.input}
            type="text"
            name="query"
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
