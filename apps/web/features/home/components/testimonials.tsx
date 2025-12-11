"use client";

import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Wijaya",
    role: "Fashion Enthusiast",
    avatar: "S",
    rating: 5,
    text: "Kualitas produknya luar biasa! Bahannya nyaman dan desainnya selalu up-to-date. Pengiriman juga cepat. Pasti akan belanja lagi!",
  },
  {
    id: 2,
    name: "Budi Santoso",
    role: "Regular Customer",
    avatar: "B",
    rating: 5,
    text: "Sudah langganan di TryWear selama 2 tahun. Tidak pernah mengecewakan. Customer service-nya juga sangat responsif dan ramah.",
  },
  {
    id: 3,
    name: "Amanda Putri",
    role: "Style Blogger",
    avatar: "A",
    rating: 5,
    text: "Sebagai blogger fashion, saya sangat picky soal pakaian. TryWear selalu punya koleksi yang bikin saya jatuh cinta!",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            ✦ Testimonials ✦
          </p>
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Dengarkan pengalaman dari ribuan pelanggan yang sudah mempercayai
            kami
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group bg-background rounded-3xl p-8 border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Quote className="w-5 h-5 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/80 leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
