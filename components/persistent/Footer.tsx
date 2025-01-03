import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

/**
 * Quick link item type definition
 */
interface QuickLink {
  href: string
  label: string
}

/**
 * Contact information item type definition
 */
interface ContactInfo {
  icon: React.ElementType
  text: string
}

/**
 * Social media link type definition
 */
interface SocialLink {
  icon: React.ElementType
  href: string
  label: string
}

/**
 * Footer component providing site navigation, contact information, and social media links
 * Implements a sage color theme with hover effects
 */
export default function Footer() {
  // Quick links configuration
  const quickLinks: QuickLink[] = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" }
  ]

  // Contact information configuration
  const contactInfo: ContactInfo[] = [
    { icon: MapPin, text: "123 Building Street, Cityville, ST 12345" },
    { icon: Phone, text: "(555) 123-4567" },
    { icon: Mail, text: "info@shelterhousing.com" }
  ]

  // Social media links configuration
  const socialLinks: SocialLink[] = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ]

  return (
    <footer className="bg-sage-800 text-sage-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Information */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-sage-50">Shelter Housing Limited</h3>
            <p className="text-sage-200 mb-4">
              Building dreams, creating homes. Your trusted partner in premium real estate development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-sage-50">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link 
                    href={href} 
                    className="text-sage-200 hover:text-sage-50 transition duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-sage-50">Contact Information</h4>
            <ul className="space-y-2">
              {contactInfo.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center text-sage-200">
                  <Icon className="h-5 w-5 mr-2 text-sage-400" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-sage-50">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link 
                  key={label}
                  href={href} 
                  aria-label={label}
                  className="text-sage-300 hover:text-sage-50 transition duration-300"
                >
                  <Icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="mt-12 pt-8 border-t border-sage-700 text-center text-sage-300">
          <p>&copy; {new Date().getFullYear()} Shelter Housing Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}