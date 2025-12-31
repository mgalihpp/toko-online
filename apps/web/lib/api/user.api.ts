import axios from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  phone?: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface UsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const userApi = {
  getUsers: async (params: GetUsersParams): Promise<UsersResponse> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.search) searchParams.set("search", params.search);
    if (params.role) searchParams.set("role", params.role);

    const res = await axios.get<ApiResponse<UsersResponse>>(
      `/users?${searchParams.toString()}`
    );
    return res.data.data;
  },

  updateRole: async (id: string, role: string): Promise<User> => {
    const res = await axios.patch<ApiResponse<User>>(`/users/${id}/role`, {
      role,
    });
    return res.data.data;
  },
};
