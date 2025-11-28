import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Bed, ArrowLeft, CheckCircle } from 'lucide-react'
import { getApprovedStays } from '../googlesheets/stays'

function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [stay, setStay] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedRoomType, setSelectedRoomType] = useState(null)
  const [dormBeds, setDormBeds] = useState(1)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)

  useEffect(() => {
    const fetchStay = async () => {
      try {
        const stays = await getApprovedStays()
        const foundStay = stays.find(s => s.id === id)
        setStay(foundStay)
        
        // Load search data from sessionStorage if available
        const searchData = sessionStorage.getItem('searchData')
        if (searchData) {
          const parsed = JSON.parse(searchData)
          setCheckIn(parsed.checkIn || '')
          setCheckOut(parsed.checkOut || '')
          setGuests(parsed.guests || 1)
        }
      } catch (error) {
        console.error('Error loading stay:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStay()
  }, [id])

  const handleProceedToPayment = () => {
    if (!selectedRoomType) {
      alert('Please select a room type')
      return
    }

    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates')
      return
    }

    // Calculate number of nights
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))

    if (nights <= 0) {
      alert('Check-out date must be after check-in date')
      return
    }

    // Calculate price per night based on room type
    const pricePerNight = selectedRoomType === 'dorm' 
      ? stay.dorm_price * dormBeds 
      : stay.private_room_price

    // Calculate total price (price per night × number of nights)
    const totalPrice = pricePerNight * nights

    const bookingData = {
      stayId: stay.id,
      stayName: stay.stay_name,
      hostName: stay.host_name,
      roomType: selectedRoomType,
      beds: selectedRoomType === 'dorm' ? dormBeds : 1,
      pricePerNight,
      nights,
      totalPrice,
      checkIn,
      checkOut,
      guests
    }

    navigate(`/payment/${id}`, { state: bookingData })
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-terracotta-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sage-700 text-lg">Loading booking options...</p>
        </div>
      </div>
    )
  }

  if (!stay) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-sage-900 mb-4">Stay Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-terracotta-500 text-white px-8 py-3 rounded-full hover:bg-terracotta-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const privateRoomPrice = stay.private_room_price || 0
  const dormPricePerBed = stay.dorm_price || 0
  const totalPrice = selectedRoomType === 'private' 
    ? privateRoomPrice 
    : dormPricePerBed * dormBeds

  // Check if pricing is available
  if (!stay.private_room_price && !stay.dorm_price) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
          <h2 className="text-2xl font-serif font-bold text-sage-900 mb-4">Pricing Not Available</h2>
          <p className="text-sage-600 mb-6">This stay hasn't set up pricing yet. Please contact the host directly or choose another stay.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-terracotta-500 text-white px-8 py-3 rounded-full hover:bg-terracotta-600 transition-colors"
          >
            Back to Home
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
          onClick={() => navigate(`/stay/${id}`)}
          className="flex items-center text-sage-700 hover:text-terracotta-600 mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          <span className="font-medium">Back to Stay Details</span>
        </button>

        {/* Booking Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sage-800 to-terracotta-600 text-white p-8">
            <h1 className="text-3xl font-serif font-bold mb-2">{stay.stay_name}</h1>
            <p className="text-sage-100">{stay.location}</p>
          </div>

          {/* Date Selection */}
          <div className="p-8 border-b border-sage-200">
            <h2 className="text-2xl font-serif font-bold text-sage-900 mb-6">Select Dates</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={getTodayDate()}
                  required
                  className="w-full px-4 py-3 border-2 border-sage-200 rounded-lg focus:border-terracotta-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || getTomorrowDate()}
                  required
                  className="w-full px-4 py-3 border-2 border-sage-200 rounded-lg focus:border-terracotta-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Guests</label>
                <input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  min="1"
                  max="20"
                  className="w-full px-4 py-3 border-2 border-sage-200 rounded-lg focus:border-terracotta-500 focus:outline-none"
                />
              </div>
            </div>
            {stay.check_in_time && stay.check_out_time && (
              <div className="mt-4 p-4 bg-sage-50 rounded-lg">
                <p className="text-sm text-sage-700">
                  <span className="font-medium">Check-in time:</span> {stay.check_in_time} | 
                  <span className="font-medium ml-3">Check-out time:</span> {stay.check_out_time}
                </p>
              </div>
            )}
          </div>

          {/* Room Selection */}
          <div className="p-8">
            <h2 className="text-2xl font-serif font-bold text-sage-900 mb-6">Select Room Type</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Private Room Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedRoomType('private')}
                className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${
                  selectedRoomType === 'private'
                    ? 'border-terracotta-500 bg-terracotta-50'
                    : 'border-sage-200 hover:border-sage-400'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-terracotta-100 rounded-full flex items-center justify-center">
                      <Bed className="text-terracotta-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-sage-900">Private Room</h3>
                      <p className="text-sm text-sage-600">Exclusive space</p>
                    </div>
                  </div>
                  {selectedRoomType === 'private' && (
                    <CheckCircle className="text-terracotta-500" size={28} />
                  )}
                </div>
                <div className="text-3xl font-bold text-terracotta-600">
                  ₹{privateRoomPrice.toFixed(2)}
                  <span className="text-sm text-sage-600 font-normal"> / night</span>
                </div>
                <p className="text-sm text-sage-700 mt-2">Perfect for couples or those who prefer privacy</p>
              </motion.div>

              {/* Dorm Bed Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedRoomType('dorm')}
                className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${
                  selectedRoomType === 'dorm'
                    ? 'border-terracotta-500 bg-terracotta-50'
                    : 'border-sage-200 hover:border-sage-400'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                      <Users className="text-sage-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-sage-900">Dorm Bed</h3>
                      <p className="text-sm text-sage-600">Shared space</p>
                    </div>
                  </div>
                  {selectedRoomType === 'dorm' && (
                    <CheckCircle className="text-terracotta-500" size={28} />
                  )}
                </div>
                <div className="text-3xl font-bold text-terracotta-600">
                  ₹{dormPricePerBed.toFixed(2)}
                  <span className="text-sm text-sage-600 font-normal"> / bed / night</span>
                </div>
                <p className="text-sm text-sage-700 mt-2">Budget-friendly option for solo travelers</p>
              </motion.div>
            </div>

            {/* Dorm Bed Selector */}
            {selectedRoomType === 'dorm' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8 p-6 bg-sage-50 rounded-xl"
              >
                <label className="block text-lg font-semibold text-sage-900 mb-4">
                  Number of Beds
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setDormBeds(Math.max(1, dormBeds - 1))}
                    className="w-12 h-12 bg-white border-2 border-sage-300 rounded-full text-2xl font-bold text-sage-700 hover:bg-sage-100 transition-colors"
                  >
                    -
                  </button>
                  <div className="text-4xl font-bold text-sage-900 min-w-[60px] text-center">
                    {dormBeds}
                  </div>
                  <button
                    onClick={() => setDormBeds(dormBeds + 1)}
                    className="w-12 h-12 bg-white border-2 border-sage-300 rounded-full text-2xl font-bold text-sage-700 hover:bg-sage-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </motion.div>
            )}

            {/* Price Summary */}
            {selectedRoomType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t-2 border-sage-200 pt-6"
              >
                {checkIn && checkOut ? (
                  <>
                    <div className="mb-4 space-y-2">
                      <div className="flex justify-between text-sage-700">
                        <span>Price per night:</span>
                        <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sage-700">
                        <span>Number of nights:</span>
                        <span className="font-semibold">
                          {Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))} nights
                        </span>
                      </div>
                      <div className="border-t border-sage-200 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <p className="text-sage-900 font-medium">Total Amount</p>
                          <p className="text-3xl font-bold text-terracotta-600">
                            ₹{(totalPrice * Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mb-6">
                    <p className="text-sage-600 mb-1">Price per night</p>
                    <p className="text-4xl font-bold text-terracotta-600">
                      ₹{totalPrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-sage-500 mt-2">
                      Select check-in and check-out dates to see total price
                    </p>
                  </div>
                )}

                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xl font-semibold py-4 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Proceed to Payment
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BookingPage
