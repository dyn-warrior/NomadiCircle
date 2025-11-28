import { useState } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'

function JoinCommunity() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    about: '',
    skills: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')
    setSubmitError(false)

    // EmailJS configuration
    const EMAILJS_SERVICE_ID = 'service_vexladb'
    const EMAILJS_TEMPLATE_ID = 'template_wa2t7zr'
    const EMAILJS_PUBLIC_KEY = 'oqYikPwQXLJgbRBdS'

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      message: `Tell us about yourself:\n${formData.about}\n\nCore Skills:\n${formData.skills}`,
      to_email: 'nomadicircle@gmail.com'
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      )
      setSubmitMessage('Thank you for joining our community! We will get back to you soon.')
      setFormData({ name: '', phone: '', email: '', about: '', skills: '' })
    } catch (error) {
      console.error('Failed to send email:', error)
      setSubmitError(true)
      setSubmitMessage('Failed to submit. Please try again or email us directly at nomadicircle@gmail.com')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-terracotta-500 to-sage-700">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
              Join Our Community
            </h1>
            <p className="text-sand-100 text-xl max-w-2xl mx-auto">
              Be part of a movement that's changing the way people travel. Share your skills and passion with our community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-sand-50 rounded-2xl p-8 md:p-12 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sage-900 font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-sage-300 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sage-900 font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-sage-300 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sage-900 font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-sage-300 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Tell us about yourself */}
                <div>
                  <label htmlFor="about" className="block text-sage-900 font-medium mb-2">
                    Tell Us About Yourself *
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 rounded-lg border border-sage-300 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent resize-none"
                    placeholder="Share your story, interests, and why you want to join our community..."
                  />
                </div>

                {/* Core Skills */}
                <div>
                  <label htmlFor="skills" className="block text-sage-900 font-medium mb-2">
                    Core Skills *
                  </label>
                  <textarea
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg border border-sage-300 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent resize-none"
                    placeholder="List your core skills (e.g., photography, writing, cultural knowledge, languages, etc.)"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-terracotta-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-terracotta-700 transition-colors disabled:bg-sage-400 disabled:cursor-not-allowed shadow-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>

                {/* Success/Error Message */}
                {submitMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg text-center ${
                      submitError 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {submitMessage}
                  </motion.div>
                )}
              </form>
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 text-center text-sage-600"
            >
              <p className="mb-4">
                Questions? Contact us directly at{' '}
                <a href="mailto:nomadicircle@gmail.com" className="text-terracotta-600 hover:underline">
                  nomadicircle@gmail.com
                </a>
                {' '}or call{' '}
                <a href="tel:7028642004" className="text-terracotta-600 hover:underline">
                  7028642004
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default JoinCommunity
