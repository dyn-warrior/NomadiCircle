# 🔧 Fix: Add Test User to OAuth Consent Screen

## The Problem
**Error 403: access_denied**
"NomadiCircle has not completed the Google verification process. The app is currently being tested, and can only be accessed by developer-approved testers."

## The Solution
Add your email as a test user in Google Cloud Console.

## Steps to Fix (2 minutes):

### 1. Go to OAuth Consent Screen
1. Open https://console.cloud.google.com/
2. Navigate to **APIs & Services** > **OAuth consent screen**

### 2. Add Test Users
1. Scroll down to **Test users** section
2. Click **+ ADD USERS**
3. Enter your email: `ratsthh1997@gmail.com`
4. Click **SAVE**

### 3. Test Again
1. Refresh your app: http://localhost:5173/
2. Click "Sign in with Google"
3. It should work now! ✅

## Alternative: Publish the App (Optional)

If you want anyone to access it:
1. Go to **OAuth consent screen**
2. Click **PUBLISH APP**
3. Note: For production, Google may require verification if using sensitive scopes

## For Development
Just add your email as a test user - this is the fastest solution!

---

**After adding your email, try signing in again!**
