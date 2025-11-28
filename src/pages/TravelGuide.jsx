import { motion } from 'framer-motion'
import { MapPin, Calendar, Backpack, Shield, Camera, Users } from 'lucide-react'

function TravelGuide() {
  const guides = [
    {
      icon: MapPin,
      title: 'Planning Your Trip',
      tips: [
        'Research visa requirements well in advance',
        'Book permits for restricted areas (Arunachal Pradesh requires ILP)',
        'Best time to visit: March-May and September-November',
        'Allow extra days for weather delays in mountain regions'
      ]
    },
    {
      icon: Backpack,
      title: 'What to Pack',
      tips: [
        'Layered clothing for varying temperatures',
        'Sturdy trekking shoes with good grip',
        'Reusable water bottle and purification tablets',
        'Basic first aid kit and altitude sickness medication',
        'Power bank and universal adapter'
      ]
    },
    {
      icon: Shield,
      title: 'Safety Tips',
      tips: [
        'Share your itinerary with family/friends',
        'Purchase comprehensive travel insurance',
        'Respect local customs and dress codes',
        'Stay hydrated and acclimatize properly',
        'Keep emergency contacts handy'
      ]
    },
    {
      icon: Users,
      title: 'Cultural Etiquette',
      tips: [
        'Always ask permission before photographing people',
        'Remove shoes before entering homes and monasteries',
        'Use right hand for giving/receiving items',
        'Dress modestly, especially in religious sites',
        'Learn basic local greetings'
      ]
    },
    {
      icon: Camera,
      title: 'Photography Guidelines',
      tips: [
        'Respect "no photography" signs at sacred sites',
        'Ask before photographing locals',
        'Avoid drones without proper permits',
        'Capture sunrise/sunset for best lighting',
        'Pack extra batteries - charging can be limited'
      ]
    },
    {
      icon: Calendar,
      title: 'Festivals & Events',
      tips: [
        'Ziro Music Festival - September',
        'Hornbill Festival, Nagaland - December',
        'Losar (Tibetan New Year) - February/March',
        'Myoko Festival, Ziro - March',
        'Book accommodation early during festivals'
      ]
    }
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-sage-50 to-terracotta-50">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-sage-900 mb-6">
              Travel Guide
            </h1>
            <p className="text-xl text-sage-700 max-w-3xl mx-auto">
              Everything you need to know for an authentic and responsible journey through offbeat destinations
            </p>
          </motion.div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide, index) => {
              const Icon = guide.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-sand-50 rounded-2xl p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="inline-block p-4 bg-terracotta-100 rounded-full mb-6">
                    <Icon className="w-8 h-8 text-terracotta-600" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                    {guide.title}
                  </h3>
                  <ul className="space-y-3">
                    {guide.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sage-700">
                        <span className="text-terracotta-500 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-16 bg-sage-900 text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-serif font-bold mb-6">Emergency Contacts</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sand-200 mb-2">Police</p>
                <p className="text-2xl font-bold text-terracotta-400">100</p>
              </div>
              <div>
                <p className="text-sand-200 mb-2">Ambulance</p>
                <p className="text-2xl font-bold text-terracotta-400">102</p>
              </div>
              <div>
                <p className="text-sand-200 mb-2">Tourist Helpline</p>
                <p className="text-2xl font-bold text-terracotta-400">1363</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default TravelGuide
