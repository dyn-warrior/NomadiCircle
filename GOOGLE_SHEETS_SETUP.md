# Google Sheets Setup Guide

## Overview
This application now uses Google Sheets as its database instead of Supabase. All user authentication, stay registrations, and data are stored in a Google Sheet.

## Google Sheet Structure
Your spreadsheet should have the following sheets:

### 1. Users Sheet
Columns:
- `id` - Unique user ID
- `email` - User email address
- `name` - User's full name
- `password_hash` - Hashed password (bcrypt)
- `created_at` - ISO timestamp
- `email_verified` - Boolean (true/false)

### 2. Stays Sheet
Columns:
- `id` - Unique stay ID
- `stay_name` - Name of the stay
- `stay_type` - Type (homestay, farmstay, etc.)
- `description` - Stay description
- `location` - Stay location
- `unique_experience` - What makes it unique
- `activities` - JSON string of activities
- `price_per_night` - Price in USD
- `max_guests` - Maximum number of guests
- `meals_included` - Meals included option
- `image_urls` - Comma-separated image placeholders
- `host_id` - ID of the host user
- `host_name` - Host's name
- `contact_number` - Host's contact
- `about_host` - About the host
- `status` - pending/approved/rejected
- `created_at` - ISO timestamp

## Setup Instructions

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### Step 2: Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key that's generated
4. Click "Restrict Key" to add security:
   - Under "API restrictions", select "Restrict key"
   - Check "Google Sheets API"
   - Click "Save"

### Step 3: Make Google Sheet Public
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1JNnTnypBMvc5M-w5wof9SSpoTEythDyADgpj5MwVgRE/edit
2. Click "Share" button (top right)
3. Click "Change to anyone with the link"
4. Set permission to "Editor"
5. Click "Done"

**⚠️ Security Note**: This makes your sheet publicly editable. For production, implement a backend API to proxy requests with proper authentication.

### Step 4: Configure Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your API key to `.env`:
   ```env
   VITE_GOOGLE_API_KEY=your_api_key_here
   ```

### Step 6: Test the Connection
1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open browser console and check for:
   - ✅ Google Sheets connected message
   - Any error messages about credentials

3. Try signing up with a test account
4. Check your Google Sheet - a new row should appear in the "Users" sheet

## How It Works

### Authentication
- Passwords are hashed using bcryptjs before storing
- Sessions are stored in localStorage
- No email verification (can be added later)

### Stay Registration
- Images are converted to placeholders (file names + sizes)
- In production, you'd upload to Cloudinary/ImgBB and store URLs
- All stay data is stored as rows in the "Stays" sheet

### Data Sync
- Every read/write hits the Google Sheets API directly
- No caching (can be added for performance)
- Rate limits: 100 requests per 100 seconds per user

## Troubleshooting

### "Cannot connect to Google Sheets"
- Check that the Google Sheets API is enabled in Google Cloud Console
- Verify the API key is correct in `.env`
- Make sure the Google Sheet is shared as "Anyone with the link can edit"

### "Permission denied" or "403 Forbidden"
- Verify the sheet is publicly shared with "Editor" permissions
- Check if the API key is restricted to Google Sheets API
- Verify the sheet ID in `src/googlesheets/config.js` is correct

### "Sheet not found"
- Make sure the sheet titles match exactly: "Users" and "Stays"
- Headers must be in the first row of each sheet
- Check the sheet ID in the URL matches the one in `config.js`

## Migration Notes

### What Was Removed
- All Supabase dependencies (`@supabase/supabase-js`, `@supabase/auth-ui-react`, etc.)
- Firebase configuration (kept for reference)
- SQL files and database setup guides

### What Was Added
- `bcryptjs` for password hashing
- New `/src/googlesheets/` folder with:
  - `config.js` - Google Sheets REST API wrapper
  - `auth.js` - User authentication with localStorage sessions
  - `stays.js` - Stay management
- Custom `AuthModalGoogleSheets.jsx` component with sign up/sign in forms

### What Was Modified
- `Navbar.jsx` - Uses Google Sheets auth
- `RegisterStay.jsx` - Uses Google Sheets stays API
- `.env.example` - Now includes Google credentials
- `.github/copilot-instructions.md` - Updated architecture docs

## Next Steps

1. **Image Storage**: Integrate with Cloudinary or ImgBB for real image uploads
2. **Email Verification**: Add email sending service (SendGrid, Mailgun)
3. **Rate Limiting**: Implement caching to reduce API calls
4. **Password Reset**: Add password reset functionality
5. **Admin Dashboard**: Create an admin view to approve/reject stays

## Security Notes

- ⚠️ **Critical**: This setup exposes the Google Sheet publicly with edit access. Use only for development/demo.
- ⚠️ **For Production**: Implement a backend API (Node.js/Express, Cloudflare Workers, etc.) to proxy Google Sheets requests with proper authentication.
- ⚠️ Never commit `.env` file to Git
- ⚠️ Restrict API key to Google Sheets API only
- ⚠️ Use environment variables in production (Vercel, Netlify, etc.)
- ⚠️ Consider adding rate limiting to prevent abuse
- ⚠️ Passwords are hashed with bcrypt, but session management is basic (localStorage only)

## Support

If you encounter any issues:
1. Check browser console for error messages
2. Verify Google Sheet permissions
3. Test API connection using the diagnostics page (if available)
4. Review the Google Cloud Console logs

---

**Sheet URL**: https://docs.google.com/spreadsheets/d/1JNnTnypBMvc5M-w5wof9SSpoTEythDyADgpj5MwVgRE/edit
