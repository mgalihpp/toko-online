type AddressCardProps = {
  name?: string | null;
  addressLine?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  phone?: string | null;
};

export function AddressCard({
  name,
  addressLine,
  city,
  province,
  postalCode,
  phone,
}: AddressCardProps) {
  return (
    <div className="border border-border p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Alamat Pengiriman</h2>
      <div className="space-y-2 text-muted-foreground">
        <p className="font-semibold text-foreground">{name}</p>
        <p>{addressLine}</p>
        <p>
          {[city, province, postalCode].filter(Boolean).join(", ")}
        </p>
        <p>{phone}</p>
      </div>
    </div>
  );
}
