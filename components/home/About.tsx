import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Users, Home } from 'lucide-react'

const stats = [
  { title: "Years of Experience", value: "25+", icon: Award },
  { title: "Satisfied Clients", value: "10,000+", icon: Users },
  { title: "Projects Completed", value: "500+", icon: Home }
]

export default function About() {
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">About Shelter Housing Limited</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg mb-6">
              Shelter Housing Limited is a premier real estate development company with a passion for creating exceptional living spaces. With over 25 years of experience, we have established ourselves as a trusted name in the industry.
            </p>
            <p className="text-lg mb-6">
              Our commitment to quality, innovation, and customer satisfaction has allowed us to successfully complete numerous projects across various locations. From luxurious residential complexes to smart, sustainable communities, we take pride in shaping the future of urban living.
            </p>
            <p className="text-lg">
              At Shelter Housing Limited, we don't just build houses; we create homes where memories are made and communities thrive.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <stat.icon className="h-12 w-12 mx-auto text-blue-600" />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-3xl font-bold mb-2">{stat.value}</CardTitle>
                  <CardDescription>{stat.title}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

