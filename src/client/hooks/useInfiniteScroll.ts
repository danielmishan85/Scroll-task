import { useEffect } from "react";

type UseInfiniteScrollOptions = {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
};

export function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
  threshold = 50,
}: UseInfiniteScrollOptions) {
  useEffect(() => {
    // Avoid listening for scroll events when another page cannot be loaded
    if (loading || !hasMore) return;

    const handleScroll = () => {
      const pageBottom = window.innerHeight + window.scrollY;
      const isNearBottom =
        pageBottom + threshold >= document.documentElement.scrollHeight;

      if (isNearBottom) {
        onLoadMore();
      }
    };

    // Passive listeners keep scrolling smooth because they never call preventDefault
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Load another page when the current results do not fill the viewport.
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, onLoadMore, threshold]);
}
