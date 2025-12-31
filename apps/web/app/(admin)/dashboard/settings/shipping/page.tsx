"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Switch } from "@repo/ui/components/switch";
import { Truck } from "lucide-react";

export default function ShippingSettingsPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Pengiriman & Pajak
        </h1>
        <p className="text-muted-foreground mt-2">
          Atur logistik dan perhitungan pajak
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Kurir Pengiriman
            </CardTitle>
            <CardDescription>
              Layanan logistik yang diaktifkan untuk toko Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="jne" className="font-medium">
                  JNE (Jalur Nugraha Ekakurir)
                </Label>
                <span className="text-sm text-muted-foreground">
                  Reguler, YES, OKE
                </span>
              </div>
              <Switch id="jne" checked disabled />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <Label
                  htmlFor="pos"
                  className="font-medium text-muted-foreground"
                >
                  POS Indonesia
                </Label>
                <span className="text-sm text-muted-foreground">
                  Kilat Khusus
                </span>
              </div>
              <Switch id="pos" disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pajak</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="tax-enabled">Aktifkan PPN</Label>
              <Switch id="tax-enabled" checked disabled />
            </div>
            <div className="space-y-2">
              <Label>Persentase Pajak (%)</Label>
              <div className="flex items-center gap-2">
                <Input type="number" value="10" readOnly className="w-24" />
                <span className="text-muted-foreground">%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
