// app/contact/page.tsx
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

/**
 * Contact information interface
 */
interface ContactInfo {
  icon: React.ElementType;
  title: string;
  details: string[];
}

/**
 * Contact information configuration
 */
const contactInfo: ContactInfo[] = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: [
      "Level 7, Grameen Banglar Akshay Tower",
      "51 Madani Ave, Dhaka 1212",
      "Bangladesh"
    ]
  },
  {
    icon: Phone,
    title: "Call Us",
    details: [
      "01755-605080"
    ]
  },
  {
    icon: Mail,
    title: "Email Us",
    details: [
      "info@shelterhousing.com"
    ]
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: [
      "Sat-Thu: 9:30 AM - 6:00 PM",
    ]
  }
]

/**
 * Contact information card component
 */
function ContactCard({ info }: { info: ContactInfo }) {
  const Icon = info.icon
  
  return (
    <Card className="p-6 bg-sage-50 border-sage-200 hover:shadow-lg transition-shadow duration-300">
      <CardContent className="flex flex-col items-center text-center p-0">
        <Icon className="h-8 w-8 text-sage-600 mb-4" />
        <h3 className="text-xl font-semibold mb-3 text-sage-800">{info.title}</h3>
        {info.details.map((detail, index) => (
          <p key={index} className="text-sage-600">
            {detail}
          </p>
        ))}
      </CardContent>
    </Card>
  )
}

/**
 * Contact page component displaying company contact information
 */
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-sage-100 py-24">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-sage-800 mb-6 font-playfair">
            Get in Touch
          </h1>
          <p className="text-xl text-sage-600 max-w-2xl mx-auto">
            Have questions about our projects? We're here to help and would love to hear from you.
          </p>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {contactInfo.map((info) => (
            <ContactCard key={info.title} info={info} />
          ))}
        </div>
      </div>
    </div>
  )
}