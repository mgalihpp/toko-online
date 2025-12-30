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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  AlertTriangle,
  Check,
  Eye,
  MessageSquare,
  MoreHorizontal,
  Star,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { DataTable } from "@/features/admin/components/data-table";
import { DataTableSkeleton } from "@/features/admin/components/data-table-skeleton";
import { ErrorAlert } from "@/features/admin/components/error-alert";
import {
  useDeleteReview,
  useReviewStats,
  useReviews,
  useUpdateReviewStatus,
} from "@/features/admin/queries/useReviewQuery";
import type { ReviewWithRelations } from "@/lib/api/review.api";
import { ReviewDetailDialog } from "./review-detail-dialog";

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

export default function ReviewsPage() {
  const { data: reviews, isPending, isError, refetch } = useReviews();
  const { data: stats } = useReviewStats();
  const updateStatusMutation = useUpdateReviewStatus();
  const deleteMutation = useDeleteReview();

  const [selectedReview, setSelectedReview] =
    useState<ReviewWithRelations | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const filteredReviews = useMemo(() => {
    if (!reviews) return [];
    if (activeTab === "all") return reviews;
    return reviews.filter((r) => r.status === activeTab);
  }, [reviews, activeTab]);

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
        <p className="max-w-[200px] truncate text-sm text-muted-foreground">
          {row.original.body || "-"}
        </p>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge className={statusColors[row.original.status]}>
            {statusLabels[row.original.status] || row.original.status}
          </Badge>
          {row.original.is_reported && (
            <Badge className="bg-orange-500/20 text-orange-600 border-orange-500/30">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Dilaporkan
            </Badge>
          )}
        </div>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedReview(row.original);
                setDetailOpen(true);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Lihat Detail
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {row.original.status !== "approved" && (
              <DropdownMenuItem
                onClick={() =>
                  updateStatusMutation.mutate({
                    id: row.original.id,
                    status: "approved",
                  })
                }
              >
                <Check className="h-4 w-4 mr-2 text-green-600" />
                Setujui
              </DropdownMenuItem>
            )}
            {row.original.status !== "rejected" && (
              <DropdownMenuItem
                onClick={() =>
                  updateStatusMutation.mutate({
                    id: row.original.id,
                    status: "rejected",
                  })
                }
              >
                <X className="h-4 w-4 mr-2" />
                Tolak
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                if (confirm("Apakah Anda yakin ingin menghapus ulasan ini?")) {
                  deleteMutation.mutate(row.original.id);
                }
              }}
            >
              <Trash2 className="text-destructive h-4 w-4 mr-2" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Ulasan Produk</h1>
        <p className="text-muted-foreground mt-2">
          Kelola ulasan produk dari pelanggan
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Ulasan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.total || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">
              Menunggu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              {stats?.pending || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">
              Dilaporkan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">
              {stats?.reported || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rata-rata Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <p className="text-2xl font-bold">
                {stats?.averageRating?.toFixed(1) || "0.0"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Daftar Ulasan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="approved">Disetujui</TabsTrigger>
              <TabsTrigger value="rejected">Ditolak</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {isPending ? (
                <DataTableSkeleton columns={7} rows={5} />
              ) : isError ? (
                <ErrorAlert
                  description="Gagal memuat data ulasan."
                  action={() => refetch()}
                />
              ) : filteredReviews.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {activeTab === "all"
                      ? "Belum ada ulasan"
                      : `Tidak ada ulasan dengan status "${statusLabels[activeTab]}"`}
                  </p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={filteredReviews}
                  searchPlaceholder="Cari produk atau pelanggan..."
                  searchKey={["product.title", "user.name", "user.email"]}
                />
              )}
            </TabsContent>
          </Tabs>
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
