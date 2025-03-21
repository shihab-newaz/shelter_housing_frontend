"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toolbarItems } from "@/constants"

/**
 * Interface for hover state management
 */
interface HoverState {
  isHovered: boolean
  hoveredItem: string | null
}

/**
 * Toolbar component providing social media links and contact options
 * Features hover animations and adaptive phone number handling
 */
export default function Toolbar() {
  // State management for hover effects and phone handling
  const [hoverState, setHoverState] = useState<HoverState>({
    isHovered: false,
    hoveredItem: null
  })
  const [phoneHref, setPhoneHref] = useState('tel:+01614542234')

  // Detect device type and set appropriate phone protocol
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    setPhoneHref(isMobile ? 'tel:+01614542234' : 'callto:+01614542234')
  }, [])

  /**
   * Handle phone click events with fallback protocol
   * @param {React.MouseEvent} e - Click event object
   */
  const handlePhoneClick = (e: React.MouseEvent) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (!isMobile) {
      window.location.href = phoneHref
      // Fallback to tel: protocol if callto: fails
      setTimeout(() => {
        window.location.href = 'tel:+01614542234'
      }, 100)
    }
  }

  return (
    <nav 
      className={`
        fixed left-0 top-1/2 transform -translate-y-1/2 
        rounded-r-lg p-2 flex flex-col gap-4 z-50
        transition-all duration-300 ease-in-out
        ${hoverState.isHovered ? 'bg-sage-50 shadow-lg translate-x-2' : 'bg-sage-50/50 backdrop-blur-sm'}
      `}
      onMouseEnter={() => setHoverState(prev => ({ ...prev, isHovered: true }))}
      onMouseLeave={() => setHoverState({ isHovered: false, hoveredItem: null })}
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
          onMouseEnter={() => setHoverState(prev => ({ ...prev, hoveredItem: id }))}
          onMouseLeave={() => setHoverState(prev => ({ ...prev, hoveredItem: null }))}
        >
          <Button 
            variant="ghost"
            size="icon"
            className="transition-all duration-300 ease-in-out hover:bg-sage-100"
          >
            <Icon 
              className={`h-5 w-5 transition-transform duration-300 ${
                hoverState.hoveredItem === id ? 'scale-110' : 'scale-100'
              }`}
              style={{ 
                color: hoverState.hoveredItem === id || hoverState.isHovered ? 'rgb(104, 125, 108)' : 'rgb(55, 70, 59)'
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
        onMouseEnter={() => setHoverState(prev => ({ ...prev, hoveredItem: 'phone' }))}
        onMouseLeave={() => setHoverState(prev => ({ ...prev, hoveredItem: null }))}
      >
        <Button 
          variant="ghost"
          size="icon"
          className="transition-all duration-300 ease-in-out hover:bg-sage-100"
        >
          <Phone 
            className={`h-5 w-5 transition-transform duration-300 ${
              hoverState.hoveredItem === 'phone' ? 'scale-110' : 'scale-100'
            }`}
            style={{ 
              color: hoverState.hoveredItem === 'phone' || hoverState.isHovered ? 'rgb(104, 125, 108)' : 'rgb(55, 70, 59)'
            }} 
          />
        </Button>
      </a>
    </nav>
  )
}