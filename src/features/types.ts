export interface User {
  id: number;
  name: string;
  email: string;
  city: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export type UserPayload = {
  name: string;
  email: string;
  city: string;
  role: string;
};

export type UserQuery = {
  page: number;
  limit: number;
  keyword?: string;
};

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface GenericListResponse<T> {
  meta: Pagination;
  results: T[];
}
