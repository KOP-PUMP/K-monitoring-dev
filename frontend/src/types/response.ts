export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface FetchDataResponse<T> {
  data: T | null;
  error?: string;
}
