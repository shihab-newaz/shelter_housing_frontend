// components/common/ProjectImage.tsx
import { getImageUrl } from "@/app/actions/imageUrlActions";
import { SuspenseImage } from "./SuspenseImage";
import { Suspense } from "react";

interface ProjectImageProps {
  src: string;
  alt?: string;
  [key: string]: any; 
}

// Image skeleton loader
function ImageSkeleton() {
  return (
    <div className="absolute inset-0 bg-gray-100 animate-pulse">
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    </div>
  );
}

// Async component that resolves the image URL
async function AsyncProjectImage({ src, alt, ...props }: ProjectImageProps) {
  // Resolve the URL server-side with caching
  const imageUrl = await getImageUrl(src);
  
  return (
    <SuspenseImage
      src={imageUrl}
      alt={alt || "Project image"}
      {...props}
    />
  );
}

// The main component with Suspense wrapping
export function ProjectImage(props: ProjectImageProps) {
  return (
    <Suspense fallback={<ImageSkeleton />}>
      <AsyncProjectImage {...props} />
    </Suspense>
  );
}