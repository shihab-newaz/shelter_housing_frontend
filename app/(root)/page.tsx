
import Hero from '@/components/home/Hero'
import ProjectShowcase from '@/components/home/ProjectShowcase'
import About from '@/components/home/About'
import Contact from '@/components/home/Contact'


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      <main className="flex-grow">
        <Hero />
        <ProjectShowcase />
        <About />
        <Contact />
      </main>
    </div>
  )
}

