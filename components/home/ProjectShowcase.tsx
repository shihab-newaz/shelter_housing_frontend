import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { projects } from '@/constants'


export default function ProjectShowcase() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Our Projects</h2>
        <Tabs defaultValue="completed" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12">
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          {Object.entries(projects).map(([status, projectList]) => (
            <TabsContent key={status} value={status}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {projectList.map((project) => (
                  <Card key={project.id} className="overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
                    <CardHeader className="p-0">
                      <div className="relative">
                        <Image src={project.image} alt={project.title} width={400} height={300} className="w-full" />
                        <Badge className="absolute top-4 right-4 bg-blue-600">{status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                      <CardDescription className="text-gray-600 mb-4">{project.description}</CardDescription>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">Location: {project.location}</span>
                        <span className="text-sm text-gray-500">Units: {project.units}</span>
                      </div>
                      {status === 'ongoing' && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-6">
                      <Button variant="outline" className="w-full">Learn More</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

