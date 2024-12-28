"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toolbarItems } from "@/constants"


export default function Toolbar() {
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [phoneHref, setPhoneHref] = useState('tel:+01755605080')

  // Update phone href based on device type
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    setPhoneHref(isMobile ? 'tel:+01755605080' : 'callto:+01755605080')
  }, [])

  const handlePhoneClick = (e: React.MouseEvent) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (!isMobile) {
      // For desktop, try both protocols
      window.location.href = phoneHref
      // Fallback to tel: if callto: doesn't work
      setTimeout(() => {
        window.location.href = 'tel:+01755605080'
      }, 100)
    }
  }

  return (
    <nav 
      className={`
        fixed left-0 top-1/2 transform -translate-y-1/2 
        rounded-r-lg p-2 flex flex-col gap-4 z-50
        transition-all duration-300 ease-in-out
        ${isHovered ? 'bg-white shadow-lg translate-x-2' : 'bg-white/50 backdrop-blur-sm'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Social media and contact toolbar"
    >
      {/* Social Media Links */}
      {toolbarItems.map(({ id, icon: Icon, href, label, isExternal, color }) => (
        <Link 
          key={id}
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          aria-label={label}
          onMouseEnter={() => setHoveredItem(id)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Button 
            variant="ghost" 
            size="icon"
            className="transition-all duration-300 ease-in-out hover:bg-gray-100"
          >
            <Icon 
              className={`h-5 w-5 transition-transform duration-300 ${hoveredItem === id ? 'scale-110' : 'scale-100'}`}
              style={{ 
                color: hoveredItem === id || isHovered ? color : 'black'
              }} 
            />
          </Button>
        </Link>
      ))}

      {/* Phone Button */}
      <a
        href={phoneHref}
        onClick={handlePhoneClick}
        aria-label="Call us"
        onMouseEnter={() => setHoveredItem('phone')}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <Button 
          variant="ghost" 
          size="icon"
          className="transition-all duration-300 ease-in-out hover:bg-gray-100"
        >
          <Phone 
            className={`h-5 w-5 transition-transform duration-300 ${hoveredItem === 'phone' ? 'scale-110' : 'scale-100'}`}
            style={{ 
              color: hoveredItem === 'phone' || isHovered ? '#25D366' : 'black'
            }} 
          />
        </Button>
      </a>
    </nav>
  )
}