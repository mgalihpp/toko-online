"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { AlertTriangle, Check, Eye, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { DataTable } from "@/features/admin/components/data-table";
import { DataTableSkeleton } from "@/features/admin/components/data-table-skeleton";
import { ErrorAlert } from "@/features/admin/components/error-alert";
import {
  useClearReviewReport,
  useDeleteReview,
  useReportedReviews,
} from "@/features/admin/queries/useReviewQuery";
import type { ReviewWithRelations } from "@/lib/api/review.api";
import { ReviewDetailDialog } from "../review-detail-dialog";

const statusLabels: Record<string, string> = {
  approved: "Disetujui",
  rejected: "Ditolak",
  pending: "Menunggu",
};

const statusColors: Record<string, string> = {
  approved: "bg-green-500/20 text-green-600 border-green-500/30",
  rejected: "bg-red-500/20 text-red-600 border-red-500/30",
  pending: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReportedReviewsPage() {
  const { data: reviews, isPending, isError, refetch } = useReportedReviews();
  const clearReportMutation = useClearReviewReport();
  const deleteMutation = useDeleteReview();

  const [selectedReview, setSelectedReview] =
    useState<ReviewWithRelations | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const columns: ColumnDef<ReviewWithRelations>[] = [
    {
      accessorKey: "product.title",
      header: "Produk",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-[180px]">
          {row.original.product.product_images[0] && (
            <Image
              src={row.original.product.product_images[0].url}
              alt={row.original.product.title}
              width={40}
              height={40}
              className="rounded-md object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{row.original.product.title}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "user.name",
      header: "Pelanggan",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.user.name}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.user.email}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => <RatingStars rating={row.original.rating} />,
    },
    {
      accessorKey: "body",
      header: "Ulasan",
      cell: ({ row }) => (
        <p className="max-w-[200px] truncate text-sm text-muted-foreground">
          {row.original.body || "-"}
        </p>
      ),
    },
    {
      accessorKey: "report_reason",
      header: "Alasan Laporan",
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="max-w-[150px] truncate text-sm text-orange-600 cursor-help">
                {row.original.report_reason || "(Tidak ada alasan)"}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[300px]">
                {row.original.report_reason ||
                  "Tidak ada alasan yang diberikan"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={statusColors[row.original.status]}>
          {statusLabels[row.original.status] || row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Tanggal",
      cell: ({ row }) =>
        format(new Date(row.original.created_at), "dd MMM yyyy", {
          locale: id,
        }),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedReview(row.original);
              setDetailOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearReportMutation.mutate(row.original.id)}
            disabled={clearReportMutation.isPending}
          >
            <Check className="h-4 w-4 mr-1" />
            Abaikan
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm("Apakah Anda yakin ingin menghapus ulasan ini?")) {
                deleteMutation.mutate(row.original.id);
              }
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Ulasan Dilaporkan
        </h1>
        <p className="text-muted-foreground mt-2">
          Ulasan yang dilaporkan oleh pengguna dan memerlukan tindakan
        </p>
      </div>

      {/* Stats */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-600 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Total Dilaporkan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-orange-600">
            {reviews?.length || 0}
          </p>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Daftar Ulasan Dilaporkan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <DataTableSkeleton columns={8} rows={5} />
          ) : isError ? (
            <ErrorAlert
              description="Gagal memuat data ulasan."
              action={() => refetch()}
            />
          ) : reviews?.length === 0 ? (
            <div className="text-center py-12">
              <Check className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p className="text-muted-foreground font-medium">
                Tidak ada ulasan yang dilaporkan!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Semua ulasan dalam kondisi baik
              </p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={reviews ?? []}
              searchPlaceholder="Cari produk atau pelanggan..."
              searchKey={["product.title", "user.name", "user.email"]}
            />
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <ReviewDetailDialog
        review={selectedReview}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
