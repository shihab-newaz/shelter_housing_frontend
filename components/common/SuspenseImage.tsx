// components/common/SuspenseImage.tsx
"use client";

import React, { Suspense } from "react";
import Image, { ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

// Image component that handles loading and errors
function LoadingImage({
  src,
  alt,
  ...props
}: ImageProps) {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <ImageIcon className="h-10 w-10 mx-auto text-gray-400" />
          <p className="text-gray-500 text-sm mt-2">Image unavailable</p>
        </div>
      </div>
    );
  }
  
  return (
    <Image
      src={src}
      alt={alt || "Project image"}
      {...props}
      onError={() => setError(true)}
    />
  );
}

// Loading fallback
const ImageSkeleton = () => (
  <div className="absolute inset-0 bg-gray-100 animate-pulse">
    <div className="flex items-center justify-center h-full">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
    </div>
  </div>
);

// Main suspense wrapper
export function SuspenseImage(props: ImageProps) {
  return (
    <div className="relative w-full h-full">
      <Suspense fallback={<ImageSkeleton />}>
        <LoadingImage {...props} />
      </Suspense>
    </div>
  );
}