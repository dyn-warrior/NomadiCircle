import { useState } from 'react'
import { motion } from 'framer-motion'
import CulturalHighlight from '../components/CulturalHighlight'
import { culturalStories } from '../data'

function Blog() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-sand-100 via-sage-50 to-terracotta-50">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-sage-900 mb-6">
              Stories from the Road
            </h1>
            <p className="text-xl text-sage-700 max-w-2xl mx-auto">
              Art, music, food, and people. This is culture, alive.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cultural Stories Section */}
      <section className="py-24 bg-sage-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {culturalStories.map((story, index) => (
              <CulturalHighlight key={story.id} highlight={story} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-terracotta-500 to-sage-700">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Experience These Stories
            </h2>
            <p className="text-sand-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Don't just read about culture—live it. Book an authentic stay and become part of these traditions.
            </p>
            <button 
              onClick={() => window.location.href = '/destinations'}
              className="bg-white text-terracotta-600 px-8 py-4 rounded-full text-lg font-medium hover:bg-sand-50 transition-colors shadow-lg"
            >
              Explore Stays
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Blog
