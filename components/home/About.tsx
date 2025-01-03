import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Users, Home } from 'lucide-react'

/**
 * Statistics data interface
 */
interface Statistic {
  title: string;
  value: string;
  icon: React.ElementType;
  description?: string;
}

/**
 * Company statistics configuration
 */
const stats: Statistic[] = [
  { 
    title: "Years of Experience",
    value: "25+",
    icon: Award,
    description: "Decades of excellence in real estate"
  },
  { 
    title: "Satisfied Clients",
    value: "10,000+",
    icon: Users,
    description: "Happy families in our communities"
  },
  { 
    title: "Projects Completed",
    value: "500+",
    icon: Home,
    description: "Successful developments nationwide"
  }
]

/**
 * StatCard component for displaying individual statistics
 */
function StatCard({ stat, index }: { stat: Statistic; index: number }) {
  return (
    <Card className="text-center bg-sage-50 border-sage-200 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <stat.icon className="h-12 w-12 mx-auto text-sage-600" />
      </CardHeader>
      <CardContent>
        <CardTitle className="text-3xl font-bold mb-2 text-sage-800">
          {stat.value}
        </CardTitle>
        <CardDescription className="text-sage-600">
          {stat.title}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

/**
 * About component providing company information and key statistics
 * Features a responsive grid layout with animated stat cards
 */
export default function About() {
  return (
    <section id="about" className="py-24 bg-sage-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-sage-800 font-playfair">
          About Shelter Housing Limited
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Company description */}
          <div className="space-y-6 text-sage-700">
            <p className="text-lg">
              Shelter Housing Limited is a premier real estate development company 
              with a passion for creating exceptional living spaces. With over 25 
              years of experience, we have established ourselves as a trusted name 
              in the industry.
            </p>
            <p className="text-lg">
              Our commitment to quality, innovation, and customer satisfaction has 
              allowed us to successfully complete numerous projects across various 
              locations. From luxurious residential complexes to smart, sustainable 
              communities, we take pride in shaping the future of urban living.
            </p>
            <p className="text-lg">
              At Shelter Housing Limited, we don't just build houses; we create 
              homes where memories are made and communities thrive.
            </p>
          </div>

          {/* Statistics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}