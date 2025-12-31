"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { CreditCard, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function PaymentSettingsPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pembayaran</h1>
        <p className="text-muted-foreground mt-2">
          Kelola metode pembayaran dan gateway
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Midtrans Payment Gateway
                </CardTitle>
                <CardDescription>
                  Menerima pembayaran via Transfer Bank, E-Wallet, dan Kartu
                  Kredit.
                </CardDescription>
              </div>
              <Badge variant="default" className="bg-green-600">
                Terhubung
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>
                Status:{" "}
                <span className="font-medium text-foreground">
                  Sandbox Mode
                </span>
              </p>
              <p>
                Merchant ID:{" "}
                <span className="font-medium text-foreground">G-12345678</span>
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 bg-muted/50 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Konfigurasi dikelola melalui dashboard Midtrans.
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link href="https://dashboard.midtrans.com" target="_blank">
                Buka Dashboard Midtrans
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
