import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Check, X, Home, MapPin, DollarSign, Users, Phone, FileText, AlertCircle } from 'lucide-react'
import { registerStay, getStayErrorMessage } from '../googlesheets/stays'
import { getCurrentUser } from '../googlesheets/auth'
import { hasValidToken } from '../googlesheets/oauth'

function RegisterStay() {
  const [hasOAuthToken, setHasOAuthToken] = useState(false)
  const [formData, setFormData] = useState({
    // Section 1: Stay Info
    stayName: '',
    stayType: '',
    description: '',
    location: '',
    
    // Section 2: Experience Highlights
    activities: {
      bonfire: false,
      music: false,
      gaming: false,
      art: false,
      natureWalks: false,
      communityEvents: false,
    },
    
    // Section 3: Essentials
    privateRoomPrice: '',
    privateRoomDescription: '',
    dormPrice: '',
    dormRoomDescription: '',
    mealsIncluded: '',
    checkInTime: '',
    checkOutTime: '',
    offerings: {
      mountainView: false,
      lockers: false,
      hotWater: false,
      waterDispenser: false,
      commonHangout: false,
      valleyView: false,
      storage: false,
      freeWifi: false,
      gaming: false,
      shower: false,
      parking: false,
    },
    images: [],
    upiId: '',
    upiQr: null,
    
    // Section 4: Host Info
    hostName: '',
    contactNumber: '',
    aboutHost: '',
    
    // Section 5: Agreement
    agreeToTerms: false,
  })

  const [imagePreview, setImagePreview] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  // Check OAuth token on mount
  useEffect(() => {
    const checkToken = () => {
      const tokenValid = hasValidToken()
      console.log('🔐 OAuth token check:', tokenValid)
      setHasOAuthToken(tokenValid)
    }
    
    checkToken()
    // Recheck every 5 seconds
    const interval = setInterval(checkToken, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox' && name.startsWith('activity-')) {
      const activityName = name.replace('activity-', '')
      setFormData(prev => ({
        ...prev,
        activities: {
          ...prev.activities,
          [activityName]: checked
        }
      }))
    } else if (type === 'checkbox' && name.startsWith('offering-')) {
      const offeringName = name.replace('offering-', '')
      setFormData(prev => ({
        ...prev,
        offerings: {
          ...prev.offerings,
          [offeringName]: checked
        }
      }))
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleUpiQrUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, upiQr: 'Image must be less than 5MB' }))
      return
    }

    setFormData(prev => ({ ...prev, upiQr: file }))
    setErrors(prev => ({ ...prev, upiQr: '' }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    // No limit on number of images - removed the 3 image restriction
    const newPreviews = []
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, images: 'Each image must be less than 5MB' }))
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result)
        if (newPreviews.length === files.length) {
          setImagePreview(prev => [...prev, ...newPreviews])
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
          }))
        }
      }
      reader.readAsDataURL(file)
    })
    
    setErrors(prev => ({ ...prev, images: '' }))
  }

  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    // Section 1
    if (!formData.stayName.trim()) newErrors.stayName = 'Stay name is required'
    if (!formData.stayType) newErrors.stayType = 'Stay type is required'
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.location.trim()) newErrors.location = 'Location is required'

    // Section 2
    if (!Object.values(formData.activities).some(v => v)) {
      newErrors.activities = 'Select at least one activity'
    }

    // Section 3
    if (!formData.privateRoomPrice || formData.privateRoomPrice < 0) {
      newErrors.privateRoomPrice = 'Private room price is required'
    }
    if (!formData.dormPrice || formData.dormPrice < 0) {
      newErrors.dormPrice = 'Dorm bed price is required'
    }
    if (!formData.mealsIncluded) {
      newErrors.mealsIncluded = 'Please specify meals included'
    }
    // Images made optional for testing
    // if (imagePreview.length < 2) {
    //   newErrors.images = 'Please upload at least 2 images'
    // }

    // Section 4
    if (!formData.hostName.trim()) newErrors.hostName = 'Host name is required'
    if (!formData.contactNumber.trim() || !/^\+?[\d\s-]{10,}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Valid contact number is required'
    }
    if (!formData.upiId.trim()) {
      newErrors.upiId = 'UPI ID is required for receiving payments'
    }
    if (!formData.aboutHost.trim()) {
      newErrors.aboutHost = 'Please tell us about yourself'
    }

    // Section 5
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      console.log('❌ Form validation failed:', errors)
      return
    }

    setIsSubmitting(true)
    console.log('🚀 Form submission started...')

    try {
      // Get current user (with timeout for guest registration)
      console.log('👤 Getting current user...')
      const currentUser = await getCurrentUser()
      console.log('✅ Current user:', currentUser?.id || 'Guest registration')

      // Prepare stay data
      const stayData = {
        stay_name: formData.stayName,
        stay_type: formData.stayType,
        description: formData.description,
        location: formData.location,
        activities: formData.activities,
        private_room_price: formData.privateRoomPrice ? parseFloat(formData.privateRoomPrice) : '',
        private_room_description: formData.privateRoomDescription,
        dorm_price: formData.dormPrice ? parseFloat(formData.dormPrice) : '',
        dorm_room_description: formData.dormRoomDescription,
        meals_included: formData.mealsIncluded,
        check_in_time: formData.checkInTime,
        check_out_time: formData.checkOutTime,
        offerings: formData.offerings,
        host_name: formData.hostName,
        contact_number: formData.contactNumber,
        upi_id: formData.upiId,
        about_host: formData.aboutHost,
      }

      console.log('📝 Stay data prepared:', stayData)

      // Register the stay with images and UPI QR
      console.log('🏠 Registering stay...')
      const result = await registerStay(stayData, formData.images, formData.upiQr, currentUser?.id || null)

      if (result.success) {
        console.log('✅ Stay registered successfully!')
        setSubmitSuccess(true)
        
        // Reset form
        setFormData({
          stayName: '',
          stayType: '',
          description: '',
          location: '',
          activities: {
            bonfire: false,
            music: false,
            gaming: false,
            art: false,
            natureWalks: false,
            communityEvents: false,
          },
          privateRoomPrice: '',
          privateRoomDescription: '',
          dormPrice: '',
          dormRoomDescription: '',
          mealsIncluded: '',
          checkInTime: '',
          checkOutTime: '',
          offerings: {
            mountainView: false,
            lockers: false,
            hotWater: false,
            waterDispenser: false,
            commonHangout: false,
            valleyView: false,
            storage: false,
            freeWifi: false,
            gaming: false,
            shower: false,
            parking: false,
          },
          images: [],
          upiId: '',
          upiQr: null,
          hostName: '',
          contactNumber: '',
          aboutHost: '',
          agreeToTerms: false,
        })
        setImagePreview([])
      } else {
        console.error('❌ Registration failed:', result.error)
        setErrors({ submit: getStayErrorMessage(result.error) })
      }
    } catch (error) {
      console.error('❌ Submission error:', error)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success screen
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Success!</h2>
          <p className="text-gray-600 mb-6">
            Your stay has been registered successfully! Our team will review your submission and get back to you within 24-48 hours.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition"
          >
            Register Another Stay
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 px-4">
            Register Your Stay
          </h1>
          <p className="text-gray-600 text-lg px-4">
            Share your unique experience with travelers seeking authentic connections
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-8"
        >
          {/* Section 1: Stay Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Stay Information</h2>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Stay Name *
              </label>
              <input
                type="text"
                name="stayName"
                value={formData.stayName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.stayName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                placeholder="e.g., Cozy Mountain Retreat"
              />
              {errors.stayName && (
                <p className="text-red-500 text-sm mt-1">{errors.stayName}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Stay Type *
              </label>
              <select
                name="stayType"
                value={formData.stayType}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.stayType ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
              >
                <option value="">Select type...</option>
                <option value="homestay">Homestay</option>
                <option value="farmstay">Farmstay</option>
                <option value="cottage">Cottage</option>
                <option value="villa">Villa</option>
                <option value="traditional">Traditional House</option>
                <option value="eco-lodge">Eco-Lodge</option>
              </select>
              {errors.stayType && (
                <p className="text-red-500 text-sm mt-1">{errors.stayType}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                placeholder="Describe your stay, its surroundings, and what makes it special..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  placeholder="City, State, Country"
                />
              </div>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>
          </div>

          {/* Section 2: Experience Highlights */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Experience Highlights</h2>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                Activities Available *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(formData.activities).map(activity => (
                  <label key={activity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name={`activity-${activity}`}
                      checked={formData.activities[activity]}
                      onChange={handleChange}
                      className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-gray-700 capitalize">
                      {activity.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
              {errors.activities && (
                <p className="text-red-500 text-sm mt-2">{errors.activities}</p>
              )}
            </div>
          </div>

          {/* Section 3: Essentials */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Pricing & Essentials</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Private Room Price (INR)
                </label>
                <input
                  type="number"
                  name="privateRoomPrice"
                  value={formData.privateRoomPrice}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-3 border ${errors.privateRoomPrice ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  placeholder="1500"
                />
                {errors.privateRoomPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.privateRoomPrice}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Dorm Bed Price (INR)
                </label>
                <input
                  type="number"
                  name="dormPrice"
                  value={formData.dormPrice}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-3 border ${errors.dormPrice ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  placeholder="600"
                />
                {errors.dormPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.dormPrice}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Private Room Description
              </label>
              <textarea
                name="privateRoomDescription"
                value={formData.privateRoomDescription}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                placeholder="Describe the private room amenities, size, view, etc."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Dorm Room Description
              </label>
              <textarea
                name="dormRoomDescription"
                value={formData.dormRoomDescription}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                placeholder="Describe the dorm setup, number of beds, facilities, etc."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Check-in Time
                </label>
                <input
                  type="time"
                  name="checkInTime"
                  value={formData.checkInTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Check-out Time
                </label>
                <input
                  type="time"
                  name="checkOutTime"
                  value={formData.checkOutTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Offerings & Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: 'mountainView', label: 'Mountain View', icon: '🏔️' },
                  { key: 'lockers', label: 'Lockers', icon: '🔐' },
                  { key: 'hotWater', label: 'Hot Water', icon: '♨️' },
                  { key: 'waterDispenser', label: 'Water Dispenser', icon: '🚰' },
                  { key: 'commonHangout', label: 'Common Hangout', icon: '🎲' },
                  { key: 'valleyView', label: 'Valley View', icon: '🏞️' },
                  { key: 'storage', label: 'Storage Facility', icon: '🧳' },
                  { key: 'freeWifi', label: 'Free WiFi', icon: '📶' },
                  { key: 'gaming', label: 'Gaming', icon: '🎮' },
                  { key: 'shower', label: 'Shower', icon: '🚿' },
                  { key: 'parking', label: 'Parking', icon: '🅿️' }
                ].map(offering => (
                  <label key={offering.key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name={`offering-${offering.key}`}
                      checked={formData.offerings[offering.key]}
                      onChange={handleChange}
                      className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-2xl">{offering.icon}</span>
                    <span className="text-gray-700 text-sm">{offering.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Meals Included *
              </label>
              <select
                name="mealsIncluded"
                value={formData.mealsIncluded}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.mealsIncluded ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
              >
                <option value="">Select...</option>
                <option value="none">No meals</option>
                <option value="breakfast">Breakfast only</option>
                <option value="breakfast-dinner">Breakfast & Dinner</option>
                <option value="all">All meals</option>
              </select>
              {errors.mealsIncluded && (
                <p className="text-red-500 text-sm mt-1">{errors.mealsIncluded}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Upload Images (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
                  <p className="text-gray-400 text-sm">PNG, JPG up to 5MB each</p>
                </label>
              </div>
              
              {imagePreview.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {errors.images && (
                <p className="text-red-500 text-sm mt-2">{errors.images}</p>
              )}
            </div>
          </div>

          {/* Section 4: Host Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Host Information</h2>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="hostName"
                value={formData.hostName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.hostName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                placeholder="John Doe"
              />
              {errors.hostName && (
                <p className="text-red-500 text-sm mt-1">{errors.hostName}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Contact Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                {errors.contactNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  UPI ID (for payments) *
                </label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.upiId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  placeholder="9876543210@paytm"
                />
                {errors.upiId && (
                  <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                UPI QR Code (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpiQrUpload}
                  className="hidden"
                  id="upi-qr-upload"
                />
                <label htmlFor="upi-qr-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-1">Upload your UPI QR code</p>
                  <p className="text-gray-400 text-sm">PNG, JPG up to 5MB</p>
                </label>
              </div>
              {formData.upiQr && (
                <p className="text-green-600 text-sm mt-2">✓ QR code uploaded: {formData.upiQr.name}</p>
              )}
              {errors.upiQr && (
                <p className="text-red-500 text-sm mt-2">{errors.upiQr}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                About You *
              </label>
              <textarea
                name="aboutHost"
                value={formData.aboutHost}
                onChange={handleChange}
                rows="3"
                className={`w-full px-4 py-3 border ${errors.aboutHost ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                placeholder="Tell travelers about yourself and why you love hosting..."
              />
              {errors.aboutHost && (
                <p className="text-red-500 text-sm mt-1">{errors.aboutHost}</p>
              )}
            </div>
          </div>

          {/* Section 5: Terms & Submit */}
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className={`w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500 mt-1 ${errors.agreeToTerms ? 'border-red-500' : ''}`}
              />
              <label className="text-gray-700">
                I agree to the terms and conditions, and confirm that all information provided is accurate. *
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>
            )}

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !hasOAuthToken}
              className={`w-full py-4 rounded-full font-semibold text-lg transition shadow-lg ${
                isSubmitting || !hasOAuthToken
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white'
              }`}
            >
              {isSubmitting ? 'Submitting...' : !hasOAuthToken ? 'Sign in with Google First' : 'Register Your Stay'}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  )
}

export default RegisterStay
