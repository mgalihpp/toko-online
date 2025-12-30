"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Check, Clock, Eye, Star, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { DataTable } from "@/features/admin/components/data-table";
import { DataTableSkeleton } from "@/features/admin/components/data-table-skeleton";
import { ErrorAlert } from "@/features/admin/components/error-alert";
import {
  usePendingReviews,
  useUpdateReviewStatus,
} from "@/features/admin/queries/useReviewQuery";
import type { ReviewWithRelations } from "@/lib/api/review.api";
import { ReviewDetailDialog } from "../review-detail-dialog";

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

export default function PendingReviewsPage() {
  const { data: reviews, isPending, isError, refetch } = usePendingReviews();
  const updateStatusMutation = useUpdateReviewStatus();

  const [selectedReview, setSelectedReview] =
    useState<ReviewWithRelations | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const columns: ColumnDef<ReviewWithRelations>[] = [
    {
      accessorKey: "product.title",
      header: "Produk",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-[200px]">
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
        <p className="max-w-[300px] truncate text-sm text-muted-foreground">
          {row.original.body || "-"}
        </p>
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
            className="border-green-500 text-green-600 hover:bg-green-50"
            onClick={() =>
              updateStatusMutation.mutate({
                id: row.original.id,
                status: "approved",
              })
            }
            disabled={updateStatusMutation.isPending}
          >
            <Check className="h-4 w-4 mr-1" />
            Setujui
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-red-500 text-red-600 hover:bg-red-50"
            onClick={() =>
              updateStatusMutation.mutate({
                id: row.original.id,
                status: "rejected",
              })
            }
            disabled={updateStatusMutation.isPending}
          >
            <X className="h-4 w-4 mr-1" />
            Tolak
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Menunggu Persetujuan
        </h1>
        <p className="text-muted-foreground mt-2">
          Ulasan yang memerlukan persetujuan sebelum ditampilkan
        </p>
      </div>

      {/* Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-yellow-600 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Total Menunggu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-yellow-600">
            {reviews?.length || 0}
          </p>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Daftar Ulasan Menunggu
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <DataTableSkeleton columns={6} rows={5} />
          ) : isError ? (
            <ErrorAlert
              description="Gagal memuat data ulasan."
              action={() => refetch()}
            />
          ) : reviews?.length === 0 ? (
            <div className="text-center py-12">
              <Check className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p className="text-muted-foreground font-medium">
                Semua ulasan sudah diproses!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Tidak ada ulasan yang menunggu persetujuan
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
