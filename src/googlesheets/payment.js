// Payment verification using Google Gemini AI
import { appendSheetValues } from './config'

/**
 * Verify payment screenshot using Google Gemini AI
 * Checks if recipient name matches the host name
 */
export async function verifyPaymentScreenshot(base64Image, expectedHostName, bookingData) {
  try {
    console.log('🔍 Starting payment verification...')
    console.log('Expected host name:', expectedHostName)

    // Google Gemini API key
    const GEMINI_API_KEY = 'AIzaSyBrvZ9tj8Ma_Za84xanNCale2KfEQK3MCE'
    
    // Call Gemini Vision API with Gemini 2.0 Flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `You are a STRICT payment verification system. Your job is to verify if the payment was made to the correct person.

TASK: Find the RECIPIENT name in this payment screenshot and check if it EXACTLY matches: "${expectedHostName}"

STRICT RULES:
1. Find the recipient/beneficiary name (labels: "To:", "Paid to:", "Beneficiary:", "Recipient:", "Account Name:")
2. The recipient name must be AT THE TOP of the screenshot
3. Compare ONLY the recipient name with "${expectedHostName}"
4. The names must match EXACTLY (ignore case and extra spaces only)
5. If the names are DIFFERENT people, return "false"
6. Only return "true" if you are 100% certain it's the same person

EXAMPLES OF DIFFERENT NAMES (return false):
- "Mohanlal Roat" vs "RATUL TARAFDER" = FALSE (completely different people)
- "John Smith" vs "RATUL TARAFDER" = FALSE (completely different people)
- "Amit Kumar" vs "RATUL TARAFDER" = FALSE (completely different people)

EXAMPLES OF SAME NAME (return true):
- "RATUL TARAFDER" vs "RATUL TARAFDER" = TRUE
- "Ratul Tarafder" vs "RATUL TARAFDER" = TRUE (case doesn't matter)
- "ratul  tarafder" vs "RATUL TARAFDER" = TRUE (extra spaces ok)

CRITICAL: If you cannot clearly read the recipient name or if it's a different person, return "false"

Response: Return ONLY the word "true" or "false" with no other text.`
              },
              {
                inline_data: {
                  mime_type: 'image/png',
                  data: base64Image
                }
              }
            ]
          }]
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API Error:', errorData)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ Gemini API Response:', data)

    // Extract the response text
    const fullResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const resultText = fullResponse.trim().toLowerCase()
    
    console.log('📝 Full Gemini response:', fullResponse)
    console.log('🔍 Expected host name:', expectedHostName)
    console.log('✔️ Gemini says:', resultText)
    console.log('✅ Is verified?', resultText === 'true')

    const isVerified = resultText === 'true'

    if (isVerified) {
      // Generate booking ID
      const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      
      // Save booking to Google Sheets
      const bookingRecord = [
        bookingId,
        bookingData.stayId,
        bookingData.stayName,
        bookingData.hostName,
        bookingData.roomType,
        bookingData.beds,
        bookingData.totalPrice,
        bookingData.checkIn || '',
        bookingData.checkOut || '',
        bookingData.guests || 1,
        'confirmed',
        new Date().toISOString(),
        expectedHostName,
        'verified'
      ]

      // Add to Bookings sheet
      await appendSheetValues('Bookings', bookingRecord)
      
      console.log('✅ Payment verified and booking saved:', bookingId)

      return {
        verified: true,
        bookingId: bookingId,
        message: 'Payment verified successfully'
      }
    } else {
      console.log('❌ Payment verification failed: Recipient name mismatch')
      return {
        verified: false,
        message: 'Recipient name does not match'
      }
    }

  } catch (error) {
    console.error('Error verifying payment:', error)
    throw error
  }
}

export default {
  verifyPaymentScreenshot
}
