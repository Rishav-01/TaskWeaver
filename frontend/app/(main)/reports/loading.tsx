import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-72 rounded-md" />
          <Skeleton className="h-5 w-96 mt-2 rounded-md" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-[140px] rounded-md" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-20 rounded-md" />
              <Skeleton className="h-3 w-24 mt-2 rounded-md" />
              <Skeleton className="h-3 w-16 mt-2 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Items Breakdown */}
      <div className="flex justify-center items-center">
        <Card className="w-[50%]">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-52 rounded-md" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-2 w-24 rounded-full" />
                    <Skeleton className="h-4 w-8 rounded-md" />
                    <Skeleton className="h-4 w-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
