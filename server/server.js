const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// הגדרת CORS חופשית למניעת חסימות בדפדפן
app.use(cors());
app.use(express.json());

app.get("/api/shows", async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q || !q.trim()) {
      return res.json({ data: [], hasMore: false, total: 0 });
    }

    // פנייה ל-TVmaze עם User-Agent תקין למניעת 403 Forbidden
    const response = await axios.get(
      `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      },
    );

    const allResults = response.data || [];

    // פורמט הנתונים המבוקש: name: (genres separated by commas)
    const formattedShows = allResults.map((item) => ({
      id: item.show?.id ?? Math.random(),
      name: item.show?.name ?? "Unknown",
      genres:
        item.show?.genres && item.show.genres.length > 0
          ? item.show.genres.join(", ")
          : "No genres listed",
    }));

    // Pagination בשרת
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedData = formattedShows.slice(startIndex, endIndex);
    const hasMore = endIndex < formattedShows.length;

    return res.json({
      data: paginatedData,
      hasMore,
      total: formattedShows.length,
    });
  } catch (error) {
    console.error("Error fetching TVmaze:", error.message);
    return res.status(500).json({ error: "Failed to fetch show data" });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
