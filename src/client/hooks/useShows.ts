import { useCallback, useEffect, useState } from "react";
import { ShowsApi } from "../api";
import type { Show } from "../types";

export function useShows(query: string, pageSize = 10, debounceDelay = 500) {
  const [shows, setShows] = useState<Show[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const searchTerm = query.trim();

  // Wait until the user stops typing before starting a new search
  useEffect(() => {
    setIsLoading(false);

    // Reset the results when the search input is empty
    if (!searchTerm) {
      setShows([]);
      setPage(1);
      setHasMore(false);
      return;
    }

    const debounceTimer = window.setTimeout(async () => {
      setIsLoading(true);

      try {
        const result = await ShowsApi.fetchShows(searchTerm, 1, pageSize);

        setShows(result.data);
        setPage(1);
        setHasMore(result.hasMore);
      } catch (requestError) {
        console.error("Failed to fetch shows:", requestError);
      } finally {
        setIsLoading(false);
      }
    }, debounceDelay);

    // Cancel the previous timer when the user types another character
    return () => window.clearTimeout(debounceTimer);
  }, [searchTerm, pageSize, debounceDelay]);

  // Fetch and append the next page without replacing existing results
  const loadMore = useCallback(async () => {
    if (!searchTerm || isLoading || !hasMore) return;

    const nextPage = page + 1;
    setIsLoading(true);

    try {
      const result = await ShowsApi.fetchShows(searchTerm, nextPage, pageSize);

      setShows((currentShows) => [...currentShows, ...result.data]);
      setPage(nextPage);
      setHasMore(result.hasMore);
    } catch (requestError) {
      console.error("Failed to fetch shows:", requestError);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, page, pageSize, isLoading, hasMore]);

  return { shows, isLoading, hasMore, loadMore };
}
