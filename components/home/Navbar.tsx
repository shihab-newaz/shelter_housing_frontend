"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { projectItems } from "@/constants"

/**
 * Enhanced Navbar component with dark theme and consistent white text
 * Features smooth transitions and hover effects
 * @returns React component
 */
export default function Navbar() {
  // Track scroll and hover states for background transition
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  // Add scroll event listener with cleanup
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Compute dynamic classes for navbar background
  const navClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
    isScrolled || isHovered 
      ? "bg-gray-900/55 backdrop-blur-sm shadow-lg" 
      : "bg-transparent"
  )

  // Consistent white text styling for navigation links
  const linkClasses = "text-white hover:text-gray-200/80 transition-colors duration-300"

  return (
    <header 
      className={navClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and Brand Name */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/SHL.jpg"
            alt="Shelter Housing Logo"
            width={45}
            height={45}
            className="rounded"
          />
          <span className="text-2xl font-bold text-white">
            Shelter Housing
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={cn("px-4 py-2", linkClasses)}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem >
                <NavigationMenuTrigger className="bg- text-white" >
                  Projects
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4 bg-gray-900 text-white">
                    {projectItems.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-800 text-white"
                          >
                            {item.title}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={cn("px-4 py-2", linkClasses)}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={cn("px-4 py-2", linkClasses)}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-white/80"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gray-900 text-white">
              <SheetHeader>
                <SheetTitle className="text-white">Shelter Housing</SheetTitle>
                <SheetDescription className="text-gray-300">
                  Navigate through our site
                </SheetDescription>
              </SheetHeader>
              <nav className="grid gap-4 py-4">
                <Link href="/" className="px-2 py-1 text-white hover:text-white/80 transition-colors">
                  Home
                </Link>
                <Link href="/about" className="px-2 py-1 text-white hover:text-white/80 transition-colors">
                  About
                </Link>
                <Link href="/contact" className="px-2 py-1 text-white hover:text-white/80 transition-colors">
                  Contact
                </Link>
                <div>
                  <h3 className="mb-2 font-semibold text-white">Projects</h3>
                  {projectItems.map((item) => (
                    <Link 
                      key={item.title} 
                      href={item.href} 
                      className="block px-2 py-1 text-white hover:text-white/80 transition-colors"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}