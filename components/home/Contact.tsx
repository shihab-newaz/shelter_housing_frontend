"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

/**
 * Form data interface
 */
interface FormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Initial form state
 */
const initialFormState: FormData = {
  name: '',
  email: '',
  message: ''
}

/**
 * Contact form component with form validation and submission handling
 */
export default function Contact() {
  const [formData, setFormData] = useState<FormData>(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  /**
   * Handles form input changes
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - Change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  /**
   * Validates form data
   * @returns {boolean} - Validation result
   */
  const validateForm = (): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return (
      formData.name.trim().length >= 2 &&
      emailPattern.test(formData.email) &&
      formData.message.trim().length >= 10
    )
  }

  /**
   * Handles form submission
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check all fields are filled correctly.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form submitted:', formData)
      
      toast({
        title: "Message Sent",
        description: "We'll get back to you soon!",
        variant: "default"
      })
      
      setFormData(initialFormState)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-sage-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-sage-800 font-playfair">
          Contact Us
        </h2>
        
        <Card className="max-w-2xl mx-auto shadow-xl border-sage-200">
          <CardHeader className="bg-sage-100">
            <CardTitle className="text-2xl text-sage-800">Get in Touch</CardTitle>
            <CardDescription className="text-sage-600">
              Have a question or interested in our projects? Send us a message!
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border-sage-200 focus:border-sage-400 focus:ring-sage-400"
                  aria-label="Your name"
                  minLength={2}
                />
              </div>
              
              <div>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border-sage-200 focus:border-sage-400 focus:ring-sage-400"
                  aria-label="Your email address"
                />
              </div>
              
              <div>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full h-32 border-sage-200 focus:border-sage-400 focus:ring-sage-400"
                  aria-label="Your message"
                  minLength={10}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-sage-600 hover:bg-sage-700 text-white transition-colors duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}