import { useCallback, useEffect, useMemo, useState } from "react";
import { ShowsApi } from "../api";
import type { Show } from "../types";
import { useDebounce } from "./useDebounce";

export function useShows(query: string, pageSize = 10, debounceDelay = 500) {
  const [shows, setShows] = useState<Show[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const searchTerm = useMemo(() => query.trim(), [query]);

  const debouncedValue = useDebounce(searchTerm, 500);

  // Wait until the user stops typing before starting a new search
  useEffect(() => {
    // Reset the results when the search input is empty
    if (!debouncedValue) {
      setIsLoading(false);
      setShows([]);
      setPage(1);
      setHasMore(false);
      return;
    }

    setIsLoading(true);

    ShowsApi.fetchShows(debouncedValue, 1, pageSize)
      .then((result) => {
        setShows(result.data);
        setPage(1);
        setHasMore(result.hasMore);
      })
      .catch((requestError) => {
        console.error("Failed to fetch shows:", requestError);
      })
      .finally(() => setIsLoading(false));
  }, [debouncedValue, pageSize, debounceDelay]);

  // Fetch and append the next page without replacing existing results
  const loadMore = useCallback(async () => {
    if (!debouncedValue || isLoading || !hasMore) return;

    const nextPage = page + 1;
    setIsLoading(true);
    try {
      const result = await ShowsApi.fetchShows(
        debouncedValue,
        nextPage,
        pageSize,
      );

      setShows((currentShows) => [...currentShows, ...result.data]);
      setPage(nextPage);
      setHasMore(result.hasMore);
    } catch (requestError) {
      console.error("Failed to fetch shows:", requestError);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedValue, page, pageSize, isLoading, hasMore]);

  return { shows, isLoading, hasMore, loadMore };
}
