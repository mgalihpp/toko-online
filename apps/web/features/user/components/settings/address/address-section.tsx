import type { Addresses } from "@repo/db";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Skeleton } from "@repo/ui/components/skeleton";
import { MapPin, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddresses,
  useDeleteAddress,
  useUpdateAddress,
} from "@/features/user/queries/useAddressQuery";
import AddressDialog from "./address-dialog";

export const AddressSection = () => {
  const {
    data: addresses,
    isLoading,
    isError,
    error,
    refetch,
  } = useAddresses();
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Addresses | null>(null);
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const errorMessage =
    error instanceof Error
      ? error.message
      : "Terjadi kesalahan saat memuat alamat.";

  const handleDeleteAddress = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus alamat ini?")) {
      deleteAddressMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Alamat berhasil dihapus");
        },
      });
    }
  };

  const handleEditAddress = (address: Addresses) => {
    setEditingAddress(address);
    setAddressDialogOpen(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setAddressDialogOpen(true);
  };

  const setDefaultAddress = (id: number) => {
    updateAddressMutation.mutate({
      id,
      data: {
        is_default: true,
      },
    });
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold">Daftar Alamat</h2>
        <Button onClick={handleAddNewAddress} className="w-auto">
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:block">Tambah Alamat</span>
        </Button>
      </div>

      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Gagal memuat alamat</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <span>{errorMessage}</span>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => refetch()}
            >
              Coba lagi
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 2 }).map((_, idx) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={idx}
                className="border border-border rounded-lg p-5 sm:p-6 space-y-4"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-9 w-9" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-4 w-40" />
                </div>

                <Skeleton className="h-9 w-full sm:w-40" />
              </div>
            ))
          : addresses?.map((address) => (
              <div
                key={address.id}
                className="border border-border rounded-lg p-5 sm:p-6 space-y-4"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg leading-tight">
                      {address.label}
                    </h3>
                    {address.is_default && (
                      <span className="inline-block mt-1 px-2 py-1 bg-foreground text-background text-xs font-medium rounded">
                        Alamat Utama
                      </span>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Buka menu</span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => handleEditAddress(address)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDeleteAddress(address.id)}
                          disabled={address.is_default}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Hapus</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
                  <p className="font-medium text-foreground text-base">
                    {address.recipient_name}
                  </p>
                  <p className="text-foreground">{address.phone}</p>
                  <p className="text-foreground">{address.address_line1}</p>
                  <p className="text-foreground">
                    {[address.city, address.province, address.postal_code]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>

                {!address.is_default && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      setDefaultAddress(address.id);
                      toast.success("Alamat utama berhasil diubah");
                    }}
                  >
                    Jadikan Alamat Utama
                  </Button>
                )}
              </div>
            ))}
      </div>

      {!isLoading && addresses?.length === 0 && (
        <div className="text-center py-16 border border-border rounded-lg">
          <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            Belum ada alamat tersimpan
          </p>
          <Button onClick={handleAddNewAddress}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Alamat Pertama
          </Button>
        </div>
      )}

      <AddressDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        editAddress={editingAddress}
      />
    </div>
  );
};
