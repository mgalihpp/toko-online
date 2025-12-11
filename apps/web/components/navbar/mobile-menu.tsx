"use client";

import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import { Sheet, SheetContent, SheetTrigger } from "@repo/ui/components/sheet";
import {
  Baby,
  Heart,
  Home,
  Menu,
  Package,
  Percent,
  ShirtIcon,
  ShoppingBag,
  Sparkles,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const categories = [
  { label: "Pria", href: "/products?category=pria", icon: ShirtIcon },
  { label: "Wanita", href: "/products?category=wanita", icon: Sparkles },
  { label: "Anak", href: "/products?category=anak", icon: Baby },
  { label: "Promo", href: "/products?sale=true", icon: Percent },
];

const quickLinks = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Semua Produk", href: "/products", icon: ShoppingBag },
  { label: "Wishlist Saya", href: "/wishlist", icon: Heart },
  { label: "Pesanan Saya", href: "/user/settings", icon: Package },
];

const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        hideClose
        className="w-full max-w-sm p-0 border-0"
      >
        <div className="flex flex-col h-full bg-background">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  TW
                </span>
              </div>
              <span className="text-xl font-bold">TryWear</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Categories Section */}
            <div className="p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Kategori
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-primary/30 transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Separator />

            {/* Quick Links */}
            <div className="p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Menu
              </h3>
              <nav className="space-y-1">
                {quickLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors group"
                  >
                    <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-3">
            <Button
              className="w-full h-12 font-semibold"
              onClick={() => setOpen(false)}
              asChild
            >
              <Link href="/user/settings">
                <User className="mr-2 h-5 w-5" />
                Masuk / Daftar
              </Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              v1.0.0 • Made with ❤️ in Indonesia
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
