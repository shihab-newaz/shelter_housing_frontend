"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        className: "bg-white border border-gray-200 shadow-md rounded-md",
        duration: 3000,
      }}
    />
  )
}