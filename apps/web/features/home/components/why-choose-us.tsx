import { Headphones, Package, RefreshCw, Shield } from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Free Shipping",
    description: "Gratis ongkir untuk semua pesanan di atas Rp 500.000",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "Pengembalian mudah dalam waktu 30 hari tanpa ribet",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Transaksi aman dengan berbagai metode pembayaran",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Tim customer service siap membantu kapan saja",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left - Image (lebih kecil, 2/5 grid) */}
          <div className="lg:col-span-2 hidden lg:block">
            <div className="rounded-3xl overflow-hidden aspect-[3/4] max-w-[320px] mx-auto">
              <img
                src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80"
                alt="Why Choose Us"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right - Content (3/5 grid) */}
          <div className="lg:col-span-3">
            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
              ✦ Why TryWear ✦
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Kenapa Harus
              <br />
              Belanja di Sini?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-xl">
              Kami berkomitmen untuk memberikan pengalaman berbelanja terbaik
              dengan produk berkualitas tinggi dan layanan yang memuaskan.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="group">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
