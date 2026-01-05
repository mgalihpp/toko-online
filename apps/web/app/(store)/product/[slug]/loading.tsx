import { Skeleton } from "@repo/ui/components/skeleton";

export default function ProductLoading() {
  return (
    <main>
      <section className="container mx-auto max-w-7xl px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Gallery Skeleton */}
          <div className="space-y-4">
            {/* Main Image */}
            <Skeleton className="aspect-square w-full rounded-lg" />

            {/* Thumbnail Images */}
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-md" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            {/* Breadcrumb */}
            <div className="hidden sm:flex gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Title & Rating */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-3/4" />
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="w-3 h-3 rounded" />
                  ))}
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Price & Stock */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>

            <Skeleton className="h-px w-full" />

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-12" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="w-10 h-10 rounded-full" />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-36" />
            </div>

            <Skeleton className="h-px w-full" />

            {/* Virtual Try-On Button */}
            <Skeleton className="h-12 w-full rounded-md" />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Skeleton className="h-14 w-full rounded-md" />
              <Skeleton className="h-14 w-full rounded-md" />
            </div>

            <Skeleton className="h-px w-full" />

            {/* Accordion */}
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>

        {/* Product Tabs Skeleton */}
        <div className="mt-16 space-y-6">
          <div className="flex gap-4 border-b pb-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="mt-16 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
