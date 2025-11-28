// OTP generation and verification for Google Sheets authentication
import emailjs from '@emailjs/browser'

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_vexladb'
const EMAILJS_TEMPLATE_ID = 'template_uhw2q5w'
const EMAILJS_PUBLIC_KEY = 'oqYikPwQXLJgbRBdS'

/**
 * Generate a 6-digit OTP code
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Send OTP to user's email
 * @param {string} email - User's email address
 * @returns {Promise<{success: boolean, otp?: string, error?: string}>}
 */
export const sendOTP = async (email) => {
  try {
    console.log('📧 Sending OTP to:', email)
    
    // Generate OTP
    const otp = generateOTP()
    console.log('🔢 Generated OTP:', otp)
    
    // Store OTP with expiry (5 minutes)
    const otpData = {
      code: otp,
      email: email,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      attempts: 0
    }
    
    localStorage.setItem(`nomadic_otp_${email}`, JSON.stringify(otpData))
    
    // Calculate expiry time (5 minutes from now)
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    
    // Send OTP via EmailJS
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          passcode: otp,
          time: expiryTime,
          user_email: email
        },
        EMAILJS_PUBLIC_KEY
      )
      
      console.log('✅ OTP sent successfully to:', email)
      
      return {
        success: true,
        message: `Verification code sent to ${email}`
      }
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError)
      
      // Fallback: show OTP in console/alert for testing
      console.log(`
╔═══════════════════════════════════╗
║   YOUR OTP CODE (EMAIL FAILED)   ║
║                                   ║
║           ${otp}                  ║
║                                   ║
║   Valid for 5 minutes             ║
╚═══════════════════════════════════╝
      `)
      
      alert(`Email delivery failed. Your OTP code is: ${otp}\n\nPlease check EmailJS template configuration.`)
      
      return {
        success: true,
        message: 'OTP generated (email delivery failed, check console)',
        otp: otp // Only for testing
      }
    }
  } catch (error) {
    console.error('❌ Error sending OTP:', error)
    return {
      success: false,
      error: 'Failed to send OTP. Please try again.'
    }
  }
}

/**
 * Verify OTP code
 * @param {string} email - User's email address
 * @param {string} code - OTP code to verify
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const verifyOTP = async (email, code) => {
  try {
    console.log('🔍 Verifying OTP for:', email)
    
    // Get stored OTP data
    const storedData = localStorage.getItem(`nomadic_otp_${email}`)
    if (!storedData) {
      console.error('❌ No OTP found for email')
      return {
        success: false,
        error: 'OTP expired or not found. Please request a new code.'
      }
    }
    
    const otpData = JSON.parse(storedData)
    
    // Check if OTP has expired
    if (Date.now() > otpData.expiresAt) {
      console.error('❌ OTP expired')
      localStorage.removeItem(`nomadic_otp_${email}`)
      return {
        success: false,
        error: 'OTP has expired. Please request a new code.'
      }
    }
    
    // Check attempts (max 5 attempts)
    if (otpData.attempts >= 5) {
      console.error('❌ Too many attempts')
      localStorage.removeItem(`nomadic_otp_${email}`)
      return {
        success: false,
        error: 'Too many failed attempts. Please request a new code.'
      }
    }
    
    // Verify code
    if (code === otpData.code) {
      console.log('✅ OTP verified successfully')
      localStorage.removeItem(`nomadic_otp_${email}`)
      return { success: true }
    } else {
      console.error('❌ Invalid OTP code')
      // Increment attempts
      otpData.attempts += 1
      localStorage.setItem(`nomadic_otp_${email}`, JSON.stringify(otpData))
      
      const remainingAttempts = 5 - otpData.attempts
      return {
        success: false,
        error: `Invalid code. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`
      }
    }
  } catch (error) {
    console.error('❌ Error verifying OTP:', error)
    return {
      success: false,
      error: 'Verification failed. Please try again.'
    }
  }
}

/**
 * Clear OTP data for email (useful for cleanup)
 */
export const clearOTP = (email) => {
  localStorage.removeItem(`nomadic_otp_${email}`)
}

export default {
  generateOTP,
  sendOTP,
  verifyOTP,
  clearOTP
}
