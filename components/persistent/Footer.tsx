import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

interface QuickLink {
  href: string;
  label: string;
}

interface ContactInfo {
  icon: React.ElementType;
  text: string;
  subText?: string;
}

interface SocialLink {
  icon: React.ElementType;
  href: string;
  label: string;
}

export default function Footer() {
  // Quick links configuration
  const quickLinks: QuickLink[] = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects/ongoing", label: "Projects" },
    { href: "/contact", label: "Contact" },
  ];

  // Contact information configuration
  const contactInfo: ContactInfo[] = [
    {
      icon: MapPin,
      text: "Level 7, Grameen Banglar Akshay Tower",
      subText: "51 Madani Ave, Dhaka 1212",
    },
    {
      icon: Clock,
      text: "Opens 9:30 AM ",
      subText: "Business Hours 9:30 AM - 6:00 PM",
    },
    {
      icon: Phone,
      text: "01755-605080",
    },
    {
      icon: Mail,
      text: "info@shelterhousing.com",
    },
  ];

  // Social media links configuration
  const socialLinks: SocialLink[] = [
    {
      icon: Facebook,
      href: "https://www.facebook.com/shelterhousinglimited/?profile_tab_item_selected=about&_rdr",
      label: "Facebook",
    },
    { icon: Instagram, href: "#", label: "Instagram" },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/company/shelterhousingltd/?originalSubdomain=bd",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="bg-sage-800 text-sage-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Information */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-sage-50">
              Shelter Housing Limited
            </h3>
            <p className="text-sage-200 mb-4">
              Building dreams, creating homes. Your trusted partner in premium
              real estate development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-sage-50">
              Quick Links
            </h4>
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
            <h4 className="text-lg font-semibold mb-4 text-sage-50">
              Contact Information
            </h4>
            <ul className="space-y-4">
              {contactInfo.map(({ icon: Icon, text, subText }, index) => (
                <li key={index} className="text-sage-200">
                  <div className="flex items-start">
                    <Icon className="h-5 w-5 mr-2 mt-1 text-sage-400 flex-shrink-0" />
                    <div>
                      <p>{text}</p>
                      {subText && (
                        <p className="text-sage-300 text-sm mt-1">{subText}</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-sage-50">
              Follow Us
            </h4>
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
          <p>
            &copy; {new Date().getFullYear()} Shelter Housing Limited. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
