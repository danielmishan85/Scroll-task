import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // פונקציית שליפת הנתונים מהשרת שלנו
  const fetchShows = async (query, pageNum, isNewSearch = false) => {
    if (!query) {
      setShows([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`/api/shows`, {
        params: { q: query, page: pageNum, limit: 10 },
      });

      if (isNewSearch) {
        setShows(res.data.data);
      } else {
        setShows((prev) => [...prev, ...res.data.data]);
      }

      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 1. הבונוס: Debounce בחיפוש (המחשב מחכה 500ms מאז שהפסקת להקליד)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchShows(searchTerm, 1, true);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 2. טעינת העמוד הבא כש-page גדל (אבל לא בחיפוש חדש)
  useEffect(() => {
    if (page > 1) {
      fetchShows(searchTerm, page, false);
    }
  }, [page]);

  // 3. זיהוי גלילה לתחתית העמוד עבור Infinite Scroll
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const isBottom =
      window.innerHeight + document.documentElement.scrollTop + 50 >=
      document.documentElement.offsetHeight;

    if (isBottom) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h2>TV Show Search</h2>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Search for a show..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      />

      {/* Results List */}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {shows.map((show, index) => (
          <li
            key={`${show.id}-${index}`}
            style={{ padding: "8px 0", borderBottom: "1px solid #ccc" }}
          >
            <strong>{show.name}</strong>: {show.genres || "No genres listed"}
          </li>
        ))}
      </ul>

      {/* Loader */}
      {loading && (
        <p style={{ textAlign: "center", fontWeight: "bold" }}>Loading...</p>
      )}

      {!loading && shows.length === 0 && searchTerm && (
        <p style={{ textAlign: "center" }}>No results found.</p>
      )}
    </div>
  );
}
