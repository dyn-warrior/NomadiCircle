import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Users, DollarSign, Home, Phone, User, Mail, Heart, ArrowLeft, MessageCircle } from 'lucide-react'
import { getApprovedStays } from '../googlesheets/stays'
import ImageLightbox from '../components/ImageLightbox'

function StayDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [stay, setStay] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    const fetchStay = async () => {
      try {
        const stays = await getApprovedStays()
        const foundStay = stays.find(s => s.id === id)
        setStay(foundStay)
      } catch (error) {
        console.error('Error loading stay:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStay()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-terracotta-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sage-700 text-lg">Loading stay details...</p>
        </div>
      </div>
    )
  }

  if (!stay) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-sage-900 mb-4">Stay Not Found</h2>
          <p className="text-sage-700 mb-6">The stay you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-terracotta-500 text-white px-8 py-3 rounded-full hover:bg-terracotta-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const activities = typeof stay.activities === 'string' 
    ? JSON.parse(stay.activities) 
    : stay.activities || {}

  const activeActivities = Object.entries(activities)
    .filter(([_, value]) => value)
    .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'))

  return (
    <div className="min-h-screen bg-sand-50 py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-sage-700 hover:text-terracotta-600 mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image & Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <div 
                className="relative h-96 bg-gradient-to-br from-sage-200 to-terracotta-200 cursor-pointer"
                onClick={() => {
                  if (stay.image_urls && stay.image_urls.length > 0) {
                    setLightboxIndex(0)
                    setLightboxOpen(true)
                  }
                }}
              >
                {stay.image_urls && stay.image_urls[0] ? (
                  <img
                    src={stay.image_urls[0]}
                    alt={stay.stay_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sage-400 text-8xl">
                    🏔️
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-terracotta-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {stay.stay_type}
                </div>
              </div>

              {/* Image Gallery */}
              {stay.image_urls && stay.image_urls.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4 bg-sage-50">
                  {stay.image_urls.slice(1).map((url, index) => (
                    <div 
                      key={index} 
                      className="relative aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
                      onClick={() => {
                        setLightboxIndex(index + 1)
                        setLightboxOpen(true)
                      }}
                    >
                      <img
                        src={url}
                        alt={`${stay.stay_name} - Image ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-4xl font-serif font-bold text-sage-900">{stay.stay_name}</h1>
                  <div className="flex items-center space-x-2 bg-terracotta-50 px-4 py-2 rounded-full">
                    <Heart className="text-terracotta-500" size={20} />
                    <span className="text-sm font-medium text-terracotta-700">Save</span>
                  </div>
                </div>

                <div className="flex items-center text-sage-600 mb-6">
                  <MapPin size={20} className="mr-2 text-terracotta-500" />
                  <span className="text-lg">{stay.location}</span>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-2xl font-serif font-bold text-sage-900 mb-3">About This Stay</h3>
                  <p className="text-sage-700 text-lg leading-relaxed">{stay.description}</p>
                </div>
              </div>
            </motion.div>

            {/* Activities */}
            {activeActivities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-2xl font-serif font-bold text-sage-900 mb-4">Activities Available</h3>
                <div className="flex flex-wrap gap-3">
                  {activeActivities.map((activity, index) => (
                    <span
                      key={index}
                      className="bg-sage-100 text-sage-800 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Room Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-serif font-bold text-sage-900 mb-6">What's Included</h3>
              
              <div className="space-y-6">
                {/* Private Room */}
                {stay.private_room_price && (
                  <div className="border-b border-sage-200 pb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-terracotta-100 rounded-full flex items-center justify-center">
                          <Home className="text-terracotta-600" size={24} />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-sage-900">Private Room</p>
                          <p className="text-2xl font-bold text-terracotta-600">₹{stay.private_room_price}</p>
                        </div>
                      </div>
                    </div>
                    {stay.private_room_description && (
                      <p className="text-sage-700 ml-15">{stay.private_room_description}</p>
                    )}
                  </div>
                )}

                {/* Dorm Room */}
                {stay.dorm_price && (
                  <div className="border-b border-sage-200 pb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-terracotta-100 rounded-full flex items-center justify-center">
                          <Users className="text-terracotta-600" size={24} />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-sage-900">Dorm Bed</p>
                          <p className="text-2xl font-bold text-terracotta-600">₹{stay.dorm_price} <span className="text-sm text-sage-600">per bed</span></p>
                        </div>
                      </div>
                    </div>
                    {stay.dorm_room_description && (
                      <p className="text-sage-700 ml-15">{stay.dorm_room_description}</p>
                    )}
                  </div>
                )}

                {/* Stay Type & Meals */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-terracotta-100 rounded-full flex items-center justify-center">
                      <Home className="text-terracotta-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-sage-600">Stay Type</p>
                      <p className="text-xl font-bold text-sage-900 capitalize">{stay.stay_type}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-terracotta-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="text-terracotta-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-sage-600">Meals Included</p>
                      <p className="text-xl font-bold text-sage-900 capitalize">{stay.meals_included}</p>
                    </div>
                  </div>
                </div>

                {/* Offerings/Amenities */}
                {stay.offerings && Object.values(stay.offerings).some(v => v) && (
                  <div className="pt-6 border-t border-sage-200">
                    <h4 className="text-lg font-bold text-sage-900 mb-4">Amenities</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(stay.offerings)
                        .filter(([_, value]) => value)
                        .map(([key]) => (
                          <div key={key} className="flex items-center space-x-2 text-sage-700">
                            <span className="text-terracotta-500">✓</span>
                            <span className="text-sm">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Host Info & Booking */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg sticky top-24 space-y-6"
            >
              <div className="text-center border-b border-sage-200 pb-6">
                <div className="text-sm text-sage-600 mb-2">Starting from</div>
                <div className="text-4xl font-bold text-terracotta-600 mb-1">
                  ₹{Math.min(...[stay.private_room_price, stay.dorm_price].filter(Boolean))}
                </div>
                <p className="text-sage-600">per night</p>
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-sage-900 mb-4">Meet Your Host</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="text-terracotta-500" size={20} />
                    <div>
                      <p className="text-sm text-sage-600">Host</p>
                      <p className="font-medium text-sage-900">{stay.host_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="text-terracotta-500" size={20} />
                    <div>
                      <p className="text-sm text-sage-600">Contact</p>
                      <a href={`tel:${stay.contact_number}`} className="font-medium text-sage-900 hover:text-terracotta-600 transition-colors">
                        {stay.contact_number}
                      </a>
                    </div>
                  </div>

                  {stay.about_host && (
                    <div className="pt-4 border-t border-sage-200">
                      <p className="text-sm text-sage-700 leading-relaxed">{stay.about_host}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-sage-200">
                <button
                  onClick={() => navigate(`/booking/${stay.id}`)}
                  className="block w-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white text-center px-6 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Book Now
                </button>

                <a
                  href={`https://wa.me/${stay.contact_number?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center px-6 py-4 rounded-full font-medium transition-colors shadow-lg"
                >
                  Contact via WhatsApp
                </a>

                <a
                  href={`tel:${stay.contact_number}`}
                  className="block w-full bg-sage-700 hover:bg-sage-800 text-white text-center px-6 py-4 rounded-full font-medium transition-colors"
                >
                  Call Now
                </a>
              </div>

              <div className="text-center text-sm text-sage-600 pt-4">
                <p>✨ Book directly with the host</p>
                <p>No platform fees</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {lightboxOpen && stay.image_urls && stay.image_urls.length > 0 && (
        <ImageLightbox
          images={stay.image_urls}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  )
}

export default StayDetail
