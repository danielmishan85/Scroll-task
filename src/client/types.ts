export type Show = {
  id: number;
  name: string;
  genres: string;
};

export type ApiResponse = {
  data: Show[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};
