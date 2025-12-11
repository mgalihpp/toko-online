"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CATEGORIES } from "@/features/home/constant/categoriesProduct";

export const CategoriesProduct = () => {
  return (
    <section className="py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
              ✦ Categories ✦
            </p>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            View All Categories
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Categories Grid - Bento Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {CATEGORIES.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className={`group relative overflow-hidden rounded-2xl lg:rounded-3xl ${
                index === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              {/* Background Image */}
              <div
                className={`${index === 0 ? "aspect-square" : "aspect-[4/5]"} overflow-hidden`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                  <h3
                    className={`font-bold text-white mb-1 ${index === 0 ? "text-3xl lg:text-4xl" : "text-xl lg:text-2xl"}`}
                  >
                    {category.name}
                  </h3>
                  <p className="text-white/70 text-sm">{category.count}</p>
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-6 right-6 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
