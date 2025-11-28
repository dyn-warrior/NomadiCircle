// Google OAuth2 implementation for Google Sheets API
// Uses Google Identity Services (GIS) for browser-based OAuth2

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'

let tokenClient = null
let accessToken = null
let tokenExpiresAt = null

// Debug logging
console.log('🔐 OAuth Config:', {
  hasClientId: !!CLIENT_ID,
  clientIdPrefix: CLIENT_ID?.substring(0, 20) + '...',
  scopes: SCOPES
})

/**
 * Initialize Google Identity Services
 */
export const initOAuth = () => {
  return new Promise((resolve, reject) => {
    // Check if GIS library is loaded
    if (typeof google === 'undefined' || !google.accounts) {
      reject(new Error('Google Identity Services not loaded. Add the script to index.html'))
      return
    }

    try {
      // Initialize the token client
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
          if (response.error) {
            console.error('❌ OAuth error:', response)
            reject(new Error(response.error))
            return
          }
          
          console.log('✅ OAuth token received')
          accessToken = response.access_token
          // Token typically expires in 3600 seconds (1 hour)
          tokenExpiresAt = Date.now() + (response.expires_in * 1000)
          
          // Store token info in localStorage for persistence
          localStorage.setItem('google_oauth_token', accessToken)
          localStorage.setItem('google_oauth_expires', tokenExpiresAt.toString())
          
          resolve(accessToken)
        },
      })

      console.log('✅ OAuth client initialized')
      
      // Try to restore token from localStorage
      const storedToken = localStorage.getItem('google_oauth_token')
      const storedExpiry = localStorage.getItem('google_oauth_expires')
      
      if (storedToken && storedExpiry) {
        const expiresAt = parseInt(storedExpiry)
        if (Date.now() < expiresAt) {
          console.log('♻️ Restored valid OAuth token from storage')
          accessToken = storedToken
          tokenExpiresAt = expiresAt
          resolve(accessToken)
          return
        } else {
          console.log('⚠️ Stored token expired, will request new one')
          localStorage.removeItem('google_oauth_token')
          localStorage.removeItem('google_oauth_expires')
        }
      }
      
      resolve(null) // No stored token, need to request
    } catch (error) {
      console.error('❌ OAuth initialization failed:', error)
      reject(error)
    }
  })
}

/**
 * Request OAuth token (prompts user consent if needed)
 */
export const requestAccessToken = () => {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error('OAuth not initialized. Call initOAuth() first.'))
      return
    }

    // Check if we have a valid token
    if (accessToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
      console.log('✅ Using existing valid token')
      resolve(accessToken)
      return
    }

    console.log('🔄 Requesting new OAuth token (user consent may be required)...')
    
    // Override the callback for this specific request
    tokenClient.callback = (response) => {
      if (response.error) {
        console.error('❌ Token request failed:', response)
        reject(new Error(response.error))
        return
      }
      
      console.log('✅ New OAuth token received')
      accessToken = response.access_token
      tokenExpiresAt = Date.now() + (response.expires_in * 1000)
      
      localStorage.setItem('google_oauth_token', accessToken)
      localStorage.setItem('google_oauth_expires', tokenExpiresAt.toString())
      
      resolve(accessToken)
    }

    // Request the token (may show popup)
    try {
      tokenClient.requestAccessToken({ prompt: '' })
    } catch (error) {
      console.error('❌ Token request error:', error)
      reject(error)
    }
  })
}

/**
 * Get current access token (requests new one if needed)
 */
export const getAccessToken = async () => {
  // Check if token is still valid
  if (accessToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return accessToken
  }

  // Token expired or doesn't exist, request new one
  console.log('⚠️ Token expired or missing, requesting new token...')
  return await requestAccessToken()
}

/**
 * Revoke OAuth token and sign out
 */
export const revokeToken = () => {
  if (accessToken) {
    google.accounts.oauth2.revoke(accessToken, () => {
      console.log('✅ OAuth token revoked')
    })
  }
  
  accessToken = null
  tokenExpiresAt = null
  localStorage.removeItem('google_oauth_token')
  localStorage.removeItem('google_oauth_expires')
}

/**
 * Check if user has granted OAuth access
 */
export const hasValidToken = () => {
  return accessToken && tokenExpiresAt && Date.now() < tokenExpiresAt
}

export default {
  initOAuth,
  requestAccessToken,
  getAccessToken,
  revokeToken,
  hasValidToken
}
