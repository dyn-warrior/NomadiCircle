import { useState } from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

function CulturalHighlight({ highlight, index = 0 }) {
  const { title, category, description, location, image, icon, fullStory } = highlight
  const isEven = index % 2 === 0
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-20 ${
        isEven ? '' : 'lg:grid-flow-dense'
      }`}
    >
      {/* Image Section */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`relative group ${isEven ? '' : 'lg:col-start-2'}`}
      >
        <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
          <div
            className="w-full h-full bg-gradient-to-br from-sage-200 to-terracotta-200 group-hover:scale-110 transition-transform duration-700"
            style={{
              backgroundImage: image ? `url(${image})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {!image && (
              <div className="flex items-center justify-center h-full">
                <span className="text-8xl">{icon || '🎨'}</span>
              </div>
            )}
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-terracotta-600 font-medium text-sm">{category}</span>
          </div>

          {/* Location Badge */}
          {location && (
            <div className="absolute bottom-6 right-6 bg-sage-900/90 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-sand-100 text-sm">📍 {location}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Text Section */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={`space-y-6 ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}
      >
        <h3 className="text-3xl lg:text-4xl font-serif font-bold text-sage-900 leading-tight">
          {title}
        </h3>
        
        <p className="text-sage-700 text-lg leading-relaxed">
          {description}
        </p>

        {isExpanded && fullStory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sage-700 text-lg leading-relaxed space-y-4 pt-4 border-t border-sage-200"
          >
            {fullStory.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </motion.div>
        )}

        {fullStory && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-terracotta-600 font-medium inline-flex items-center space-x-2 group"
          >
            <span>{isExpanded ? 'Show less' : 'Explore this story'}</span>
            <motion.span
              className="inline-block"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isExpanded ? '↑' : '→'}
            </motion.span>
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  )
}

CulturalHighlight.propTypes = {
  highlight: PropTypes.shape({
    title: PropTypes.string.isRequired,
    category: PropTypes.string,
    description: PropTypes.string.isRequired,
    location: PropTypes.string,
    image: PropTypes.string,
    icon: PropTypes.string,
  }).isRequired,
  index: PropTypes.number,
}

export default CulturalHighlight
