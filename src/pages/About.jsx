import { motion } from 'framer-motion'
import HeroSection from '../components/HeroSection'
import { Users, Target, Heart, Award, Globe2, Sparkles } from 'lucide-react'

function About() {
  const values = [
    {
      icon: Heart,
      title: 'Authentic Connections',
      description: 'We believe in creating genuine connections between travelers and local communities.',
    },
    {
      icon: Globe2,
      title: 'Sustainable Tourism',
      description: 'Every journey should leave a positive impact on the places we visit and the people we meet.',
    },
    {
      icon: Sparkles,
      title: 'Unique Experiences',
      description: 'We curate one-of-a-kind adventures that go beyond typical tourist attractions.',
    },
  ]

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      bio: 'Former travel journalist with 15 years of exploring off-the-beaten-path destinations.',
      emoji: '👩‍💼',
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of Experiences',
      bio: 'Adventure guide and cultural anthropologist passionate about authentic travel.',
      emoji: '👨‍🏫',
    },
    {
      name: 'Amira Patel',
      role: 'Sustainability Director',
      bio: 'Environmental scientist dedicated to responsible and ethical tourism practices.',
      emoji: '👩‍🔬',
    },
  ]

  const stats = [
    { value: '50+', label: 'Destinations' },
    { value: '10K+', label: 'Happy Travelers' },
    { value: '200+', label: 'Local Partners' },
    { value: '98%', label: 'Satisfaction Rate' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="pt-20">
        <HeroSection
          title={
            <>
              Our Story of
              <br />
              <span className="text-terracotta-500">Authentic Travel</span>
            </>
          }
          subtitle="Building bridges between curious travelers and local communities"
          ctaText="Learn More"
          onCtaClick={() => document.getElementById('mission').scrollIntoView({ behavior: 'smooth' })}
        />
      </div>

      {/* Mission Section */}
      <section id="mission" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block p-3 bg-terracotta-100 rounded-full mb-6">
                <Target className="w-8 h-8 text-terracotta-600" />
              </div>
              <h2 className="text-4xl font-serif font-bold text-sage-900 mb-6">
                Our Mission
              </h2>
              <p className="text-sage-700 text-lg mb-4 leading-relaxed">
                NomadCircle was born from a simple belief: travel should be about authentic connections, 
                not just checking boxes on a tourist map.
              </p>
              <p className="text-sage-700 text-lg leading-relaxed">
                We partner with local guides, artisans, and communities to create experiences that 
                respect cultures, preserve traditions, and support sustainable livelihoods. Every 
                journey with us is designed to be transformative for both travelers and hosts.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-sage-200 to-terracotta-200 flex items-center justify-center text-8xl">
                🌍
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-sand-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-bold text-sage-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-sage-700 text-lg max-w-2xl mx-auto">
              The principles that guide every decision we make and every experience we create
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="inline-block p-4 bg-terracotta-100 rounded-full mb-6">
                    <Icon className="w-8 h-8 text-terracotta-600" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-sage-700 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-terracotta-500 to-sage-700">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Join Our Community
            </h2>
            <p className="text-sand-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Be part of a movement that's changing the way people travel
            </p>
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                window.location.href = '/join-community'
              }}
              className="bg-white text-terracotta-600 px-8 py-4 rounded-full text-lg font-medium hover:bg-sand-50 transition-colors shadow-lg"
            >
              Get Started Today
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
