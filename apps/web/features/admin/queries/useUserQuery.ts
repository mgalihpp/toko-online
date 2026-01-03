import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type GetUsersParams, userApi } from "@/lib/api/user.api";

export const useUsers = (params: GetUsersParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.getUsers(params),
    refetchOnWindowFocus: false,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      userApi.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Role pengguna berhasil diperbarui");
    },
    onError: (error) => {
      toast.error("Gagal memperbarui role pengguna");
      console.error(error);
    },
  });
};
