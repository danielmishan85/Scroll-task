import { useState } from "react";
import { SearchInput } from "./components/SearchInput";
import { ShowsList } from "./components/ShowsList";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { useShows } from "./hooks/useShows";

export function App() {
  const [searchInputValue, setSearchInputValue] = useState<string>("");

  // Fetch shows for the current search and manage loading and pagination
  const { shows, isLoading, hasMore, loadMore } = useShows(searchInputValue);

  // Load the next page when the user reaches the bottom of the page
  useInfiniteScroll({ loading: isLoading, hasMore, onLoadMore: loadMore });

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h2>TV Shows Search</h2>
      <SearchInput
        placeholder="Search for a show..."
        value={searchInputValue}
        onChange={(event) => setSearchInputValue(event.target.value)}
      />

      <ShowsList shows={shows} isLoading={isLoading} />

      {/* Keep existing results visible while the next page loads */}
      {isLoading && (
        <div
          style={{
            marginTop: "50px",
          }}
        >
          Loading...
        </div>
      )}
    </div>
  );
}
