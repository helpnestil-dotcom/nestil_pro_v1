import { Skeleton } from '@/components/ui/skeleton';

export default function PropertyDetailLoading() {
  return (
    <div className="container py-10 animate-pulse">
      <div className="mb-6 space-y-3">
        <Skeleton className="h-10 w-3/4 rounded-lg" />
        <Skeleton className="h-6 w-1/2 rounded-lg" />
        <div className="flex gap-2 pt-2">
            <Skeleton className="h-7 w-28 rounded-full" />
            <Skeleton className="h-7 w-28 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        <div className="lg:col-span-1 space-y-8">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
