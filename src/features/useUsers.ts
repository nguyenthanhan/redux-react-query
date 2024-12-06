// itemsAPI.ts

import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import { GenericListResponse, User, UserPayload, UserQuery } from "./types";

//------------------------------------------------------------------

export const useFetchUsers = (query: UserQuery) => {
  return useInfiniteQuery<GenericListResponse<User>, Error>({
    queryKey: ["users"],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get<GenericListResponse<User>>(
        "/users",
        {
          params: { ...query, page: pageParam },
        }
      );
      return {
        results: response.data.results,
        meta: response.data.meta,
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, UserPayload>({
    mutationFn: async (newUser) => {
      const response = await apiClient.post<User>("/users", newUser);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, User>({
    mutationFn: async (updatedItem) => {
      const response = await apiClient.put<User>(
        `/users/${updatedItem.id}`,
        updatedItem
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/users/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
