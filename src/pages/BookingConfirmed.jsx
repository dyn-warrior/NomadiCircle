import { useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Download, Home, Calendar, MapPin, Users, DollarSign } from 'lucide-react'

function BookingConfirmed() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const bookingData = location.state

  useEffect(() => {
    if (!bookingData) {
      navigate(`/stay/${id}`)
    }
  }, [bookingData, id, navigate])

  if (!bookingData) {
    return null
  }

  const handleDownloadReceipt = () => {
    // In production, generate a proper PDF receipt
    const receiptText = `
BOOKING CONFIRMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Booking ID: ${bookingData.bookingId}
Date: ${new Date(bookingData.verifiedAt).toLocaleString()}

STAY DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${bookingData.stayName}
Host: ${bookingData.hostName}

BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Room Type: ${bookingData.roomType.toUpperCase()}
${bookingData.roomType === 'dorm' ? 'Beds' : 'Rooms'}: ${bookingData.beds}
Total Amount: ₹${bookingData.totalPrice.toFixed(2)}

STATUS: CONFIRMED ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Thank you for booking with NomadiCircle!
    `

    const blob = new Blob([receiptText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `booking-${bookingData.bookingId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sand-50 py-12 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="container mx-auto px-6 max-w-3xl"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-green-100 rounded-full p-6 mb-6">
            <CheckCircle className="text-green-600" size={80} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-sage-900 mb-4">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-xl text-sage-700">
            Your payment has been verified successfully
          </p>
        </motion.div>

        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sage-800 to-terracotta-600 text-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sage-100 mb-1">Booking ID</p>
                <p className="text-2xl font-mono font-bold">{bookingData.bookingId}</p>
              </div>
              <div className="text-right">
                <p className="text-sage-100 mb-1">Status</p>
                <div className="inline-block bg-green-500 px-4 py-2 rounded-full font-semibold">
                  CONFIRMED
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-8">
            <h2 className="text-2xl font-serif font-bold text-sage-900 mb-6">Booking Details</h2>

            <div className="space-y-6">
              {/* Stay Info */}
              <div className="flex items-start space-x-4 pb-6 border-b border-sage-200">
                <div className="w-12 h-12 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Home className="text-terracotta-600" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-sage-600">Stay</p>
                  <p className="text-xl font-semibold text-sage-900">{bookingData.stayName}</p>
                  <p className="text-sage-700">Host: {bookingData.hostName}</p>
                </div>
              </div>

              {/* Room Details */}
              <div className="flex items-start space-x-4 pb-6 border-b border-sage-200">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="text-sage-600" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-sage-600">Room Type</p>
                  <p className="text-xl font-semibold text-sage-900 capitalize">{bookingData.roomType} Room</p>
                  <p className="text-sage-700">
                    {bookingData.roomType === 'dorm' 
                      ? `${bookingData.beds} bed${bookingData.beds > 1 ? 's' : ''}`
                      : '1 private room'}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-start space-x-4 pb-6 border-b border-sage-200">
                <div className="w-12 h-12 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-terracotta-600" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-sage-600">Booking Date</p>
                  <p className="text-xl font-semibold text-sage-900">
                    {new Date(bookingData.verifiedAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sage-700">
                    {new Date(bookingData.verifiedAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-sage-600">Amount Paid</p>
                  <p className="text-3xl font-bold text-green-600">
                    ₹{bookingData.totalPrice.toFixed(2)}
                  </p>
                  <p className="text-sage-700">Payment verified ✓</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handleDownloadReceipt}
                className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold py-4 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Download size={20} />
                <span>Download Receipt</span>
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full bg-sage-100 hover:bg-sage-200 text-sage-900 font-semibold py-4 rounded-full transition-all"
              >
                Back to Home
              </button>
            </div>

            {/* Footer Note */}
            <div className="mt-6 p-4 bg-sage-50 rounded-lg">
              <p className="text-sm text-sage-700 text-center">
                📧 A confirmation email has been sent to your registered email address.
                <br />
                Please contact the host for check-in details.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default BookingConfirmed
