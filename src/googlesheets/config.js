// Google Sheets configuration and initialization
// Uses OAuth2 for write operations and API key fallback for reads

import { getAccessToken, hasValidToken } from './oauth'

// Single Spreadsheet ID with three tabs: Users, Stays, Bookings
const SPREADSHEET_ID = '1rAaFKTtLweoyofjj8Kk7_znPgyJk2QZgqOoidSFgJME'

// Google API Key (fallback for read operations)
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

// Debug: Log the credentials (remove in production)
console.log('🔧 Google Sheets Config:', {
  spreadsheetId: SPREADSHEET_ID,
  hasApiKey: !!GOOGLE_API_KEY,
  apiKeyPrefix: GOOGLE_API_KEY?.substring(0, 20) + '...',
  hasOAuthToken: hasValidToken()
})

/**
 * Get the correct spreadsheet ID - now all tabs are in one spreadsheet
 */
const getSpreadsheetId = () => {
  return SPREADSHEET_ID
}

/**
 * Make a request to Google Sheets API
 * Uses OAuth2 for all operations (reads and writes)
 */
const makeApiRequest = async (sheetName, endpoint, options = {}) => {
  const spreadsheetId = getSpreadsheetId()
  
  // Use OAuth2 for all operations
  console.log('🔐 Using OAuth2 for operation')
  const accessToken = await getAccessToken()
  if (!accessToken) {
    throw new Error('OAuth2 token required. Please sign in with Google.')
  }
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    ...options.headers,
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Google Sheets API error')
  }
  
  return await response.json()
}

/**
 * Get values from a sheet range
 * Uses the actual tab name (Users, Stays, or Bookings)
 */
export const getSheetValues = async (sheetName, range = 'A1:Z1000') => {
  try {
    console.log(`📖 Reading ${sheetName}!${range}`)
    const data = await makeApiRequest(sheetName, `/values/${sheetName}!${range}`)
    return data.values || []
  } catch (error) {
    console.error(`❌ Error reading sheet:`, error)
    throw error
  }
}

/**
 * Append values to a sheet
 * WARNING: API keys only support READ operations.
 * Write operations require OAuth2 authentication.
 * This will fail with the current API key setup.
 */
export const appendSheetValues = async (sheetName, values) => {
  try {
    console.log(`📝 Appending to ${sheetName} tab`)
    const data = await makeApiRequest(
      sheetName,
      `/values/${sheetName}!A1:append?valueInputOption=RAW`,
      {
        method: 'POST',
        body: JSON.stringify({
          values: [values],
        }),
      }
    )
    return data
  } catch (error) {
    console.error(`❌ Error appending to sheet:`, error)
    throw error
  }
}

/**
 * Update values in a sheet
 * WARNING: API keys only support READ operations. This requires OAuth2.
 */
export const updateSheetValues = async (sheetName, range, values) => {
  try {
    console.log(`✏️ Updating ${sheetName}!${range}`)
    const data = await makeApiRequest(
      sheetName,
      `/values/${sheetName}!${range}?valueInputOption=RAW`,
      {
        method: 'PUT',
        body: JSON.stringify({
          values: [values],
        }),
      }
    )
    return data
  } catch (error) {
    console.error(`❌ Error updating sheet:`, error)
    throw error
  }
}

/**
 * Parse sheet data into objects
 * Converts header names to lowercase and replaces spaces with underscores
 */
export const parseSheetData = (values) => {
  if (!values || values.length === 0) return []
  
  const headers = values[0]
  const rows = values.slice(1)
  
  return rows.map(row => {
    const obj = {}
    headers.forEach((header, index) => {
      // Convert header to lowercase and replace spaces with underscores
      const normalizedHeader = header.toLowerCase().replace(/\s+/g, '_')
      obj[normalizedHeader] = row[index] || ''
    })
    return obj
  })
}

export default { 
  getSheetValues, 
  appendSheetValues, 
  updateSheetValues,
  parseSheetData 
}
