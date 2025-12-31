"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";

export default function GeneralSettingsPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pengaturan Umum</h1>
        <p className="text-muted-foreground mt-2">
          Informasi dasar toko Anda
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profil Toko</CardTitle>
            <CardDescription>
              Informasi ini akan ditampilkan kepada pelanggan Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Toko</Label>
              <Input defaultValue="TryWear" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                defaultValue="Platform e-commerce fashion terdepan dengan teknologi Virtual Try-On."
                readOnly
              />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 bg-muted/50">
            <span className="text-sm text-muted-foreground">
              Pengaturan ini dikelola oleh sistem.
            </span>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logo & Branding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 rounded-lg border bg-muted flex items-center justify-center text-muted-foreground">
                Logo
              </div>
              <div className="space-y-2">
                <Button variant="outline" disabled>
                  Ubah Logo
                </Button>
                <p className="text-sm text-muted-foreground">
                  Format yang didukung: JPG, PNG, SVG. Maks 2MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
