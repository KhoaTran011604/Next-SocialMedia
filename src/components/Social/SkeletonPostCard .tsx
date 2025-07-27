import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonPostCard = () => {
  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="mb-1 h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>

        {/* Content */}
        <div className="my-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Images (optional layout with 3 thumbnails) */}
        <div className="mb-2 grid grid-cols-3 gap-2">
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-32 w-full rounded-md" />
        </div>

        {/* Stats */}
        <div className="flex justify-between border-t-2 border-gray-100 pt-2 dark:border-gray-800">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Actions */}
        <div className="mt-2 flex justify-between border-t-2 border-gray-100 pt-2 dark:border-gray-800">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>

        {/* Comment Input */}
        <div className="mt-2 flex items-center gap-4 border-t-2 border-gray-100 pt-2 dark:border-gray-800">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
};
