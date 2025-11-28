// Google Sheets Stays functions
import { getSheetValues, appendSheetValues, parseSheetData } from './config'

/**
 * Upload images to ImgBB (free image hosting service)
 * Returns array of hosted image URLs
 */
export async function uploadStayImages(images, userId) {
  try {
    console.log(`Starting image upload for ${images.length} images, userId: ${userId}`)
    
    const imageUrls = []
    
    // ImgBB API key
    const IMGBB_API_KEY = '841c1ea2c9f28942c54830acde06a8bf'
    
    for (let i = 0; i < images.length; i++) {
      const file = images[i]
      console.log(`Uploading file ${i + 1}/${images.length}: ${file.name}`)
      console.log(`File size: ${(file.size / 1024).toFixed(2)} KB`)
      
      try {
        // Convert to base64
        const reader = new FileReader()
        const base64 = await new Promise((resolve) => {
          reader.onloadend = () => {
            // Remove the data:image/...;base64, prefix
            const base64String = reader.result.split(',')[1]
            resolve(base64String)
          }
          reader.readAsDataURL(file)
        })
        
        // Upload to ImgBB
        const formData = new FormData()
        formData.append('image', base64)
        formData.append('name', `${userId}_${Date.now()}_${i}`)
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: formData
        })
        
        const data = await response.json()
        
        if (data.success) {
          const imageUrl = data.data.url
          imageUrls.push(imageUrl)
          console.log(`✅ File ${i + 1} uploaded: ${imageUrl}`)
        } else {
          console.error(`Failed to upload image ${i + 1}:`, data)
          // Fallback: use a placeholder
          imageUrls.push(`https://via.placeholder.com/800x600?text=${encodeURIComponent(file.name)}`)
        }
      } catch (uploadError) {
        console.error(`Error uploading image ${i + 1}:`, uploadError)
        // Fallback: use a placeholder
        imageUrls.push(`https://via.placeholder.com/800x600?text=Upload+Failed`)
      }
    }
    
    console.log('All images processed successfully:', imageUrls)
    return imageUrls
  } catch (error) {
    console.error('Error processing images:', error)
    throw error
  }
}

/**
 * Submit a new stay registration
 */
