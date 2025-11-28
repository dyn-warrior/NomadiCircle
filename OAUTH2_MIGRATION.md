# 🔒 OAuth2 Migration Required for Write Operations

## Current Limitation Discovered

**Google Sheets API keys only support READ operations, not WRITE operations.**

Your current setup works for reading data but **cannot write** (create users, register stays, etc.).

## What Works Now ✅
- Reading data from both Google Sheets
- Viewing stays
- Displaying user data (if manually added)

## What Doesn't Work ❌
- Sign up (cannot create users)
- Login creates session but can't persist users
- Stay registration (cannot write stays)
- Any data modification

## Solutions

### Option 1: Manual Data Entry (Quickest for Testing)
Manually add test data directly in Google Sheets:

**Users Sheet (Sheet1):**
```
id | email | name | password_hash | created_at | email_verified
1 | test@example.com | Test User | $2a$10$... | 2024-01-01T00:00:00.000Z | false
```

**Stays Sheet (Sheet1):**
```
id | stay_name | stay_type | description | location | unique_experience | activities | price_per_night | max_guests | meals_included | image_urls | host_id | host_name | contact_number | about_host | status | created_at
1 | Test Stay | House | Nice place | Mumbai | Local culture | Hiking | 5000 | 4 | true | [] | 1 | Test User | +91-1234567890 | Friendly host | approved | 2024-01-01T00:00:00.000Z
```

**To get password_hash for testing:**
```javascript
// Run in browser console:
import bcrypt from 'https://cdn.skypack.dev/bcryptjs@2.4.3'
const hash = await bcrypt.hash('password123', 10)
console.log(hash)
```

### Option 2: Backend API Proxy (Recommended for Production)
Create a Node.js backend that:
1. Uses service account credentials (OAuth2)
2. Proxies all write requests
3. Keeps API credentials secure server-side

**Files to create:**
- `/api/users.js` - Handle signup/login
- `/api/stays.js` - Handle stay registration
- `/api/auth.js` - OAuth2 with Google

### Option 3: Use Supabase/Firebase (Fastest Full Solution)
Revert to using Supabase or Firebase, which support authentication and database operations natively.

## Immediate Next Steps

### 1. Add Headers to Google Sheets
Open both sheets and add these headers in row 1:

**Users Sheet:**
```
id	email	name	password_hash	created_at	email_verified
```

**Stays Sheet:**
```
id	stay_name	stay_type	description	location	unique_experience	activities	price_per_night	max_guests	meals_included	image_urls	host_id	host_name	contact_number	about_host	status	created_at
```

### 2. Add Test Data
Add at least one test user and one approved stay manually.

### 3. Test Read Operations
- Refresh test page: http://localhost:5173/test-google-sheets.html
- Click "2. Read Users Sheet" - should show your test data
- Click "3. Read Stays Sheet" - should show your test data
- Main app should now display test data

### 4. Decide on Write Solution
Choose one of the 3 options above based on your needs:
- **Quick demo?** → Option 1 (manual entry)
- **Production app?** → Option 2 (backend proxy)
- **Full features fast?** → Option 3 (Supabase/Firebase)

## Testing Workflow (Current Setup)

1. **Manually add user** in Google Sheets Users tab
2. **Get password hash**: Use bcrypt tool or browser console
3. **Test login**: Use the email/password you added
4. **Manually add stay** in Google Sheets Stays tab with `status='approved'`
5. **View stay**: Should appear on homepage

## Updated Test Page
The test page now correctly:
- ✅ Reads from `Sheet1` tab (not "Users"/"Stays" tabs)
- ✅ Clearly indicates write operations will fail
- ✅ Provides helpful error messages

## Questions?
Let me know which option you want to pursue and I'll help implement it!
