import * as React from "react";

interface InvoiceItem {
  title: string;
  quantity: number;
  price: number;
  total: number;
}

export interface InvoiceEmailProps {
  orderId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  date: Date | string;
  shippingAddress: string;
  paymentMethod?: string;
  downloadUrl?: string;
}

export function InvoiceEmailTemplate({
  orderId,
  customerName,
  items,
  subtotal,
  shipping,
  tax,
  discount,
  total,
  date,
  shippingAddress,
  paymentMethod,
  downloadUrl,
}: InvoiceEmailProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 24,
        background: "#ffffff",
        borderRadius: 8,
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#111827",
        boxShadow: "0 2px 6px rgba(16,24,40,0.05)",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24, borderBottom: "1px solid #e5e7eb", paddingBottom: 24 }}>
        <h1 style={{ margin: "0 0 12px", fontSize: 24, color: "#111827" }}>
          Invoice Pembelian
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
          Terima kasih telah berbelanja di toko kami. Berikut adalah rincian pesanan Anda.
        </p>
      </div>

      {/* Order Info */}
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: "#9ca3af", textTransform: "uppercase" }}>Order ID</p>
          <p style={{ margin: 0, fontWeight: 600 }}>#{orderId.slice(0, 8).toUpperCase()}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: "#9ca3af", textTransform: "uppercase" }}>Tanggal</p>
          <p style={{ margin: 0, fontWeight: 600 }}>{formatDate(date)}</p>
        </div>
      </div>

      {/* Customer & Shipping */}
      <div style={{ marginBottom: 32, background: "#f9fafb", padding: 16, borderRadius: 6 }}>
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Ditagihkan ke:</p>
          <p style={{ margin: 0, fontWeight: 500 }}>{customerName}</p>
        </div>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Dikirim ke:</p>
          <p style={{ margin: 0, lineHeight: 1.5, whiteSpace: "pre-line" }}>{shippingAddress}</p>
        </div>
      </div>

      {/* Items Table */}
      <div style={{ marginBottom: 32 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ textAlign: "left", padding: "12px 0", fontSize: 12, color: "#6b7280", textTransform: "uppercase" }}>Item</th>
              <th style={{ textAlign: "center", padding: "12px 0", fontSize: 12, color: "#6b7280", textTransform: "uppercase" }}>Qty</th>
              <th style={{ textAlign: "right", padding: "12px 0", fontSize: 12, color: "#6b7280", textTransform: "uppercase" }}>Harga</th>
              <th style={{ textAlign: "right", padding: "12px 0", fontSize: 12, color: "#6b7280", textTransform: "uppercase" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px 0", fontWeight: 500 }}>{item.title}</td>
                <td style={{ padding: "12px 0", textAlign: "center", color: "#6b7280" }}>{item.quantity}</td>
                <td style={{ padding: "12px 0", textAlign: "right", color: "#6b7280" }}>{formatCurrency(item.price)}</td>
                <td style={{ padding: "12px 0", textAlign: "right", fontWeight: 500 }}>{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 32 }}>
        <div style={{ width: "250px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#6b7280" }}>Subtotal</span>
            <span style={{ fontWeight: 500 }}>{formatCurrency(subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#6b7280" }}>Pengiriman</span>
            <span style={{ fontWeight: 500 }}>{formatCurrency(shipping)}</span>
          </div>
          {tax > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#6b7280" }}>Pajak (PPN)</span>
              <span style={{ fontWeight: 500 }}>{formatCurrency(tax)}</span>
            </div>
          )}
          {discount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#16a34a" }}>
              <span>Diskon</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div style={{ borderTop: "2px solid #e5e7eb", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700 }}>
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      {downloadUrl && (
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a
            href={downloadUrl}
            style={{
              display: "inline-block",
              background: "#111827",
              color: "#ffffff",
              textDecoration: "none",
              padding: "12px 24px",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Download Invoice PDF
          </a>
        </div>
      )}

      {paymentMethod && (
        <div style={{ marginBottom: 24, fontSize: 13, color: "#6b7280", textAlign: "center" }}>
          Pembayaran via {paymentMethod}
        </div>
      )}

      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 24, textAlign: "center", fontSize: 13, color: "#9ca3af" }}>
        <p style={{ margin: 0 }}>
          Jika ada pertanyaan, silakan balas email ini atau hubungi tim support kami.
        </p>
        <p style={{ margin: "8px 0 0" }}>© {new Date().getFullYear()} Toko Online. All rights reserved.</p>
      </div>
    </div>
  );
}
