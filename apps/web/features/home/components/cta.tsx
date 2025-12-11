"use client";

import { Button } from "@repo/ui/components/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const CTA = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
          alt="CTA Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <span className="text-sm text-white font-medium">
              🔥 Limited Time Offer
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
            Get <span className="text-amber-300">20% Off</span>
            <br />
            Your First Order
          </h2>

          <p className="text-white/70 text-lg lg:text-xl mb-10 max-w-xl mx-auto">
            Daftar sekarang dan dapatkan diskon eksklusif untuk pembelian
            pertamamu. Jangan lewatkan kesempatan ini!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-14 px-8 text-base font-semibold bg-white text-black hover:bg-white/90 rounded-full group w-full sm:w-auto"
              asChild
            >
              <Link href="/products">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Link
              href="/products"
              className="inline-flex items-center justify-center h-14 px-8 text-base font-semibold bg-transparent border-2 border-white text-white hover:bg-white hover:text-black rounded-full w-full sm:w-auto transition-colors"
            >
              View Collection
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-8 mt-12 text-white/60 text-sm">
            <span>✓ Free Shipping</span>
            <span>✓ Secure Payment</span>
            <span>✓ Easy Returns</span>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full" />
      <div className="absolute bottom-10 right-10 w-48 h-48 border border-white/10 rounded-full" />
    </section>
  );
};
