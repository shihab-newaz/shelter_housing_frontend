"use client";
// components/ui/project-image.tsx
import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";

interface ProjectImageProps extends Omit<ImageProps, 'onError'> {
  fallbackText?: string;
  iconSize?: number;
}

/**
 * A wrapper around Next.js Image component that handles loading errors gracefully
 */
export function ProjectImage({
  fallbackText = "Image could not be loaded",
  iconSize = 24,
  alt,
  ...props
}: ProjectImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-full">
      {/* Always render the image, even when there's an error */}
      <Image
        alt={alt || "Image"}
        {...props}
        onError={handleError}
        onLoad={handleLoad}
        className={`${props.className || ''} ${hasError ? 'opacity-0' : isLoading ? 'opacity-30' : 'opacity-100'} transition-opacity duration-300`}
      />
      
      {/* Show loading state */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="h-2 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90">
          <div className="text-center p-4">
            <ImageIcon className={`mx-auto text-gray-400`} style={{ width: iconSize, height: iconSize }} />
            <p className="text-gray-500 text-sm mt-2">{fallbackText}</p>
          </div>
        </div>
      )}
    </div>
  );
}