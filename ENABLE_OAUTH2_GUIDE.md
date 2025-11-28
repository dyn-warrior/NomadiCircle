# 🔐 Complete Guide: Enable Write Operations with OAuth2

## Step 1: Create OAuth2 Credentials (5 minutes)

### 1.1 Go to Google Cloud Console
1. Visit https://console.cloud.google.com/
2. Select your project (or create a new one)
3. Enable Google Sheets API if not already enabled

### 1.2 Create OAuth2 Client ID
1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Choose **Web application**
4. Name it: `NomadiCircle Web Client`

### 1.3 Configure Authorized Origins
Add these **Authorized JavaScript origins**:
```
http://localhost:5173
http://localhost:5174
http://127.0.0.1:5173
https://yourdomain.com  (for production)
```

### 1.4 Configure Redirect URIs
Add these **Authorized redirect URIs**:
```
http://localhost:5173
http://localhost:5174
http://127.0.0.1:5173
https://yourdomain.com  (for production)
```

### 1.5 Save and Get Client ID
- Click **CREATE**
- Copy the **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
- You don't need the Client Secret for this setup

---

## Step 2: Update Your .env File

Add your OAuth2 Client ID to `.env`:
```env
VITE_GOOGLE_API_KEY=AIzaSyA2aupJFvtPAAMLi6Y0JihVEfzeekvnBUk
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
```

---

## Step 3: Install Google Identity Services

I'll update the code to use Google's Identity Services library for OAuth2.

The implementation will:
1. ✅ Load Google Identity Services SDK
2. ✅ Prompt user to sign in with Google (one-time consent)
3. ✅ Get OAuth2 access token
4. ✅ Use token for all API requests (read + write)
5. ✅ Auto-refresh tokens when expired

---

## Step 4: User Experience Changes

### Before (API Key):
- No Google sign-in required
- Only read operations work
- All users see same data

### After (OAuth2):
- **First time**: User clicks "Sign in with Google" → Grants permissions
- **Subsequent visits**: Auto-logged in (token stored)
- Read + Write operations both work
- Each user has their own Google account context

---

## Important Notes

### Security
- OAuth2 tokens are stored in browser localStorage
- Tokens expire after 1 hour and auto-refresh
- Users must grant permission to "See, edit, create, and delete all your Google Sheets spreadsheets"

### Scopes Required
The app will request this scope:
```
https://www.googleapis.com/auth/spreadsheets
```

### Privacy
- The app only accesses the 2 specific spreadsheets you configured
- Users must trust your app to access their Google account
- For production, you should create a privacy policy

---

## Ready to Implement?

Once you have your OAuth2 Client ID, let me know and I'll:
1. Update `src/googlesheets/config.js` to use OAuth2
2. Add Google Identity Services SDK to `index.html`
3. Create OAuth2 flow in `src/googlesheets/auth.js`
4. Update all components to handle Google sign-in
5. Test signup, login, and stay registration

**Next step:** Get your OAuth2 Client ID from Google Cloud Console, then paste it here!