export async function registerStay(stayData, images = null, upiQrImage = null, userId = null) {
  try {
    console.log('Starting stay registration...', { userId, hasImages: images?.length > 0, hasUpiQr: !!upiQrImage })
    
    // Process stay images first
    let imageUrls = []
    if (images && images.length > 0) {
      console.log(`Processing ${images.length} images...`)
      imageUrls = await uploadStayImages(images, userId || 'guest')
      console.log('Images processed successfully:', imageUrls)
    }
    
    // Process UPI QR code image
    let upiQrUrl = ''
    if (upiQrImage) {
      console.log('Uploading UPI QR code...')
      const qrUrls = await uploadStayImages([upiQrImage], userId || 'guest')
      upiQrUrl = qrUrls[0]
      console.log('UPI QR uploaded:', upiQrUrl)
    }
    
    // Create stay ID
    const stayId = `stay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Prepare data for database
    // Store image URLs as comma-separated string (now they're short URLs from ImgBB)
    const imageData = imageUrls.length > 0 ? imageUrls.join(', ') : ''
    
    // Column order: id | stay_name | stay_type | description | location | activities | private_room_price | private_room_description | dorm_price | dorm_room_description | meals_included | check_in_time | check_out_time | offerings | image_urls | host_id | host_name | contact_number | upi_id | upi_qr_url | about_host | status | created_at
    const rowValues = [
      stayId,                                                    // A: id
      stayData.stay_name || stayData.stayName,                 // B: stay_name
      stayData.stay_type || stayData.stayType,                 // C: stay_type
      stayData.description,                                     // D: description
      stayData.location,                                        // E: location
      JSON.stringify(stayData.activities),                      // F: activities
      stayData.private_room_price || stayData.privateRoomPrice || '', // G: private_room_price
      stayData.private_room_description || stayData.privateRoomDescription || '', // H: private_room_description
      stayData.dorm_price || stayData.dormPrice || '',         // I: dorm_price
      stayData.dorm_room_description || stayData.dormRoomDescription || '', // J: dorm_room_description
      stayData.meals_included || stayData.mealsIncluded,       // K: meals_included
      stayData.check_in_time || stayData.checkInTime || '',    // L: check_in_time
      stayData.check_out_time || stayData.checkOutTime || '',  // M: check_out_time
      JSON.stringify(stayData.offerings || {}),                 // N: offerings
      imageData,                                                // O: image_urls
      userId || 'guest',                                        // P: host_id
      stayData.host_name || stayData.hostName,                 // Q: host_name
      stayData.contact_number || stayData.contactNumber,       // R: contact_number
      stayData.upi_id || stayData.upiId || '',                 // S: upi_id
      upiQrUrl,                                                 // T: upi_qr_url
      stayData.about_host || stayData.aboutHost,               // U: about_host
      'pending',                                                // V: status
      new Date().toISOString()                                  // W: created_at
    ]
    
    console.log('Adding stay to Google Sheets...')
    
    // Add row to sheet
    await appendSheetValues('Stays', rowValues)
    
    console.log('✅ Stay registered successfully!')
    
    return {
      success: true,
      data: { id: stayId }
    }
  } catch (error) {
    console.error('Error registering stay:', error)
    return {
      success: false,
      error: error.message || 'Failed to register stay'
    }
  }
}

/**
 * Get all approved stays
 */
export async function getApprovedStays() {
  try {
    console.log('📊 Fetching stays from Google Sheets...')
    const values = await getSheetValues('Stays')
    console.log('📋 Raw sheet headers:', values[0])
    console.log('📋 Total rows:', values.length)
    
    const stays = parseSheetData(values)
    console.log('🔍 Parsed stays count:', stays.length)
    console.log('🔍 First stay sample:', stays[0])
    console.log('🔍 Stays with status:', stays.map(s => ({ name: s.stay_name, status: s.status })))
    
    // Filter approved stays (case-insensitive)
    const approvedStays = stays
      .filter(stay => {
        const status = (stay.status || '').toLowerCase().trim()
        console.log(`Checking stay "${stay.stay_name}": status="${status}" (approved: ${status === 'approved'})`)
        return status === 'approved'
      })
      .map(stay => {
        // Parse image URLs - they're stored as comma-separated URLs
        let imageUrls = []
        if (stay.image_urls) {
          imageUrls = stay.image_urls
            .split(', ')
            .filter(url => url && url.trim().startsWith('http'))
        }
        
        return {
          id: stay.id,
          stay_name: stay.stay_name,
          stay_type: stay.stay_type,
          description: stay.description,
          location: stay.location,
          activities: JSON.parse(stay.activities || '{}'),
          private_room_price: stay.private_room_price ? parseFloat(stay.private_room_price) : null,
          private_room_description: stay.private_room_description || '',
          dorm_price: stay.dorm_price ? parseFloat(stay.dorm_price) : null,
          dorm_room_description: stay.dorm_room_description || '',
          meals_included: stay.meals_included,
          check_in_time: stay.check_in_time || '',
          check_out_time: stay.check_out_time || '',
          offerings: JSON.parse(stay.offerings || '{}'),
          image_urls: imageUrls,
          host_id: stay.host_id,
          host_name: stay.host_name,
          contact_number: stay.contact_number,
          upi_id: stay.upi_id || '',
          upi_qr_url: stay.upi_qr_url || '',
          about_host: stay.about_host,
          status: stay.status,
          created_at: stay.created_at
        }
      })
    
    console.log('✅ Filtered approved stays:', approvedStays.length)
    return approvedStays
  } catch (error) {
    console.error('Error fetching stays:', error)
    throw error
  }
}

/**
 * Get stays by host ID
 */
export async function getHostStays(hostId) {
  try {
    const values = await getSheetValues('Stays')
    const stays = parseSheetData(values)
    
    // Filter by host ID
    const hostStays = stays
      .filter(stay => stay.host_id === hostId)
      .map(stay => {
        // Parse image URLs
        let imageUrls = []
        if (stay.image_urls) {
          imageUrls = stay.image_urls
            .split(', ')
            .filter(url => url && url.trim().startsWith('http'))
        }
        
        return {
          id: stay.id,
          stay_name: stay.stay_name,
          stay_type: stay.stay_type,
          description: stay.description,
          location: stay.location,
          activities: JSON.parse(stay.activities || '{}'),
          private_room_price: stay.private_room_price ? parseFloat(stay.private_room_price) : null,
          private_room_description: stay.private_room_description || '',
          dorm_price: stay.dorm_price ? parseFloat(stay.dorm_price) : null,
          dorm_room_description: stay.dorm_room_description || '',
          meals_included: stay.meals_included,
          check_in_time: stay.check_in_time || '',
          check_out_time: stay.check_out_time || '',
          offerings: JSON.parse(stay.offerings || '{}'),
          image_urls: imageUrls,
          host_id: stay.host_id,
          host_name: stay.host_name,
          contact_number: stay.contact_number,
          upi_id: stay.upi_id || '',
          upi_qr_url: stay.upi_qr_url || '',
          about_host: stay.about_host,
          status: stay.status,
          created_at: stay.created_at
        }
      })
    
    return hostStays
  } catch (error) {
    console.error('Error fetching host stays:', error)
    throw error
  }
}

/**
 * Get error message for user display
 */
export function getStayErrorMessage(error) {
  if (error.message?.includes('image')) {
    return 'Failed to process images. Please try again with smaller files.'
  }
  if (error.message?.includes('permission')) {
    return 'Permission denied. Please ensure you are logged in.'
  }
  return 'Something went wrong. Please try again later.'
}

export default {
  uploadStayImages,
  registerStay,
  getApprovedStays,
  getHostStays,
  getStayErrorMessage
}
