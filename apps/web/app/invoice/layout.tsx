
import type { Metadata } from "next";
import "@repo/ui/globals.css";

export const metadata: Metadata = {
    title: "Invoice",
    description: "Invoice",
};

export default function InvoiceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <html lang="en"><body>{children}</body></html>;
}