import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, ArrowLeft, AlertCircle, Loader } from 'lucide-react'
import { getApprovedStays } from '../googlesheets/stays'
import { verifyPaymentScreenshot } from '../googlesheets/payment'

function PaymentPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const bookingData = location.state

  const [stay, setStay] = useState(null)
  const [loading, setLoading] = useState(true)
  const [screenshot, setScreenshot] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!bookingData) {
      navigate(`/booking/${id}`)
      return
    }

    const fetchStay = async () => {
      try {
        const stays = await getApprovedStays()
        const foundStay = stays.find(s => s.id === id)
        setStay(foundStay)
      } catch (error) {
        console.error('Error loading stay:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStay()
  }, [id, bookingData, navigate])

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Screenshot must be less than 5MB')
        return
      }

      setScreenshot(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setScreenshotPreview(reader.result)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const handleVerifyPayment = async () => {
    if (!screenshot) {
      setError('Please upload payment screenshot')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      // Convert image to base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1]
        
        const result = await verifyPaymentScreenshot(
          base64Image,
          stay.host_name,
          bookingData
        )

        if (result.verified) {
          // Navigate to confirmation page
          navigate(`/booking-confirmed/${id}`, { 
            state: { 
              ...bookingData, 
              bookingId: result.bookingId,
              verifiedAt: new Date().toISOString()
            } 
          })
        } else {
          setError('Payment verification failed: Recipient name does not match. Please ensure you paid to the correct UPI ID.')
        }
      }
      reader.readAsDataURL(screenshot)
    } catch (error) {
      console.error('Error verifying payment:', error)
      setError('Failed to verify payment. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-terracotta-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sage-700 text-lg">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (!stay || !bookingData) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-sage-900 mb-4">Booking Data Not Found</h2>
          <button
            onClick={() => navigate(`/booking/${id}`)}
            className="bg-terracotta-500 text-white px-8 py-3 rounded-full hover:bg-terracotta-600 transition-colors"
          >
            Back to Booking
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/booking/${id}`)}
          className="flex items-center text-sage-700 hover:text-terracotta-600 mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          <span className="font-medium">Back to Room Selection</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-serif font-bold text-sage-900 mb-6">Payment Details</h2>

            {/* Booking Summary */}
            <div className="space-y-4 mb-6 pb-6 border-b border-sage-200">
              <div className="flex justify-between">
                <span className="text-sage-700">Stay</span>
                <span className="font-semibold text-sage-900">{bookingData.stayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sage-700">Room Type</span>
                <span className="font-semibold text-sage-900 capitalize">{bookingData.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sage-700">
                  {bookingData.roomType === 'dorm' ? 'Number of Beds' : 'Rooms'}
                </span>
                <span className="font-semibold text-sage-900">{bookingData.beds}</span>
              </div>
              <div className="flex justify-between text-xl">
                <span className="text-sage-700 font-semibold">Total Amount</span>
                <span className="font-bold text-terracotta-600">₹{bookingData.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* UPI Details */}
            <div className="bg-sage-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-sage-900 mb-4">UPI Payment Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-sage-600">UPI ID</p>
                  <p className="text-lg font-mono font-semibold text-sage-900 bg-white px-4 py-2 rounded-lg">
                    {stay.contact_number}@paytm
                  </p>
                </div>
                <div>
                  <p className="text-sm text-sage-600">Recipient Name</p>
                  <p className="text-lg font-semibold text-sage-900">{stay.host_name}</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center bg-white border-2 border-sage-200 rounded-xl p-6">
              <p className="text-sm text-sage-600 mb-4">Scan to Pay</p>
              {stay.upi_qr_url ? (
                <div className="inline-block p-4 bg-white rounded-xl">
                  <img 
                    src={stay.upi_qr_url} 
                    alt="UPI QR Code" 
                    className="w-64 h-64 object-contain"
                  />
                </div>
              ) : (
                <>
                  <div className="inline-block bg-gradient-to-br from-sage-100 to-terracotta-100 p-8 rounded-xl">
                    <div className="w-48 h-48 flex items-center justify-center text-6xl">
                      📱
                    </div>
                  </div>
                  <p className="text-xs text-sage-500 mt-4">
                    Note: Host has not uploaded a QR code yet. Please use the UPI ID above.
                  </p>
                </>
              )}
            </div>
          </motion.div>

          {/* Upload Screenshot */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-serif font-bold text-sage-900 mb-6">Upload Payment Proof</h2>

            <div className="mb-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-sage-300 rounded-xl p-8 text-center hover:border-terracotta-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  className="hidden"
                  id="screenshot-upload"
                />
                <label
                  htmlFor="screenshot-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="text-sage-400 mb-4" size={48} />
                  <p className="text-sage-700 font-semibold mb-2">Click to upload screenshot</p>
                  <p className="text-sm text-sage-500">PNG, JPG up to 5MB</p>
                </label>
              </div>

              {/* Preview */}
              {screenshotPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <p className="text-sm text-sage-600 mb-2">Preview:</p>
                  <img
                    src={screenshotPreview}
                    alt="Payment screenshot"
                    className="w-full rounded-lg border-2 border-sage-200"
                  />
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyPayment}
              disabled={!screenshot || isVerifying}
              className="w-full bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-sage-300 disabled:cursor-not-allowed text-white text-xl font-semibold py-4 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isVerifying ? (
                <>
                  <Loader className="animate-spin" size={24} />
                  <span>Verifying Payment...</span>
                </>
              ) : (
                <span>Verify & Confirm Booking</span>
              )}
            </button>

            <p className="text-xs text-sage-500 text-center mt-4">
              We use AI to verify that the payment was made to the correct recipient
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
