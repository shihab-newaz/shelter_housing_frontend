import Navbar from '@/components/home/Navbar'
import Hero from '@/components/home/Hero'
import ProjectShowcase from '@/components/home/ProjectShowcase'
import About from '@/components/home/About'
import Contact from '@/components/home/Contact'
import Footer from '@/components/home/Footer'
import Toolbar from '@/components/home/Toolbar'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ProjectShowcase />
        <About />
        <Contact />
      </main>
      <Footer />
      <Toolbar />
    </div>
  )
}

