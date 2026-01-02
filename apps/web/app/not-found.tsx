import { Button } from "@repo/ui/components/button";
import { MoveLeft } from "lucide-react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "@repo/ui/globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "404 - Halaman Tidak Ditemukan",
  description: "Halaman yang Anda cari tidak ditemukan.",
};

export default function NotFound() {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
          <div className="container flex flex-col items-center justify-center gap-6 px-4 text-center md:px-6">
            <div className="space-y-4">
              <h1 className="text-9xl font-extrabold tracking-tighter text-primary/20 select-none">
                404
              </h1>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Halaman Tidak Ditemukan
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Maaf, kami tidak dapat menemukan halaman yang Anda cari. Mungkin
                halaman tersebut sudah dipindahkan atau dihapus.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/">
                  <MoveLeft className="h-4 w-4" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
