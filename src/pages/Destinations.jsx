import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import DestinationCard from '../components/DestinationCard'
import HeroSection from '../components/HeroSection'
import { Search, Filter, MapPin } from 'lucide-react'
import { getApprovedStays } from '../googlesheets/stays'

function Destinations() {
  const location = useLocation()
  const [stays, setStays] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Hostel', 'Homestay', 'Guesthouse', 'Farm Stay']

  // Load stays and URL params on mount
  useEffect(() => {
    const fetchStays = async () => {
      try {
        const approvedStays = await getApprovedStays()
        setStays(approvedStays)

        // Read URL search params
        const params = new URLSearchParams(location.search)
        const destination = params.get('destination')
        if (destination) {
          setSearchTerm(destination)
        }
      } catch (error) {
        console.error('Error loading stays:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStays()
  }, [location.search])

  const filteredDestinations = stays.filter(stay => {
    const matchesSearch = !searchTerm || 
      stay.stay_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stay.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stay.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'All' || stay.stay_type === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="pt-20">
        <HeroSection
          title={
            <>
              Discover
              <br />
              <span className="text-terracotta-500">Hidden Himalayas</span>
            </>
          }
          subtitle="From misty valleys to ancient monasteries. These aren't destinations—they're homecomings."
          ctaText="Explore Offbeat Trails"
          onCtaClick={() => document.getElementById('destinations-grid').scrollIntoView({ behavior: 'smooth' })}
        />
      </div>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white border-b border-sand-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sage-400" size={20} />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-sage-300 rounded-full focus:ring-2 focus:ring-terracotta-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
              <Filter className="text-sage-600 flex-shrink-0" size={20} />
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-terracotta-500 text-white'
                        : 'bg-sand-100 text-sage-700 hover:bg-sand-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section id="destinations-grid" className="py-20 bg-sand-50">
        <div className="container mx-auto px-6">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2 text-sage-700">
              <MapPin size={20} />
              <span className="font-medium">
                {loading ? 'Loading...' : `${filteredDestinations.length} ${filteredDestinations.length === 1 ? 'stay' : 'stays'} found`}
                {searchTerm && !loading && ` for "${searchTerm}"`}
              </span>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-20 text-sage-700">
              <div className="text-6xl mb-4">⏳</div>
              <h3 className="text-2xl font-serif font-bold text-sage-900 mb-2">
                Loading stays...
              </h3>
            </div>
          ) : filteredDestinations.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((stay) => (
                <DestinationCard key={stay.id} destination={stay} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-serif font-bold text-sage-900 mb-2">
                No stays found
              </h3>
              <p className="text-sage-700">
                {searchTerm 
                  ? `No stays match "${searchTerm}". Try a different search term.`
                  : 'Try adjusting your search or filter criteria'}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-sage-700 to-terracotta-600 rounded-3xl p-12 text-center text-white"
          >
            <h3 className="text-3xl font-serif font-bold mb-4">
              Get Destination Updates
            </h3>
            <p className="text-sand-100 mb-8 max-w-xl mx-auto">
              Subscribe to receive new destination guides, travel tips, and exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-3 rounded-full text-sage-900 outline-none"
              />
              <button className="bg-white text-terracotta-600 px-8 py-3 rounded-full font-medium hover:bg-sand-50 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Destinations
