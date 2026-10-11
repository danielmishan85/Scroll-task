import type { Show } from "../types";

type ShowsListProps = {
  shows: Show[];
  isLoading: boolean;
};

export function ShowsList({ shows, isLoading }: ShowsListProps) {
  // Show an empty state when no results were found
  if (!isLoading && shows.length === 0) {
    return <div style={{ marginTop: "50px" }}>No shows found.</div>;
  }

  return (
    <ul>
      {shows.map((show) => (
        <li
          key={show.id}
          style={{
            paddingBlock: "12px",
            fontSize: "16px",
          }}
        >
          <strong>{show.name}</strong> — {show.genres}
        </li>
      ))}
    </ul>
  );
}
