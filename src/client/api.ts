import type { ApiResponse } from "./types";

export abstract class ShowsApi {
  private static readonly BASE_URL = "http://localhost:3000";

  static async fetchShows(
    query: string,
    page: number,
    limit = 10,
  ): Promise<ApiResponse> {
    const params = new URLSearchParams({
      q: query,
      page: String(page),
      limit: String(limit),
    });
    const response = await fetch(`${ShowsApi.BASE_URL}/api/shows?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
