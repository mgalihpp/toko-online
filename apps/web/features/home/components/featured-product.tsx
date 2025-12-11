"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { ArrowRight, Heart, ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import { FEATURED } from "@/features/home/constant/featuredProduct";

export const FeaturedProduct = () => {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            ✦ Best Sellers ✦
          </p>
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">
            Produk Unggulan
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pilihan terbaik yang paling banyak diminati oleh pelanggan kami
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {FEATURED.map((product, index) => (
            <div key={product.id} className="group relative">
              {/* Product Card */}
              <div className="relative bg-secondary rounded-3xl overflow-hidden">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                  {/* Tags */}
                  <div className="absolute top-6 left-6 flex gap-2">
                    <Badge className="bg-black text-white font-semibold px-4 py-1">
                      {product.tag}
                    </Badge>
                    {product.discount && (
                      <Badge className="bg-red-500 text-white font-semibold px-4 py-1">
                        -{product.discount}
                      </Badge>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <Button
                      size="icon"
                      className="rounded-full bg-white text-black hover:bg-white/90 h-12 w-12 shadow-lg"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="rounded-full bg-white text-black hover:bg-white/90 h-12 w-12 shadow-lg"
                    >
                      <ShoppingBag className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-sm">4.9</span>
                    <span className="text-muted-foreground text-sm">(256)</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold">{product.price}</p>
                      {product.originalPrice && (
                        <p className="text-muted-foreground line-through">
                          {product.originalPrice}
                        </p>
                      )}
                    </div>

                    <Button
                      className="rounded-full h-12 px-6 font-semibold group/btn"
                      asChild
                    >
                      <Link href={`/products/${product.id}`}>
                        Shop Now
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Decorative number */}
              <div className="absolute -top-6 -right-6 text-[150px] font-bold text-muted/10 pointer-events-none leading-none hidden lg:block">
                0{index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-8 rounded-full font-semibold border-2"
            asChild
          >
            <Link href="/products">
              Lihat Semua Produk
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
