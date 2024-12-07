// itemsAPI.ts

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import { GenericListResponse, User, UserPayload, UserQuery } from "./types";

//------------------------------------------------------------------

export const useFetchUsers = (query: UserQuery) => {
  return useQuery<GenericListResponse<User>, Error>({
    queryKey: ["users", query.page, query.limit],
    queryFn: async () => {
      const response = await apiClient.get<GenericListResponse<User>>(
        "/users",
        {
          params: {
            page: query.page,
            limit: query.limit,
          },
        }
      );
      return {
        results: response.data.results,
        meta: response.data.meta,
      };
    },
  });
};

export const useAddUser = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, UserPayload>({
    mutationFn: async (newUser) => {
      const response = await apiClient.post<User>("/users", newUser);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
    },
  });
};

export const useUpdateUser = ({ onSuccess }: { onSuccess?: () => void }) => {
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
      onSuccess?.();
    },
  });
};

export const useDeleteUser = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/users/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
    },
  });
};
