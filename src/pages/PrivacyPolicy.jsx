import { motion } from 'framer-motion'

function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 bg-gradient-to-br from-sage-50 to-sand-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-serif font-bold text-sage-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-sage-600 mb-8">Last updated: November 27, 2025</p>

            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg space-y-8">
              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  1. Information We Collect
                </h2>
                <p className="text-sage-700 leading-relaxed mb-4">
                  We collect information you provide directly to us when you create an account, 
                  register a stay, make a booking, or contact us for support. This may include:
                </p>
                <ul className="list-disc list-inside text-sage-700 space-y-2 ml-4">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Payment information for bookings</li>
                  <li>Stay details and property information</li>
                  <li>Communication preferences</li>
                  <li>Booking history and preferences</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="text-sage-700 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-sage-700 space-y-2 ml-4">
                  <li>Process and manage your bookings and stay registrations</li>
                  <li>Communicate with you about your account and bookings</li>
                  <li>Send you updates, newsletters, and promotional materials (with your consent)</li>
                  <li>Improve our services and user experience</li>
                  <li>Prevent fraud and ensure platform security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  3. Information Sharing
                </h2>
                <p className="text-sage-700 leading-relaxed">
                  We do not sell your personal information. We may share your information with:
                </p>
                <ul className="list-disc list-inside text-sage-700 space-y-2 ml-4 mt-4">
                  <li>Hosts and guests to facilitate bookings</li>
                  <li>Service providers who assist in our operations</li>
                  <li>Legal authorities when required by law</li>
                  <li>Business partners with your explicit consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  4. Data Security
                </h2>
                <p className="text-sage-700 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your 
                  personal information. However, no method of transmission over the internet is 
                  100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  5. Your Rights
                </h2>
                <p className="text-sage-700 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-sage-700 space-y-2 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  6. Cookies and Tracking
                </h2>
                <p className="text-sage-700 leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience, 
                  analyze usage patterns, and deliver personalized content. You can control 
                  cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  7. Changes to This Policy
                </h2>
                <p className="text-sage-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of 
                  significant changes by posting the new policy on this page and updating the 
                  "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  8. Contact Us
                </h2>
                <p className="text-sage-700 leading-relaxed">
                  If you have questions about this Privacy Policy, please contact us at:
                </p>
                <p className="text-sage-700 mt-4">
                  Email: <a href="mailto:nomadicircle@gmail.com" className="text-terracotta-600 hover:underline">nomadicircle@gmail.com</a><br />
                  Phone: <a href="tel:7028642004" className="text-terracotta-600 hover:underline">7028642004</a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicy
