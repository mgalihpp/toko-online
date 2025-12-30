"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Separator } from "@repo/ui/components/separator";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  AlertTriangle,
  Check,
  Flag,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  useClearReviewReport,
  useDeleteReview,
  useReportReview,
  useUpdateReviewStatus,
} from "@/features/admin/queries/useReviewQuery";
import { formatDate } from "@/features/admin/utils";
import type { ReviewWithRelations } from "@/lib/api/review.api";

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
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-muted-foreground">
        {rating} dari 5
      </span>
    </div>
  );
}

interface ReviewDetailDialogProps {
  review: ReviewWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewDetailDialog({
  review,
  open,
  onOpenChange,
}: ReviewDetailDialogProps) {
  const updateStatusMutation = useUpdateReviewStatus();
  const reportMutation = useReportReview();
  const clearReportMutation = useClearReviewReport();
  const deleteMutation = useDeleteReview();

  if (!review) return null;

  const handleApprove = () => {
    updateStatusMutation.mutate(
      { id: review.id, status: "approved" },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  const handleReject = () => {
    updateStatusMutation.mutate(
      { id: review.id, status: "rejected" },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  const handleReport = () => {
    const reason = prompt("Masukkan alasan laporan (opsional):");
    reportMutation.mutate(
      { id: review.id, reason: reason || undefined },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  const handleClearReport = () => {
    clearReportMutation.mutate(review.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus ulasan ini?")) {
      deleteMutation.mutate(review.id, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isLoading =
    updateStatusMutation.isPending ||
    reportMutation.isPending ||
    clearReportMutation.isPending ||
    deleteMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detail Ulasan
            <Badge className={statusColors[review.status]}>
              {statusLabels[review.status] || review.status}
            </Badge>
            {review.is_reported && (
              <Badge className="bg-orange-500/20 text-orange-600 border-orange-500/30">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Dilaporkan
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            {review.product.product_images[0] && (
              <Image
                src={review.product.product_images[0].url}
                alt={review.product.title}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            )}
            <div>
              <p className="font-semibold text-lg">{review.product.title}</p>
              <p className="text-sm text-muted-foreground">
                ID: {review.product_id.slice(0, 8)}...
              </p>
            </div>
          </div>

          <Separator />

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              {review.user.image ? (
                <Image
                  src={review.user.image}
                  alt={review.user.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <User className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium">{review.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {review.user.email}
              </p>
            </div>
          </div>

          <Separator />

          {/* Review Content */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Rating
              </p>
              <RatingStars rating={review.rating} />
            </div>

            {review.title && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Judul
                </p>
                <p className="font-medium">{review.title}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Ulasan
              </p>
              <p className="text-foreground whitespace-pre-wrap">
                {review.body || "(Tidak ada komentar)"}
              </p>
            </div>

            {review.is_reported && review.report_reason && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <p className="text-sm font-medium text-orange-600 mb-1 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Alasan Laporan
                </p>
                <p className="text-sm text-orange-700">
                  {review.report_reason}
                </p>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              Dibuat pada: {formatDate(review.created_at)}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 flex-1">
            {review.status !== "approved" && (
              <Button
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
                onClick={handleApprove}
                disabled={isLoading}
              >
                <Check className="h-4 w-4 mr-2" />
                Setujui
              </Button>
            )}
            {review.status !== "rejected" && (
              <Button
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
                onClick={handleReject}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Tolak
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {review.is_reported ? (
              <Button
                variant="outline"
                onClick={handleClearReport}
                disabled={isLoading}
              >
                <Flag className="h-4 w-4 mr-2" />
                Abaikan Laporan
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
                onClick={handleReport}
                disabled={isLoading}
              >
                <Flag className="h-4 w-4 mr-2" />
                Tandai Dilaporkan
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
