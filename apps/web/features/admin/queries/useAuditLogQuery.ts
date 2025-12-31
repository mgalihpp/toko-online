import { useQuery } from "@tanstack/react-query";
import {
  auditLogApi,
  type GetAuditLogsParams,
} from "@/lib/api/audit-log.api";

export const useAuditLogs = (params: GetAuditLogsParams) => {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => auditLogApi.getLogs(params),
  });
};

export const useAuditLog = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["audit-log", id],
    queryFn: () => auditLogApi.getLogById(id),
    enabled: !!id && enabled,
  });
};

export const useAuditActions = () => {
  return useQuery({
    queryKey: ["audit-logs", "actions"],
    queryFn: () => auditLogApi.getActions(),
  });
};
