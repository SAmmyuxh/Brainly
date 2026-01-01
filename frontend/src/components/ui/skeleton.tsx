import { cn } from "@/lib/utils"

interface SkeletonProps {
    className?: string
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-muted",
                className
            )}
        />
    )
}

export function ContentCardSkeleton() {
    return (
        <div className="rounded-lg border bg-card p-4 space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-5 w-3/4" />
            </div>
            <Skeleton className="h-32 w-full rounded-md" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            <Skeleton className="h-4 w-24 ml-auto" />
        </div>
    )
}

export function DashboardSkeleton() {
    return (
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 w-full max-w-7xl mx-auto">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="break-inside-avoid mb-6">
                    <ContentCardSkeleton />
                </div>
            ))}
        </div>
    )
}
