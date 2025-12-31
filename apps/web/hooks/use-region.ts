import { useQuery } from "@tanstack/react-query";
import {
  getProvinces,
  getRegencies,
  type Province,
  type Regency,
} from "@/lib/api/region.api";

/**
 * Convert UPPERCASE text to Title Case
 * "JAWA BARAT" → "Jawa Barat"
 * "KAB. TANGERANG" → "Kab. Tangerang"
 */
const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Hook untuk fetch semua provinsi di Indonesia
 */
export const useProvinces = () => {
  return useQuery<Province[]>({
    queryKey: ["provinces"],
    queryFn: async () => {
      const data = await getProvinces();
      return data.map((p) => ({ ...p, name: toTitleCase(p.name) }));
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 jam (data jarang berubah)
  });
};

/**
 * Hook untuk fetch kota/kabupaten berdasarkan ID provinsi
 */
export const useRegencies = (provinceId: string | null) => {
  return useQuery<Regency[]>({
    queryKey: ["regencies", provinceId],
    queryFn: async () => {
      const data = await getRegencies(provinceId!);
      return data.map((r) => ({ ...r, name: toTitleCase(r.name) }));
    },
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 60 * 24, // 24 jam
  });
};
