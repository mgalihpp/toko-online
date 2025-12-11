import axios from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { UserWithRelations } from "@/types/index";

export const customerApi = {
  getAll: async () => {
    const res = await axios.get<ApiResponse<UserWithRelations[]>>(`/customers`);
    const { data } = res.data;
    return data;
  },

  getById: async (customerId: string) => {
    const res = await axios.get<ApiResponse<UserWithRelations>>(
      `/customers/${customerId}`,
    );
    const { data } = res.data;
    return data;
  },
};
