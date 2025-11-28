import { useEffect, useState } from 'react'
import { initOAuth, requestAccessToken, hasValidToken, revokeToken } from '../googlesheets/oauth'
import { checkUserExists } from '../googlesheets/auth'
import { sendOTP, verifyOTP } from '../googlesheets/otp'
import { appendSheetValues } from '../googlesheets/config'
import OTPModal from './OTPModal'

export default function GoogleAuthButton({ mode = 'signin' }) {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [pendingUserData, setPendingUserData] = useState(null)

  useEffect(() => {
    // Initialize OAuth when component mounts
    const init = async () => {
      try {
        // Wait for Google Identity Services to load
        await new Promise((resolve) => {
          if (typeof google !== 'undefined' && google.accounts) {
            resolve()
          } else {
            const checkInterval = setInterval(() => {
              if (typeof google !== 'undefined' && google.accounts) {
                clearInterval(checkInterval)
                resolve()
              }
            }, 100)
            
            // Timeout after 10 seconds
            setTimeout(() => {
              clearInterval(checkInterval)
              resolve()
            }, 10000)
          }
        })

        await initOAuth()
        setIsSignedIn(hasValidToken())
      } catch (err) {
        console.error('OAuth init error:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [])

  const handleAuth = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Step 1: Get OAuth token for Sheets access
      const accessToken = await requestAccessToken()
      
      // Step 2: Fetch user info from Google
      console.log('📧 Fetching user info from Google...')
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      
      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user information')
      }
      
      const userInfo = await userInfoResponse.json()
      const email = userInfo.email
      const name = userInfo.name || userInfo.given_name || 'User'
      
      console.log('📧 User email:', email)
      console.log('👤 User name:', name)
      console.log('🔑 Mode:', mode)
      
      if (!email) {
        throw new Error('Could not retrieve email from Google account')
      }
      
      // Step 3: Check if user exists in Users table
      const userExists = await checkUserExists(email)
      
      if (mode === 'signup') {
        // SIGN UP MODE
        if (userExists) {
          setError('This email is already registered. Please use Sign In instead.')
          setIsLoading(false)
          return
        }
        
        // Generate and send OTP
        console.log('📧 Sending OTP for new user signup...')
        const otpResult = await sendOTP(email)
        
        if (!otpResult.success) {
          setError(otpResult.error || 'Failed to send OTP')
          setIsLoading(false)
          return
        }
        
        // Store user data for after OTP verification
        setPendingUserData({ email, name, userInfo })
        setShowOTPModal(true)
        setIsLoading(false)
        
      } else {
        // SIGN IN MODE
        if (!userExists) {
          setError('No account found with this email. Please Sign Up first.')
          setIsLoading(false)
          return
        }
        
        // User exists, get their data from Users table
        const { getSheetValues, parseSheetData } = await import('../googlesheets/config')
        const values = await getSheetValues('Users')
        const users = parseSheetData(values)
        const user = users.find(u => u.email === email)
        
        // Create session with actual user ID
        const session = {
          uid: user.id,
          name: user.name || name,
          email: email
        }
        
        localStorage.setItem('nomadic_user_session', JSON.stringify(session))
        console.log('✅ User logged in successfully')
        setIsSignedIn(true)
        
        // Reload to refresh app state
        window.location.reload()
      }
      
    } catch (err) {
      console.error('Auth error:', err)
      setError(err.message || 'Authentication failed')
      setIsLoading(false)
    }
  }
  
  const handleOTPVerify = async (otpCode) => {
    try {
      console.log('🔍 Verifying OTP:', otpCode)
      
      const result = await verifyOTP(pendingUserData.email, otpCode)
      
      if (!result.success) {
        return result
      }
      
      // OTP verified, now save user to Users table
      console.log('✅ OTP verified, creating user account...')
      
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Save to Users table: id | email | name | created_at | email_verified
      await appendSheetValues('Users', [
        userId,
        pendingUserData.email,
        pendingUserData.name,
        new Date().toISOString(),
        'TRUE'
      ])
      
      console.log('✅ User saved to Users table')
      
      // Create session
      const session = {
        uid: userId,
        name: pendingUserData.name,
        email: pendingUserData.email
      }
      
      localStorage.setItem('nomadic_user_session', JSON.stringify(session))
      
      // Close modal and reload
      setShowOTPModal(false)
      setPendingUserData(null)
      console.log('🎉 Signup complete!')
      
      // Reload to refresh app state
      setTimeout(() => {
        window.location.reload()
      }, 500)
      
      return { success: true }
      
    } catch (error) {
      console.error('OTP verification error:', error)
      return {
        success: false,
        error: 'Verification failed. Please try again.'
      }
    }
  }

  const handleSignOut = () => {
    revokeToken()
    setIsSignedIn(false)
    // Reload page to clear state
    window.location.reload()
  }

  if (isLoading) {
    return (
      <button 
        disabled
        className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
      >
        Loading...
      </button>
    )
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        OAuth Error: {error}
      </div>
    )
  }

  const buttonText = mode === 'signup' ? 'Sign Up with Google' : 'Sign In with Google'
  const buttonColor = mode === 'signup' ? 'bg-sage-600 hover:bg-sage-700' : 'bg-blue-600 hover:bg-blue-700'

  if (isSignedIn) {
    return (
      <button
        onClick={handleSignOut}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
      >
        Sign Out (Google)
      </button>
    )
  }

  return (
    <>
      <button
        onClick={handleAuth}
        className={`px-4 py-2 ${buttonColor} text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium`}
        disabled={isLoading}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {isLoading ? 'Loading...' : buttonText}
      </button>

      {/* Error display */}
      {error && (
        <div className="absolute top-full mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}

      {/* OTP Modal for signup */}
      {showOTPModal && pendingUserData && (
        <OTPModal
          isOpen={showOTPModal}
          onClose={() => {
            setShowOTPModal(false)
            setPendingUserData(null)
          }}
          email={pendingUserData.email}
          onVerify={handleOTPVerify}
        />
      )}
    </>
  )
}
