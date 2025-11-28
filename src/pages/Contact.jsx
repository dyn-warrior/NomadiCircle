import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ContactForm from '../components/ContactForm'
import { MapPin, Mail, Phone, Home } from 'lucide-react'

function Contact() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: ['nomadicircle@gmail.com'],
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['7028642004'],
    },
    {
      icon: Home,
      title: 'Register Your Stay',
      details: ['List your homestay, hostel,', 'eco-lodge, or camp with us'],
      isLink: true,
      linkTo: '/register-stay',
    },
  ]

  const [showAllFaqs, setShowAllFaqs] = useState(false)

  const allFaqs = [
    {
      question: 'How do I book a stay?',
      answer: 'You can book directly through our website by browsing stays, selecting your dates, and proceeding to payment.',
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'We offer flexible cancellation up to 7 days before check-in with a full refund. Cancellations within 7 days are non-refundable.',
    },
    {
      question: 'Do you offer group discounts?',
      answer: 'Yes! Groups of 6 or more receive special pricing. Contact us for custom group rates.',
    },
    {
      question: 'Are all stays verified?',
      answer: 'Absolutely! Every stay is reviewed and approved by our team before being listed on the platform.',
    },
    {
      question: 'How do I register my stay?',
      answer: 'Click on "Register Your Stay" in the navigation menu or contact page, fill out the form with your property details, and our team will review it.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept UPI payments. You can pay directly to the host via UPI during the booking process.',
    },
    {
      question: 'Can I modify my booking?',
      answer: 'Yes, you can modify your booking by contacting us at least 48 hours before check-in. Changes are subject to availability.',
    },
    {
      question: 'What if I have special requirements?',
      answer: 'Please mention any special requirements in the message section during booking, or contact us directly and we\'ll do our best to accommodate.',
    },
    {
      question: 'Is travel insurance included?',
      answer: 'Travel insurance is not included but we highly recommend purchasing it separately for your safety and peace of mind.',
    },
    {
      question: 'How do I contact the host?',
      answer: 'Once your booking is confirmed, you will receive the host\'s contact details via email.',
    },
  ]

  const faqs = showAllFaqs ? allFaqs : allFaqs.slice(0, 4)

  return (
    <div className="min-h-screen pt-20">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-br from-sand-100 via-sage-50 to-terracotta-50">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-sage-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-sage-700 max-w-2xl mx-auto">
              Have questions about your next adventure? We're here to help you plan the perfect journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              const CardContent = (
                <>
                  <div className={`inline-block p-3 ${info.isLink ? 'bg-sage-100' : 'bg-terracotta-100'} rounded-full mb-4`}>
                    <Icon className={`w-6 h-6 ${info.isLink ? 'text-sage-600' : 'text-terracotta-600'}`} />
                  </div>
                  <h3 className="font-serif font-bold text-sage-900 mb-3">
                    {info.title}
                  </h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-sage-700 text-sm mb-1">
                      {detail}
                    </p>
                  ))}
                  {info.isLink && (
                    <div className="mt-4">
                      <span className="inline-block px-4 py-2 bg-terracotta-500 text-white rounded-full text-sm font-medium hover:bg-terracotta-600 transition-colors">
                        List Your Stay →
                      </span>
                    </div>
                  )}
                </>
              )

              return info.isLink ? (
                <Link
                  key={index}
                  to={info.linkTo}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-sand-50 rounded-xl p-6 text-center hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-terracotta-300"
                  >
                    {CardContent}
                  </motion.div>
                </Link>
              ) : (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-sand-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  {CardContent}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 bg-sand-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ContactForm />
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Quick Contact */}
              <div className="bg-gradient-to-br from-sage-700 to-terracotta-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-serif font-bold mb-4">
                  Need Immediate Assistance?
                </h3>
                <p className="text-sand-100 mb-6">
                  Our travel experts are available 24/7 for urgent inquiries and booking support.
                </p>
                <a href="tel:7028642004" className="block bg-white text-terracotta-600 px-6 py-3 rounded-full font-medium hover:bg-sand-50 transition-colors w-full text-center">
                  Call Us Now
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold text-sage-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sage-700 text-lg">
              Quick answers to common questions
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-sand-50 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-serif font-bold text-sage-900 mb-2 text-lg">
                  {faq.question}
                </h3>
                <p className="text-sage-700">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            {!showAllFaqs && (
              <>
                <p className="text-sage-700 mb-4">
                  Can't find what you're looking for?
                </p>
                <button 
                  onClick={() => setShowAllFaqs(true)}
                  className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-8 py-3 rounded-full font-medium transition-colors"
                >
                  View All FAQs →
                </button>
              </>
            )}
            {showAllFaqs && (
              <button 
                onClick={() => setShowAllFaqs(false)}
                className="text-sage-600 hover:text-sage-800 font-medium underline"
              >
                ← Show Less
              </button>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact
