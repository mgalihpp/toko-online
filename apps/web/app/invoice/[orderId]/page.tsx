import { db } from "@repo/db";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { formatCurrency, formatDate } from "@/features/admin/utils";
import { auth } from "@/lib/auth";
import { InvoiceActions } from "./invoice-actions";

interface PageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function InvoicePage({ params }: PageProps) {
  const { orderId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const order = await db.orders.findUnique({
    where: { id: orderId },
    include: {
      order_items: true,
      user: true,
      address: true,
      shipments: {
        include: {
          shipment_method: true,
        },
      },
      payments: true,
    },
  });

  if (!order) {
    notFound();
  }

  // Security check: Ensure the user owns the order or is an admin
  if (order.user_id !== session.user.id && session.user.role !== "admin") {
    notFound();
  }

  const subtotal = Number(order.subtotal_cents);
  const shipping = Number(order.shipping_cents);
  const tax = Number(order.tax_cents);
  const discount = Number(order.discount_cents);
  const total = Number(order.total_cents);

  const address = order.address
    ? `${order.address.address_line1}, ${order.address.city}, ${order.address.province}, ${order.address.postal_code}`
    : "Alamat tidak tersedia";

  const payment = order.payments?.[0];
  const paymentMethod = payment?.provider || "Manual";

  return (
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white print:py-0">
      <div className="mx-auto max-w-3xl bg-white p-8 shadow-sm print:shadow-none">
        {/* Header Actions */}
        <div className="mb-8 flex justify-between items-center print:hidden">
          <h1 className="text-2xl font-bold text-gray-900">Invoice</h1>
          <InvoiceActions />
        </div>

        {/* Invoice Header */}
        <div className="mb-8 flex justify-between border-b pb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
            <p className="text-sm text-gray-500 mt-1">
              Order ID: #{order.id}
            </p>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-semibold text-gray-900">TryWear</h3>
            <p className="text-sm text-gray-500">Tangerang, Indonesia</p>
            <p className="text-sm text-gray-500 mt-1">
              Tanggal: {formatDate(order.created_at)}
            </p>
          </div>
        </div>

        {/* Addresses */}
        <div className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">
              Ditagihkan Kepada
            </h3>
            <p className="font-semibold text-gray-900">{order.user?.name}</p>
            <p className="text-sm text-gray-600">{order.user?.email}</p>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">
              Dikirim Ke
            </h3>
            <p className="font-semibold text-gray-900">
              {order.address?.recipient_name || order.user?.name}
            </p>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {address}
            </p>
            {order.address?.phone && (
              <p className="text-sm text-gray-600">{order.address.phone}</p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Item
                </th>
                <th className="py-3 text-center text-xs font-semibold uppercase text-gray-500">
                  Qty
                </th>
                <th className="py-3 text-right text-xs font-semibold uppercase text-gray-500">
                  Harga
                </th>
                <th className="py-3 text-right text-xs font-semibold uppercase text-gray-500">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.order_items.map((item) => (
                <tr key={item.id}>
                  <td className="py-4">
                    <p className="font-medium text-gray-900">
                      {item.title || "Produk"}
                    </p>
                    {item.sku && (
                      <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                    )}
                  </td>
                  <td className="py-4 text-center text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="py-4 text-right text-gray-600">
                    {formatCurrency(Number(item.unit_price_cents))}
                  </td>
                  <td className="py-4 text-right font-medium text-gray-900">
                    {formatCurrency(Number(item.total_price_cents))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mb-8 flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Pajak</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Pengiriman</span>
              <span className="font-medium">{formatCurrency(shipping)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Diskon</span>
                <span className="font-medium">-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="rounded-lg bg-gray-50 p-4 border border-gray-100 print:bg-white print:border-gray-300">
          <p className="text-sm text-gray-600 mb-1">Metode Pembayaran:</p>
          <p className="font-medium text-gray-900 uppercase">{paymentMethod}</p>
          {payment?.status && (
            <p className="text-sm text-gray-500 mt-1 capitalize">
              Status: {payment.status}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500 print:mt-16">
          <p>Terima kasih telah berbelanja di TryWear.</p>
          <p className="mt-1">
            Jika ada pertanyaan, silakan hubungi customer service kami.
          </p>
        </div>
      </div>
    </div>
  );
}
