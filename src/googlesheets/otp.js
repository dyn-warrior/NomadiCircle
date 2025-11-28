// OTP generation and verification for Google Sheets authentication
// Note: In production, OTPs should be sent via email service (SendGrid, AWS SES, etc.)
// For now, storing OTPs in localStorage for testing

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
    console.log('🔢 Generated OTP:', otp) // TODO: Remove in production
    
    // Store OTP with expiry (5 minutes)
    const otpData = {
      code: otp,
      email: email,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      attempts: 0
    }
    
    localStorage.setItem(`nomadic_otp_${email}`, JSON.stringify(otpData))
    
    // TODO: In production, send email via service like SendGrid
    // For now, just log it (user will see in console for testing)
    console.log(`
╔═══════════════════════════════════╗
║   YOUR OTP CODE (FOR TESTING)    ║
║                                   ║
║           ${otp}                  ║
║                                   ║
║   Valid for 5 minutes             ║
╚═══════════════════════════════════╝
    `)
    
    alert(`OTP Code (for testing): ${otp}\n\nIn production, this will be sent to your email.`)
    
    return {
      success: true,
      otp: otp // Only return for testing; remove in production
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
