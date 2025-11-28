import { motion } from 'framer-motion'
import { MapPin, Star } from 'lucide-react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

function DestinationCard({ destination }) {
  // Support both old destination structure and new stay structure
  const id = destination.id
  const name = destination.stay_name || destination.name
  const location = destination.location
  const description = destination.description
  const rating = destination.rating
  const category = destination.stay_type || destination.category
  const imageUrls = destination.image_urls || (destination.image ? [destination.image] : [])
  
  // For price, show the minimum price available
  let price = destination.price
  if (!price && (destination.private_room_price || destination.dorm_price)) {
    const prices = [destination.private_room_price, destination.dorm_price].filter(p => p && p > 0)
    price = prices.length > 0 ? Math.min(...prices) : null
  }

  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden group">
        {imageUrls && imageUrls.length > 0 ? (
          <img
            src={imageUrls[0]}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sage-200 to-terracotta-200 flex items-center justify-center">
            <div className="text-sage-400 text-6xl">🏔️</div>
          </div>
        )}
        
        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-4 bg-terracotta-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            {category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-2xl font-serif font-bold text-sage-900">{name}</h3>
          {rating && (
            <div className="flex items-center space-x-1 text-terracotta-500">
              <Star size={16} fill="currentColor" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          )}
        </div>

        <div className="flex items-center text-sage-600 mb-3">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{location}</span>
        </div>

        <p className="text-sage-700 mb-4 line-clamp-3">{description}</p>

        <div className="flex items-center justify-between">
          <div>
            {price && (
              <p className="text-2xl font-bold text-terracotta-600">
                ₹{typeof price === 'number' ? price.toFixed(2) : price}
                <span className="text-sm text-sage-600 font-normal"> / night</span>
              </p>
            )}
          </div>
          <button 
            onClick={() => navigate(`/stay/${id}`)}
            className="bg-sage-800 hover:bg-sage-900 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  )
}

DestinationCard.propTypes = {
  destination: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    stay_name: PropTypes.string,
    location: PropTypes.string.isRequired,
    image: PropTypes.string,
    image_urls: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string.isRequired,
    rating: PropTypes.number,
    price: PropTypes.number,
    private_room_price: PropTypes.number,
    dorm_price: PropTypes.number,
    category: PropTypes.string,
    stay_type: PropTypes.string,
  }).isRequired,
}

export default DestinationCard
