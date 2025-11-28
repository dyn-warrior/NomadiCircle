import { motion } from 'framer-motion'

function TermsOfService() {
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
              Terms of Service
            </h1>
            <p className="text-sage-600 mb-8">Last updated: November 27, 2025</p>

            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg space-y-8">
              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-sage-700 leading-relaxed">
                  By accessing and using NomadiCircle ("the Platform"), you agree to be bound by 
                  these Terms of Service. If you do not agree to these terms, please do not use 
                  our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  2. User Accounts
                </h2>
                <p className="text-sage-700 leading-relaxed mb-4">
                  When creating an account, you agree to:
                </p>
                <ul className="list-disc list-inside text-sage-700 space-y-2 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Be responsible for all activities under your account</li>
                  <li>Not impersonate others or create multiple accounts</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  3. Booking and Payments
                </h2>
                <p className="text-sage-700 leading-relaxed mb-4">
                  <strong>For Guests:</strong>
                </p>
                <ul className="list-disc list-inside text-sage-700 space-y-2 ml-4 mb-4">
                  <li>Payments are processed securely through UPI</li>
                  <li>Bookings are confirmed only after payment verification</li>
                  <li>You must provide accurate booking dates and guest information</li>
                  <li>You are responsible for reviewing stay details before booking</li>
                </ul>
                <p className="text-sage-700 leading-relaxed mb-4">
                  <strong>For Hosts:</strong>
                </p>
                <ul className="list-disc list-inside text-sage-700 space-y-2 ml-4">
                  <li>You must provide accurate property information and availability</li>
                  <li>You are responsible for maintaining your property and providing listed amenities</li>
                  <li>You must honor confirmed bookings unless exceptional circumstances arise</li>
                  <li>You agree to our payment processing and payout terms</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  4. Cancellation Policy
                </h2>
                <p className="text-sage-700 leading-relaxed mb-4">
                  <strong>Guests:</strong>
                </p>
                <ul className="list-disc list-inside text-sage-700 space-y-2 ml-4 mb-4">
                  <li>Cancellations made 7+ days before check-in: Full refund</li>
                  <li>Cancellations made 3-6 days before check-in: 50% refund</li>
                  <li>Cancellations made within 2 days of check-in: No refund</li>
                </ul>
                <p className="text-sage-700 leading-relaxed mb-4">
                  <strong>Hosts:</strong>
                </p>
                <ul className="list-disc list-inside text-sage-700 space-y-2 ml-4">
                  <li>Cancellations by hosts may result in penalties</li>
                  <li>Repeated cancellations may lead to account suspension</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  5. User Conduct
                </h2>
                <p className="text-sage-700 leading-relaxed mb-4">
                  Users must not:
                </p>
                <ul className="list-disc list-inside text-sage-700 space-y-2 ml-4">
                  <li>Violate any laws or regulations</li>
                  <li>Infringe on others' intellectual property rights</li>
                  <li>Post false, misleading, or fraudulent content</li>
                  <li>Harass, threaten, or discriminate against others</li>
                  <li>Attempt to manipulate reviews or ratings</li>
                  <li>Bypass our payment systems</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  6. Content Ownership
                </h2>
                <p className="text-sage-700 leading-relaxed">
                  You retain ownership of content you post (photos, descriptions, reviews). By 
                  posting content, you grant us a non-exclusive license to use, display, and 
                  distribute it on our platform for promotional purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  7. Liability Limitations
                </h2>
                <p className="text-sage-700 leading-relaxed">
                  NomadiCircle acts as a platform connecting guests and hosts. We are not 
                  responsible for the quality, safety, or legality of stays listed. Users 
                  interact at their own risk. We recommend purchasing travel insurance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  8. Dispute Resolution
                </h2>
                <p className="text-sage-700 leading-relaxed">
                  In case of disputes, we encourage users to resolve issues directly. If unable 
                  to resolve, you may contact our support team. Serious disputes may require 
                  mediation or legal action.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  9. Account Termination
                </h2>
                <p className="text-sage-700 leading-relaxed">
                  We reserve the right to suspend or terminate accounts that violate these terms, 
                  engage in fraudulent activity, or harm the platform's integrity.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  10. Changes to Terms
                </h2>
                <p className="text-sage-700 leading-relaxed">
                  We may modify these terms at any time. Continued use of the platform after 
                  changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                  11. Contact Information
                </h2>
                <p className="text-sage-700 leading-relaxed">
                  For questions about these Terms of Service, contact us at:
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

export default TermsOfService
