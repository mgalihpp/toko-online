"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@repo/ui/components/sidebar";
import {
  AudioWaveform,
  BarChart,
  Box,
  ClipboardList,
  Command,
  GalleryVerticalEnd,
  Grid,
  LineChart,
  Package,
  Percent,
  RotateCcw,
  Settings,
  ShoppingCart,
  Star,
  Tag,
  Users,
} from "lucide-react";
import type * as React from "react";
import { NavMain } from "@/features/admin/components/nav-main";
import { NavUser } from "@/features/admin/components/nav-user";
import { TeamSwitcher } from "@/features/admin/components/team-switcher";

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "MonoWear",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "MonoWear",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "MonoWear",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Produk",
      icon: Box,
      url: "#",
      items: [
        { title: "Semua Produk", url: "/products" },
        { title: "Tambah Produk", url: "/products/new" },
      ],
    },
    {
      title: "Pesanan",
      icon: ShoppingCart,
      url: "#",
      items: [
        { title: "Semua Pesanan", url: "/orders" },
        { title: "Menunggu", url: "/orders/pending" },
        { title: "Diproses", url: "/orders/processing" },
        { title: "Dikirim", url: "/orders/shipped" },
        { title: "Selesai", url: "/orders/completed" },
        { title: "Dibatalkan", url: "/orders/cancelled" },
      ],
    },
    {
      title: "Pelanggan",
      icon: Users,
      url: "#",
      items: [
        { title: "Semua Pelanggan", url: "/customers" },
        { title: "Segmen", url: "/customers/segments" },
        { title: "Program Loyalitas", url: "/customers/loyalty" },
        { title: "Blacklist", url: "/customers/blacklist" },
      ],
    },
    {
      title: "Inventaris",
      icon: Package,
      url: "#",
      items: [
        { title: "Ringkasan Stok", url: "/inventory" },
        { title: "Pergerakan Stok", url: "/inventory/movements" },
        { title: "Gudang", url: "/inventory/warehouses" },
        { title: "Penyesuaian", url: "/inventory/adjustments" },
      ],
    },
    {
      title: "Pemasok",
      icon: Tag,
      url: "#",
      items: [
        { title: "Semua Pemasok", url: "/suppliers" },
        { title: "Pesanan Pembelian", url: "/suppliers/orders" },
        { title: "Pembayaran", url: "/suppliers/payments" },
      ],
    },
    {
      title: "Kategori",
      icon: Grid,
      url: "#",
      items: [
        { title: "Semua Kategori", url: "/categories" },
        { title: "Subkategori", url: "/categories/sub" },
        { title: "Atribut", url: "/categories/attributes" },
      ],
    },
    {
      title: "Kupon",
      icon: Percent,
      url: "#",
      items: [
        { title: "Semua Kupon", url: "/coupons" },
        { title: "Buat Kupon", url: "/coupons/new" },
        { title: "Kedaluwarsa", url: "/coupons/expired" },
      ],
    },
    {
      title: "Pengembalian",
      icon: RotateCcw,
      url: "#",
      items: [
        { title: "Permintaan Retur", url: "/returns/requests" },
        { title: "Disetujui", url: "/returns/approved" },
        { title: "Ditolak", url: "/returns/rejected" },
      ],
    },
    {
      title: "Ulasan",
      icon: Star,
      url: "#",
      items: [
        { title: "Semua Ulasan", url: "/reviews" },
        { title: "Menunggu Persetujuan", url: "/reviews/pending" },
        { title: "Dilaporkan", url: "/reviews/reported" },
      ],
    },
    {
      title: "Analitik",
      icon: BarChart,
      url: "#",
      items: [
        { title: "Ringkasan Penjualan", url: "/analytics/sales" },
        { title: "Wawasan Pelanggan", url: "/analytics/customers" },
        { title: "Performa Produk", url: "/analytics/products" },
      ],
    },
    {
      title: "Laporan",
      icon: LineChart,
      url: "#",
      items: [
        { title: "Laporan Harian", url: "/reports/daily" },
        { title: "Laporan Bulanan", url: "/reports/monthly" },
        { title: "Laporan Kustom", url: "/reports/custom" },
      ],
    },
    {
      title: "Log Audit",
      icon: ClipboardList,
      url: "#",
      items: [
        { title: "Semua Log", url: "/audit" },
        { title: "Aktivitas Pengguna", url: "/audit/users" },
        { title: "Event Sistem", url: "/audit/system" },
      ],
    },
    {
      title: "Pengaturan",
      icon: Settings,
      url: "#",
      items: [
        { title: "Umum", url: "/settings/general" },
        { title: "Pembayaran", url: "/settings/payment" },
        { title: "Pengiriman", url: "/settings/shipping" },
        { title: "Template Email", url: "/settings/email" },
        { title: "Peran & Izin", url: "/settings/roles" },
      ],
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
