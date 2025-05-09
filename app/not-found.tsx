"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Logo Section */}
      <Link href="/" className="mb-8 flex items-center space-x-2">
        <Image
          src="/SHL.jpg"
          alt="Shelter Housing Logo"
          width={60}
          height={60}
          className="rounded"
        />
        <span className="text-2xl font-bold text-gray-900">
          Shelter Housing Ltd.
        </span>
      </Link>

      {/* Error Message Section */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="text-gray-600 max-w-md">
          The page you're looking for doesn't exist or has been moved. 
          Please check the URL or navigate back to our homepage.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="default" 
          className="flex items-center gap-2"
          asChild
        >
          <Link href="/">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          asChild
        >
          <Link href="/projects">
            <Search className="h-4 w-4" />
            Browse Projects
          </Link>
        </Button>
      </div>

      {/* Back Button */}
      <button 
        onClick={() => window.history.back()}
        className="mt-8 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Go Back
      </button>

      {/* Additional Help */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>Need assistance? Contact us at:</p>
        <a 
          href="tel:+01755605080" 
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
        (+88)01755-605080
        </a>
      </div>
    </div>
  )
}