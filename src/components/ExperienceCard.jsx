import { motion } from 'framer-motion'
import { Clock, Users, Heart, MapPin } from 'lucide-react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ExperienceCard({ experience }) {
  // Support both old experience structure and new stay structure
  const title = experience.stay_name || experience.title
  const description = experience.description
  const location = experience.location
  const stayType = experience.stay_type
  const imageUrls = experience.image_urls || (experience.image ? [experience.image] : [])
  const image = imageUrls && imageUrls.length > 0 ? imageUrls[0] : null
  
  // For old structure compatibility
  const duration = experience.duration
  const groupSize = experience.groupSize
  const tags = experience.tags || []
  
  // Calculate price to display
  let price = experience.price
  if (!price && (experience.private_room_price || experience.dorm_price)) {
    const prices = [experience.private_room_price, experience.dorm_price].filter(p => p && p > 0)
    price = prices.length > 0 ? Math.min(...prices) : null
  }
  
  const [isFavorite, setIsFavorite] = useState(false)
  const navigate = useNavigate()

  const handleCardClick = () => {
    if (experience.id) {
      navigate(`/stay/${experience.id}`)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow relative cursor-pointer"
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsFavorite(!isFavorite)
        }}
        className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
        aria-label="Add to favorites"
      >
        <Heart
          size={20}
          className={`transition-colors ${
            isFavorite ? 'fill-terracotta-500 text-terracotta-500' : 'text-sage-600'
          }`}
        />
      </button>

      {/* Stay Type Badge */}
      {stayType && (
        <div className="absolute top-4 left-4 z-10 bg-terracotta-500 text-white px-3 py-1 rounded-full text-xs font-medium">
          {stayType}
        </div>
      )}

      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <div
          className="w-full h-full bg-gradient-to-br from-terracotta-200 to-sage-200"
          style={{
            backgroundImage: image ? `url(${image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!image && (
            <div className="flex items-center justify-center h-full text-sage-400 text-5xl">
              🌄
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-serif font-bold text-sage-900 mb-3">{title}</h3>
        
        {location && (
          <div className="flex items-center text-sage-600 mb-2">
            <MapPin size={14} className="mr-1" />
            <span className="text-sm">{location}</span>
          </div>
        )}
        
        <p className="text-sage-700 mb-4 line-clamp-2">{description}</p>

        {/* Meta Information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-sage-600">
            {duration && (
              <div className="flex items-center space-x-1">
                <Clock size={16} />
                <span>{duration}</span>
              </div>
            )}
            {groupSize && (
              <div className="flex items-center space-x-1">
                <Users size={16} />
                <span>{groupSize}</span>
              </div>
            )}
          </div>
          
          {price && (
            <div className="text-right">
              <span className="text-lg font-bold text-terracotta-600">
                ${typeof price === 'number' ? price.toFixed(2) : price}
              </span>
              <span className="text-xs text-sage-600"> / night</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-sand-100 text-sage-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

ExperienceCard.propTypes = {
  experience: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    duration: PropTypes.string,
    groupSize: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
}

export default ExperienceCard
