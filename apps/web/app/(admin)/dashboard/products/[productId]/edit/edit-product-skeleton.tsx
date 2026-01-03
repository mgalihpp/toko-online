import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";

export function EditProductSkeleton() {
  return (
    <div className="p-0 md:p-8 space-y-6">
      <div className="max-md:p-4">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-32 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 sticky top-4">
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-16" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-5 w-16" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-16" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
