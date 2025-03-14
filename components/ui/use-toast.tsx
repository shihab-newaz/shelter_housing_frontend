//components/ui/use-toast.tsx
"use client"

import * as React from "react"
import { Toaster as Sonner, toast as sonnerToast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

export const toast = {
  success: (title?: string, options?: { description?: string }) => {
    return sonnerToast.success(title, options);
  },
  error: (title?: string, options?: { description?: string }) => {
    return sonnerToast.error(title, options);
  },

  default: (options: {
    title?: string;
    description?: string;
  }) => {
    return sonnerToast.success(options.title, {
      description: options.description,
    });
  },
  destructive: (options: {
    title?: string;
    description?: string;
  }) => {
    return sonnerToast.error(options.title, {
      description: options.description,
    });
  },
}