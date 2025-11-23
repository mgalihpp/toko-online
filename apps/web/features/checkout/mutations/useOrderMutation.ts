import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: api.order.create,
    onError: (err) => {
      console.error("Gagal membuat pesanan", err);
    },
    onSuccess: (data) => {
      console.log("Berhasil membuat pesanan", data);
    },
  });
};
