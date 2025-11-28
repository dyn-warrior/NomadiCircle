import { useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import ExperienceCard from '../components/ExperienceCard'
import DestinationCard from '../components/DestinationCard'
import CulturalHighlight from '../components/CulturalHighlight'
import SearchBar from '../components/SearchBar'
import { motion } from 'framer-motion'
import { MapPin, Heart, Users, Sparkles } from 'lucide-react'
import { culturalStories, homePageCopy } from '../data'
import { getApprovedStays } from '../googlesheets/stays'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  const [stays, setStays] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch approved stays on component mount
  useEffect(() => {
    const fetchStays = async () => {
      try {
        console.log('🏠 Fetching approved stays...')
        const approvedStays = await getApprovedStays()
        console.log('✅ Approved stays loaded:', approvedStays.length)
        setStays(approvedStays)
      } catch (error) {
        console.error('❌ Error loading stays:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStays()
  }, [])
  // Fade in animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title={homePageCopy.hero.tagline}
        subtitle={homePageCopy.hero.subtitle}
        ctaText={homePageCopy.hero.cta}
        onCtaClick={() => document.getElementById('intro').scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Search Bar */}
      <div className="container mx-auto px-6 -mt-8 relative z-10">
        <SearchBar />
      </div>

      {/* Intro Section */}
      <motion.section
        id="intro"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUp}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-serif font-bold text-sage-900 mb-6"
          >
            {homePageCopy.intro.title}
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-sage-700 leading-relaxed font-light"
          >
            {homePageCopy.intro.text}
          </motion.p>
        </div>
      </motion.section>

      {/* Offbeat Destinations Section */}
      <section className="py-24 bg-sand-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-block p-3 bg-terracotta-100 rounded-full mb-4"
            >
              <MapPin className="w-6 h-6 text-terracotta-600" />
            </motion.div>
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-serif font-bold text-sage-900 mb-4"
            >
              {homePageCopy.destinations.title}
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-sage-700 font-light"
            >
              {homePageCopy.destinations.subtitle}
            </motion.p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-terracotta-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-sage-700">Loading stays...</p>
            </div>
          ) : stays.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-md">
              <MapPin className="w-16 h-16 text-sage-400 mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-bold text-sage-900 mb-2">No Stays Yet</h3>
              <p className="text-sage-700 mb-6">Be the first to register your unique stay!</p>
              <a href="/register-stay" className="inline-block bg-terracotta-500 text-white px-8 py-3 rounded-full hover:bg-terracotta-600 transition-colors">
                Register Your Stay
              </a>
            </div>
          ) : (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {stays.slice(0, 6).map((stay) => (
                <motion.div key={stay.id} variants={fadeInUp}>
                  <DestinationCard destination={{
                    id: stay.id,
                    name: stay.stay_name,
                    location: stay.location,
                    description: stay.description,
                    price: stay.price_per_night,
                    rating: 5.0,
                    image_urls: stay.image_urls,
                    category: stay.stay_type,
                    host_name: stay.host_name,
                    contact_number: stay.contact_number
                  }} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-12"
          >
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                navigate('/destinations')
              }}
              className="bg-sage-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-sage-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform duration-300"
            >
              View All Destinations
            </button>
          </motion.div>
        </div>
      </section>

      {/* Cultural Stories Section */}
      <section className="py-24 bg-sage-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-block p-3 bg-terracotta-100 rounded-full mb-4"
            >
              <Sparkles className="w-6 h-6 text-terracotta-600" />
            </motion.div>
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-serif font-bold text-sage-900 mb-4"
            >
              {homePageCopy.cultural.title}
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-sage-700 font-light"
            >
              {homePageCopy.cultural.subtitle}
            </motion.p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            {culturalStories.map((story, index) => (
              <CulturalHighlight key={story.id} highlight={story} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-12"
          >
            {[
              {
                icon: MapPin,
                title: 'Offbeat Trails',
                description: 'Venture beyond guidebooks to valleys, villages, and hidden paths where few tourists tread.',
              },
              {
                icon: Users,
                title: 'Local Communities',
                description: 'Stay with families, share meals, learn skills. This is travel as cultural exchange.',
              },
              {
                icon: Heart,
                title: 'Slow Travel',
                description: 'No rush. No checklists. Just presence, connection, and stories worth remembering.',
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="text-center p-8 rounded-2xl bg-sand-50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="inline-block p-4 bg-terracotta-100 rounded-full mb-6">
                    <Icon className="w-8 h-8 text-terracotta-600" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-sage-700 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-24 bg-gradient-to-br from-terracotta-500 via-sage-700 to-sage-900 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              {homePageCopy.cta.title}
            </h2>
            <p className="text-xl md:text-2xl text-sand-100 mb-10 max-w-2xl mx-auto font-light">
              {homePageCopy.cta.subtitle}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-terracotta-600 px-10 py-5 rounded-full text-lg font-medium hover:bg-sand-50 transition-all shadow-2xl"
            >
              Plan Your Journey
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home
