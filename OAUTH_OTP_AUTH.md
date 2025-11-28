# Google OAuth + OTP Authentication Implementation

## Overview
The authentication system has been completely redesigned to use **Google OAuth** as the primary authentication method with **OTP verification** for new user signups.

## Architecture

### Two Entry Points
1. **Sign Up Button** - For new users (Google OAuth + OTP verification)
2. **Sign In Button** - For existing users (Google OAuth only)

### Authentication Flow

#### Sign Up Flow (New Users)
```
User clicks "Sign Up with Google"
    ↓
Google OAuth popup (grant permissions)
    ↓
Fetch user info (email, name) from Google
    ↓
Check if email exists in Users table
    ↓
If exists → Show error "Already registered, use Sign In"
    ↓
If new → Generate 6-digit OTP
    ↓
Send OTP (currently via alert/console for testing)
    ↓
Show OTP verification modal
    ↓
User enters OTP code (6 digits)
    ↓
Verify OTP (max 5 attempts, expires in 5 minutes)
    ↓
If verified → Save user to Users table
    ↓
Create session in localStorage
    ↓
Reload page → User is logged in
```

#### Sign In Flow (Existing Users)
```
User clicks "Sign In with Google"
    ↓
Google OAuth popup (grant permissions)
    ↓
Fetch user info (email, name) from Google
    ↓
Check if email exists in Users table
    ↓
If not exists → Show error "No account found, please Sign Up"
    ↓
If exists → Fetch user data from Users table
    ↓
Create session in localStorage with actual user ID
    ↓
Reload page → User is logged in
```

## Files Modified/Created

### New Files

#### `src/components/OTPModal.jsx`
- Modal component with 6-digit OTP input
- Auto-focus next input on digit entry
- Backspace navigation between inputs
- Paste support for full OTP code
- 60-second countdown for resend
- Max 5 verification attempts
- Real-time error display

#### `src/googlesheets/otp.js`
- `generateOTP()` - Generates random 6-digit code
- `sendOTP(email)` - Stores OTP with expiry (5 minutes) in localStorage
- `verifyOTP(email, code)` - Validates OTP code, checks expiry and attempts
- `clearOTP(email)` - Cleanup function

**Note:** Currently using `localStorage` for OTP storage and `alert()` for display. In production, replace with:
- Email service (SendGrid, AWS SES, Mailgun)
- SMS service (Twilio) as alternative
- Proper OTP storage in backend/database

### Modified Files

#### `src/components/GoogleAuthButton.jsx`
**Changes:**
- Added `mode` prop (`"signup"` or `"signin"`)
- Different button text and colors based on mode
- Fetches user info from Google userinfo API
- Calls `checkUserExists()` to verify user status
- For signup: triggers OTP flow if user doesn't exist
- For signin: creates session from Users table data
- Shows OTP modal during signup verification
- Error handling with UI feedback

#### `src/googlesheets/auth.js`
**Added:**
- `checkUserExists(email)` - Queries Users table, returns boolean
- Exported in default export object

#### `src/googlesheets/oauth.js`
**Changes:**
- Updated scopes from:
  ```javascript
  'https://www.googleapis.com/auth/spreadsheets'
  ```
- To:
  ```javascript
  'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
  ```
- Required to fetch user email and profile information

#### `src/components/Navbar.jsx`
**Changes:**
- Replaced single auth button with two GoogleAuthButton components:
  ```jsx
  <GoogleAuthButton mode="signup" />
  <GoogleAuthButton mode="signin" />
  ```

## Google Sheets Integration

### Users Table Structure
When a user signs up via Google OAuth + OTP:

| Column | Value | Source |
|--------|-------|--------|
| id | `user_{timestamp}_{random}` | Generated |
| email | user@example.com | Google profile |
| name | John Doe | Google profile |
| password_hash | Random bcrypt hash | Generated (not used) |
| created_at | ISO timestamp | Current time |

**Note:** password_hash is a dummy value (not used for OAuth login) but required by schema.

### OAuth Token Storage
- Access token stored in `localStorage` as `google_oauth_token`
- Expiry stored as `google_oauth_expires`
- Tokens auto-refresh when expired
- Required scopes: spreadsheets, userinfo.email, userinfo.profile

## Security Features

### OTP Security
- **Expiry:** 5 minutes from generation
- **Max Attempts:** 5 incorrect attempts before OTP invalidated
- **One-time use:** OTP deleted after successful verification
- **Rate limiting:** 60-second cooldown between resends

### OAuth Security
- Uses Google's OAuth2 with official Google Identity Services (GIS)
- Tokens expire in 1 hour, auto-refresh on next request
- User consent required for permissions
- Secure token storage in localStorage

### Session Management
- Sessions stored in `localStorage` as `nomadic_user_session`
- Contains: `uid`, `name`, `email`
- Cleared on logout
- Checked on page load for persistence

## Testing Guide

### Test Scenario 1: New User Signup
1. Click "Sign Up with Google" button
2. Complete Google OAuth (grant permissions)
3. **Expected:** OTP alert/console shows 6-digit code
4. Enter OTP in modal
5. **Expected:** User saved to Users table, logged in
6. Check Google Sheets Users tab for new row

### Test Scenario 2: Existing User Sign In
1. Click "Sign In with Google" button
2. Complete Google OAuth
3. **Expected:** No OTP modal, direct login
4. **Expected:** Session created with existing user ID

### Test Scenario 3: Signup with Existing Email
1. Click "Sign Up with Google"
2. Use email that already exists in Users table
3. **Expected:** Error message "Already registered, use Sign In"

### Test Scenario 4: Sign In with New Email
1. Click "Sign In with Google"
2. Use email not in Users table
3. **Expected:** Error message "No account found, please Sign Up"

