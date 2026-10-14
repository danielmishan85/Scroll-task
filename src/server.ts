import express from "express";
import cors from "cors";

type TvmazeItem = {
  show: {
    id: number;
    name: string;
    genres: string[];
  };
};

type FormattedShow = {
  id: number;
  name: string;
  genres: string;
};

const app = express();
let results;

app.use(cors());
app.use(express.json());

//Fetch data from TVmaze API
app.get("/api/shows", async (req, res) => {
  try {
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const page = Math.max(1, Number(req.query.page) ?? 1);
    const limit = Math.max(1, Number(req.query.limit) ?? 10);

    if (!query) {
      return res.json({ data: [], page, limit, total: 0, hasMore: false });
    }

    const response: Response = await fetch(
      `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
      console.error(`TVmaze responded with status ${response.status}`);
      return res
        .status(502)
        .json({ error: "Failed to fetch show data from TVmaze" });
    }

    results = await response.json();

    if (!Array.isArray(results)) {
      results = [];
    }

    //format results
    let data: FormattedShow[] = results.map((item: TvmazeItem) => {
      return {
        id: item.show.id ?? Math.floor(Math.random() * 100_000),
        name: item.show.name ?? "Unknown",
        genres:
          item.show.genres && item.show.genres.length > 0
            ? item.show.genres.join(", ")
            : "No genres.",
      };
    });

    data = [
      ...data,
      ...data,
      ...data,
      ...data,
      ...data,
      ...data,
      ...data,
      ...data,
      ...data,
      ...data,
    ];

    //Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedData = data.slice(startIndex, endIndex);
    const hasMore = endIndex < data.length;

    return res.json({
      data: paginatedData,
      page,
      limit,
      total: data.length,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching TVmaze:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch show data from TVmaze" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
