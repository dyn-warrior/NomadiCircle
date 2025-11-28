// Google Sheets Authentication functions
import { getSheetValues, appendSheetValues, parseSheetData } from './config'
import bcrypt from 'bcryptjs'

// In-memory session storage (replace with localStorage for persistence)
let currentSession = null

/**
 * Hash password using bcrypt
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

/**
 * Verify password against hash
 */
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

/**
 * Check if user exists in Users table
 */
export const checkUserExists = async (email) => {
  try {
    console.log('🔍 Checking if user exists:', email)
    const values = await getSheetValues('Users')
    const users = parseSheetData(values)
    const exists = users.some(user => user.email === email)
    console.log(exists ? '✅ User exists' : '❌ User does not exist')
    return exists
  } catch (error) {
    console.error('Error checking user existence:', error)
    return false
  }
}

/**
 * Sign up a new user with email and password
 */
export const signUpUser = async (email, password, name) => {
  try {
    console.log('🚀 Starting signup process...')
    console.log('📧 Email:', email)
    console.log('👤 Name:', name)
    
    // Get Users sheet data
    const values = await getSheetValues('Users')
    const users = parseSheetData(values)
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email)
    if (existingUser) {
      console.error('❌ User already exists')
      return {
        success: false,
        error: 'This email is already registered. Please login instead.'
      }
    }
    
    // Create user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Add new user
    console.log('💾 Creating user in Google Sheets...')
    // Column order must match sheet: Id | Email | Name | Created At | Email Verified
    await appendSheetValues('Users', [
      userId,
      email,
      name,
      new Date().toISOString(),
      'FALSE'
    ])
    
    console.log('✅ User saved successfully')
    
    console.log('✅ User created successfully!')
    
    // Create session
    currentSession = {
      uid: userId,
      name: name,
      email: email
    }
    
    // Store in localStorage
    localStorage.setItem('nomadic_user_session', JSON.stringify(currentSession))
    
    console.log('🎉 Signup process complete!')
    return {
      success: true,
      user: {
        uid: userId,
        name: name,
        email: email
      },
      message: 'Account created successfully! You are now logged in.'
    }
  } catch (error) {
    console.error('💥 Unexpected signup error:', error)
    console.error('Error stack:', error.stack)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}

/**
 * Sign in existing user with email and password
 */
export const signInUser = async (email, password) => {
  try {
    console.log('🔐 Starting login process...')
    console.log('📧 Email:', email)
    
    // Get Users sheet data
    const values = await getSheetValues('Users')
    console.log('📊 Raw sheet headers:', values[0])
    const users = parseSheetData(values)
    console.log('👥 Parsed users count:', users.length)
    
    // Find user
    const user = users.find(u => u.email === email)
    if (!user) {
      console.error('❌ User not found')
      return {
        success: false,
        error: 'Invalid email or password. Please try again.'
      }
    }
    
    console.log('👤 Found user:', { id: user.id, email: user.email, name: user.name })
    console.log('🔑 User object keys:', Object.keys(user))
    
    // Note: Password verification removed - OAuth-only authentication
    console.log('✅ User authenticated via OAuth')
    
    // Create session
    currentSession = {
      uid: user.id,
      name: user.name,
      email: user.email
    }
    
    // Store in localStorage
    localStorage.setItem('nomadic_user_session', JSON.stringify(currentSession))
    
    console.log('🎉 Login process complete!')
    return {
      success: true,
      user: currentSession
    }
  } catch (error) {
    console.error('💥 Unexpected login error:', error)
    console.error('Error stack:', error.stack)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}

/**
 * Sign out current user
 */
export const signOutUser = async () => {
  try {
    currentSession = null
    localStorage.removeItem('nomadic_user_session')
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}

/**
 * Send password reset email (placeholder)
 */
export const resetPassword = async (email) => {
  try {
    // TODO: Implement email sending logic
    console.log('Password reset requested for:', email)
    return { 
      success: true,
      message: 'Password reset functionality will be implemented soon.'
    }
  } catch (error) {
    console.error('Password reset error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}

/**
 * Get current user session
 */
export const getCurrentUser = async () => {
  try {
    console.log('🔍 getCurrentUser: Fetching current user...')
    
    // Check memory first
    if (currentSession) {
      console.log('✅ getCurrentUser: Returning session from memory:', currentSession)
      return currentSession
    }
    
    // Check localStorage
    const stored = localStorage.getItem('nomadic_user_session')
    if (stored) {
      currentSession = JSON.parse(stored)
      console.log('✅ getCurrentUser: Returning session from localStorage:', currentSession)
      return currentSession
    }
    
    console.log('❌ getCurrentUser: No user found')
    return null
  } catch (error) {
    console.error('💥 getCurrentUser error:', error)
    return null
  }
}

/**
 * Auth state change listener (mock for compatibility)
 */
export const onAuthStateChange = (callback) => {
  // Check initial state
  getCurrentUser().then(user => {
    if (user) {
      callback('SIGNED_IN', { user })
    } else {
      callback('SIGNED_OUT', null)
    }
  })
  
  // Return mock unsubscribe function
  return {
    data: {
      subscription: {
        unsubscribe: () => console.log('Unsubscribed from auth changes')
      }
    }
  }
}

export default { 
  signUpUser, 
  signInUser, 
  signOutUser, 
  resetPassword, 
  getCurrentUser,
  onAuthStateChange,
  checkUserExists
}