### Test Scenario 5: Invalid OTP
1. Start signup flow, get OTP
2. Enter wrong code (e.g., 000000)
3. **Expected:** Error "Invalid code. X attempts remaining"
4. Try 5 times
5. **Expected:** OTP invalidated, need to restart

### Test Scenario 6: Expired OTP
1. Start signup flow
2. Wait 5+ minutes
3. Enter OTP
4. **Expected:** Error "OTP has expired"

## Production Deployment Checklist

### Before Going Live:
1. **Remove console.log statements** in otp.js and GoogleAuthButton.jsx
2. **Replace alert() with email service:**
   ```javascript
   // In otp.js sendOTP()
   // Instead of: alert(`OTP: ${otp}`)
   // Use: await sendEmail(email, 'Your OTP', `Your code: ${otp}`)
   ```
3. **Set up email service:**
   - Install package: `npm install @sendgrid/mail` (or equivalent)
   - Get API key from SendGrid/AWS SES/Mailgun
   - Add to `.env`: `VITE_EMAIL_API_KEY=...`
   - Create email template with OTP code
4. **Move OTP storage to backend** (optional but recommended):
   - Store OTPs in database instead of localStorage
   - Prevents client-side tampering
   - Better rate limiting
5. **Add rate limiting:**
   - Limit OTP requests per email (e.g., 3 per hour)
   - Prevent spam/abuse
6. **Update Google Cloud Console:**
   - Add production domain to Authorized JavaScript origins
   - Add callback URLs
7. **Test on staging environment first**

## Environment Variables Required

```env
# Google OAuth (already configured)
VITE_GOOGLE_CLIENT_ID=your_client_id_here

# Google Sheets API (already configured)
VITE_GOOGLE_API_KEY=your_api_key_here

# Email Service (for production)
VITE_EMAIL_API_KEY=your_sendgrid_api_key_here
VITE_EMAIL_FROM=noreply@yourdomain.com
```

## Troubleshooting

### "Failed to fetch user information"
- **Cause:** OAuth scopes don't include userinfo
- **Fix:** Check oauth.js has all three scopes
- **Verify:** Google Cloud Console → Credentials → OAuth consent screen

### OTP modal doesn't show
- **Cause:** User already exists in Users table
- **Fix:** Check email in Google Sheets Users tab
- **Debug:** Console should log "User exists"

### "No account found" on Sign In
- **Cause:** Email not in Users table
- **Fix:** Complete signup flow first
- **Debug:** Check Users table has matching email

### OAuth popup blocked
- **Cause:** Browser blocking popups
- **Fix:** Allow popups for localhost/your domain
- **User action:** Click browser address bar popup icon

### Token expired errors
- **Cause:** OAuth token expired (1 hour lifetime)
- **Fix:** Automatic - will request new token
- **Manual:** Click Sign In/Sign Up again

## Future Enhancements

### Potential Improvements:
1. **Email verification links** - Alternative to OTP
2. **SMS OTP** - Phone number option
3. **Social login** - Facebook, GitHub, etc.
4. **Remember me** - Longer session persistence
5. **2FA** - Additional security layer
6. **Password recovery** - For old email/password users
7. **Profile management** - Update name, email
8. **Session timeout** - Auto-logout after inactivity

## Migration from Old System

### Old Authentication (Deprecated):
- Email/password signup with bcrypt
- Manual form with AuthModal
- Sessions stored in localStorage
- No OAuth integration

### New Authentication (Current):
- Google OAuth as primary method
- OTP verification for new signups
- Automatic user info retrieval
- Streamlined UX (one-click auth)

### Backward Compatibility:
- Old users with password_hash can still be accommodated
- Could add "Sign In with Email" button as fallback
- Users table structure unchanged (same columns)

## API Reference

### OTP Functions

#### `sendOTP(email: string)`
Generates and stores OTP code.

**Returns:**
```typescript
{
  success: boolean
  otp?: string  // Only in dev mode
  error?: string
}
```

#### `verifyOTP(email: string, code: string)`
Validates OTP code against stored value.

**Returns:**
```typescript
{
  success: boolean
  error?: string
}
```

### Auth Functions

#### `checkUserExists(email: string)`
Checks if user exists in Users table.

**Returns:** `Promise<boolean>`

### GoogleAuthButton Component

#### Props
```typescript
interface GoogleAuthButtonProps {
  mode?: 'signup' | 'signin'  // Default: 'signin'
}
```

#### Usage
```jsx
import GoogleAuthButton from './components/GoogleAuthButton'

// Sign Up button
<GoogleAuthButton mode="signup" />

// Sign In button
<GoogleAuthButton mode="signin" />
```

## Support & Debugging

### Enable Debug Logs:
All major functions include console logs prefixed with emojis:
- 🔐 OAuth operations
- 📧 Email/OTP operations
- ✅ Success operations
- ❌ Error operations
- 🔍 Lookup operations

Check browser console for detailed flow tracking.

### Common Console Messages:
- `"🔐 OAuth Config"` - OAuth initialization
- `"📧 Sending OTP to"` - OTP generation
- `"🔢 Generated OTP"` - OTP code (dev only)
- `"🔍 Verifying OTP"` - OTP validation
- `"✅ OTP verified"` - Successful verification
- `"🎉 Signup complete!"` - User created

## Contact & Maintenance

For issues or questions about this implementation:
1. Check browser console for error messages
2. Verify Google Sheets Users table structure
3. Confirm OAuth scopes in Google Cloud Console
4. Review this document's troubleshooting section
5. Test with different email addresses

Last Updated: $(current_date)
Implementation Version: 1.0.0
