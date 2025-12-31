import axios from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export interface AuditLogUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  user?: AuditLogUser | null;
  action: string;
  object_type: string;
  object_id: string;
  metadata: any;
  created_at: string;
}

export interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  user_id?: string;
  type?: "user" | "system";
  start_date?: string;
  end_date?: string;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const auditLogApi = {
  getLogs: async (params: GetAuditLogsParams): Promise<AuditLogsResponse> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.search) searchParams.set("search", params.search);
    if (params.action) searchParams.set("action", params.action);
    if (params.user_id) searchParams.set("user_id", params.user_id);
    if (params.type) searchParams.set("type", params.type);
    if (params.start_date) searchParams.set("start_date", params.start_date);
    if (params.end_date) searchParams.set("end_date", params.end_date);

    const res = await axios.get<ApiResponse<AuditLogsResponse>>(
      `/audit-logs?${searchParams.toString()}`
    );
    return res.data.data;
  },

  getLogById: async (id: string): Promise<AuditLog> => {
    const res = await axios.get<ApiResponse<AuditLog>>(`/audit-logs/${id}`);
    return res.data.data;
  },

  getActions: async (): Promise<string[]> => {
    const res = await axios.get<ApiResponse<string[]>>(`/audit-logs/actions`);
    return res.data.data;
  },
};
