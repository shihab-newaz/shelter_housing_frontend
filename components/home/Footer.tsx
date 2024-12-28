import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">Shelter Housing Limited</h3>
            <p className="text-gray-400 mb-4">Building dreams, creating homes. Your trusted partner in premium real estate development.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition duration-300">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition duration-300">About</Link></li>
              <li><Link href="/projects" className="text-gray-400 hover:text-white transition duration-300">Projects</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition duration-300">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" /> 123 Building Street, Cityville, ST 12345
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" /> (555) 123-4567
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" /> info@shelterhousing.com
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Shelter Housing Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

