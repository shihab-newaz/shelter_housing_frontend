// app/about/page.tsx
import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, Home, CheckCircle2 } from 'lucide-react'

/**
 * Company values interface
 */
interface CompanyValue {
  title: string;
  description: string;
  icon: React.ElementType;
}

/**
 * Company values configuration
 */
const companyValues: CompanyValue[] = [
  {
    title: "Quality Excellence",
    description: "We maintain the highest standards in construction and design.",
    icon: CheckCircle2
  },
  {
    title: "Customer Focus",
    description: "Your satisfaction and comfort are our top priorities.",
    icon: Users
  },
  {
    title: "Sustainable Development",
    description: "Building with respect for the environment and future generations.",
    icon: Home
  },
  {
    title: "Innovation",
    description: "Embracing modern technology and design principles.",
    icon: Award
  }
]

/**
 * Value card component for displaying company values
 */
function ValueCard({ value }: { value: CompanyValue }) {
  const Icon = value.icon
  
  return (
    <Card className="p-6 bg-sage-50 border-sage-200 hover:shadow-lg transition-shadow duration-300">
      <CardContent className="flex items-start space-x-4 p-0">
        <Icon className="h-6 w-6 text-sage-600 mt-1" />
        <div>
          <h3 className="text-xl font-semibold mb-2 text-sage-800">{value.title}</h3>
          <p className="text-sage-600">{value.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * About page component showcasing company information and values
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-sage-100 py-24">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-sage-800 mb-6 font-playfair">
            About Shelter Housing
          </h1>
          <p className="text-xl text-sage-600 max-w-3xl mx-auto">
            Building exceptional homes and sustainable communities since 1998.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto mb-16 bg-white p-8 rounded-lg shadow-lg border border-sage-200">
          <h2 className="text-3xl font-semibold mb-6 text-sage-800">Our Mission</h2>
          <p className="text-sage-700 text-lg leading-relaxed">
            At Shelter Housing, we're committed to transforming the urban landscape
            through innovative design, sustainable practices, and unwavering dedication
            to quality. Our mission is to create living spaces that inspire, endure,
            and enhance the lives of our residents.
          </p>
        </div>

        {/* Company Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {companyValues.map((value) => (
            <ValueCard key={value.title} value={value} />
          ))}
        </div>
      </div>
    </div>
  )
}

