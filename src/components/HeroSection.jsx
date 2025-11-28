import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import PropTypes from 'prop-types'

function HeroSection({ 
  title, 
  subtitle, 
  ctaText = 'Explore Offbeat Trails', 
  onCtaClick,
  backgroundImage,
  overlay = true,
  showScrollIndicator = true 
}) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className={`absolute inset-0 ${
          backgroundImage 
            ? 'bg-cover bg-center' 
            : 'bg-gradient-to-br from-sand-100 via-sage-50 to-terracotta-50'
        }`}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        }}
      >
        {overlay && (
          <div className={`absolute inset-0 ${
            backgroundImage 
              ? 'bg-gradient-to-b from-sage-900/60 via-sage-900/40 to-sage-900/60' 
              : 'bg-gradient-to-b from-transparent via-transparent to-sand-100/20'
          }`} />
        )}
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="space-y-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight ${
              backgroundImage ? 'text-white' : 'text-sage-900'
            }`}
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className={`text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto font-light leading-relaxed ${
                backgroundImage ? 'text-sand-100' : 'text-sage-700'
              }`}
            >
              {subtitle}
            </motion.p>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <button
              onClick={onCtaClick}
              className="group bg-terracotta-500 text-white px-10 py-5 rounded-full text-lg font-medium hover:bg-terracotta-600 transition-all shadow-2xl inline-flex items-center space-x-3 hover:shadow-terracotta-500/50 hover:scale-105 transform duration-300"
            >
              <span>{ctaText}</span>
              <ArrowRight 
                size={22} 
                className="group-hover:translate-x-2 transition-transform duration-300" 
              />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={onCtaClick}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex flex-col items-center space-y-2"
          >
            <span className={`text-sm font-medium ${backgroundImage ? 'text-white' : 'text-sage-700'}`}>
              Scroll to explore
            </span>
            <ChevronDown 
              size={24} 
              className={backgroundImage ? 'text-white' : 'text-sage-900'}
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

HeroSection.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.string,
  ctaText: PropTypes.string,
  onCtaClick: PropTypes.func,
  backgroundImage: PropTypes.string,
  overlay: PropTypes.bool,
  showScrollIndicator: PropTypes.bool,
}

export default HeroSection
