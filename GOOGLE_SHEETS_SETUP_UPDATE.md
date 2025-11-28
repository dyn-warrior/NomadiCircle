# Google Sheets Structure Update

## ✅ Changes Completed

### 1. Single Spreadsheet Configuration
**Old Setup:**
- Separate spreadsheets for Users and Stays
- `USERS_SPREADSHEET_ID = 1JNnTnypBMvc5M-w5wof9SSpoTEynthDyADgpj5MwVgRE`
- `STAYS_SPREADSHEET_ID = 1rAaFKTtLweoyofjj8Kk7_znPgyJk2QZgqOoidSFgJME`

**New Setup:**
- Single spreadsheet ID: `1rAaFKTtLweoyofjj8Kk7_znPgyJk2QZgqOoidSFgJME`
- Three tabs within this spreadsheet:
  - **Users** tab
  - **Stays** tab
  - **Bookings** tab

### 2. Updated Files

#### **src/googlesheets/config.js**
- ✅ Removed separate spreadsheet IDs
- ✅ Changed to use single `SPREADSHEET_ID`
- ✅ Updated all API calls to use actual tab names (Users, Stays, Bookings) instead of hardcoded 'Sheet1'
- ✅ Fixed `getSheetValues()` to use `/${sheetName}!${range}`
- ✅ Fixed `appendSheetValues()` to use `/${sheetName}!A1:append`
- ✅ Fixed `updateSheetValues()` to use `/${sheetName}!${range}`

#### **src/googlesheets/stays.js**
- ✅ Updated `registerStay()` signature to accept `upiQrImage` parameter
- ✅ Added UPI QR code upload functionality
- ✅ Added new fields to row values:
  - `private_room_price`
  - `dorm_price`
  - `upi_id`
  - `upi_qr_url`
- ✅ Updated `getApprovedStays()` to return new fields
- ✅ Updated `getHostStays()` to return new fields

#### **src/pages/RegisterStay.jsx**
- ✅ Added new form fields to state:
  - `privateRoomPrice`
  - `dormPrice`
  - `upiId`
  - `upiQr`
- ✅ Added `handleUpiQrUpload()` function for QR code image upload
- ✅ Updated form UI with new fields:
  - Base Price per Night (for dorm beds)
  - Private Room Price (optional)
  - Dorm Bed Price (optional)
  - UPI ID (required)
  - UPI QR Code upload (optional)
- ✅ Added validation for UPI ID
- ✅ Updated `registerStay()` call to pass UPI QR image

#### **src/googlesheets/payment.js**
- ✅ Already configured to save to 'Bookings' tab (no changes needed)

---

## 📋 Required Actions for You

### Step 1: Update Your Google Sheet Structure

**In your spreadsheet (ID: 1rAaFKTtLweoyofjj8Kk7_znPgyJk2QZgqOoidSFgJME):**

#### **Create/Update "Users" Tab:**
Headers (Row 1):
```
id | email | password_hash | name | created_at
```

#### **Create/Update "Stays" Tab:**
**⚠️ IMPORTANT: Updated column structure (price_per_night REMOVED):**

**NEW headers:**
```
id | stay_name | stay_type | description | location | unique_experience | activities | private_room_price | dorm_price | max_guests | meals_included | offerings | image_urls | host_id | host_name | contact_number | upi_id | upi_qr_url | about_host | status | created_at
```

Changes:
- **REMOVED:** `price_per_night` column (no longer used)
- Column H: `private_room_price` (REQUIRED - price for private rooms)
- Column I: `dorm_price` (REQUIRED - price per dorm bed)
- Column L: `offerings` (JSON string of amenities)
- Column Q: `upi_id` (REQUIRED - UPI ID for payments)
- Column R: `upi_qr_url` (Image URL of UPI QR code)

#### **Create "Bookings" Tab:**
Headers (Row 1):
```
booking_id | stay_id | stay_name | host_name | room_type | beds | total_price | status | created_at | verified_host | verification_status
```

### Step 2: Verify Sheet Permissions
- Make sure the spreadsheet is shared as "Anyone with the link can edit"
- Check: File → Share → Copy link → "Anyone with the link" permissions

### Step 3: Test the System

1. **Test Stay Registration:**
   - Go to Register Stay page
   - Fill in all required fields including:
     - Base Price per Night (required)
     - Private Room Price (optional)
     - Dorm Bed Price (optional)
     - UPI ID (required - e.g., `9876543210@paytm`)
     - Upload UPI QR code (optional)
   - Submit and check if data appears in **Stays tab**

2. **Test Booking Flow:**
   - Go to a stay detail page
   - Click "Book Now"
   - Select room type (Private or Dorm)
   - Proceed to payment
   - Upload payment screenshot
   - Verify booking saves to **Bookings tab**

3. **Test User Registration:**
   - Sign up with new account
   - Check if user data appears in **Users tab**

---

## 🔧 Column Order Reference

**Stays Tab (21 columns total):**
1. `id` (A)
2. `stay_name` (B)
3. `stay_type` (C)
4. `description` (D)
5. `location` (E)
6. `unique_experience` (F)
7. `activities` (G) - JSON string
8. **`private_room_price`** (H) ⭐ REQUIRED
9. **`dorm_price`** (I) ⭐ REQUIRED
10. `max_guests` (J)
11. `meals_included` (K)
12. **`offerings`** (L) ⭐ NEW - JSON string of amenities
13. `image_urls` (M)
14. `host_id` (N)
15. `host_name` (O)
16. `contact_number` (P)
17. **`upi_id`** (Q) ⭐ REQUIRED
18. **`upi_qr_url`** (R) ⭐ NEW
19. `about_host` (S)
20. `status` (T)
21. `created_at` (U)

---

## 💡 How It Works Now

### Pricing System:
- **Private Room Price**: REQUIRED - price for booking entire private room
- **Dorm Bed Price**: REQUIRED - price per bed in shared dorm room
- ⚠️ **price_per_night column removed** - now using separate prices for private/dorm

### Offerings/Amenities System:
Stored as JSON string with these options:
- 🏔️ Mountain View
- 🔐 Lockers
- ♨️ Hot Water
- 🚰 Water Dispenser
- 🎲 Common Hangout Area
- 🏞️ Valley View
- 🧳 Storage Facility
- 🛏️ Linen Included
- 🚿 Shower
- 🅿️ Parking Options

### UPI Payment System:
- **UPI ID**: Required field, format like `9876543210@paytm`
- **UPI QR Code**: Optional, uploaded as image and hosted on ImgBB
- Shown on payment page during booking
- Gemini AI verifies payment screenshot matches host name

### Data Flow:
1. **User signs up** → Data goes to **Users tab**
2. **Host registers stay** → Data goes to **Stays tab** (with UPI details)
3. **Guest books stay** → Data goes to **Bookings tab**
4. All tabs are in the same spreadsheet

---

## 🐛 Troubleshooting

### Issue: "Cannot find sheet"
- **Solution**: Make sure you created all three tabs: Users, Stays, Bookings

### Issue: "Data not appearing in correct tab"
- **Solution**: Check that tab names are EXACTLY: `Users`, `Stays`, `Bookings` (case-sensitive)

### Issue: "Column mismatch error"
- **Solution**: Verify column headers match exactly as shown above
- Make sure new columns are added in correct positions

### Issue: "UPI QR not uploading"
- **Solution**: Check image size is under 5MB
- Verify ImgBB API key is set: `841c1ea2c9f28942c54830acde06a8bf`

---

## 📝 Notes

- Old USERS_SPREADSHEET_ID data is NOT migrated automatically
- You need to manually copy data from old Users sheet to new Users tab if needed
- Bookings will only save to the Bookings tab from now on (not Stays tab)
- All image uploads (stay images + UPI QR) use ImgBB hosting
- Private room price and dorm price are optional - if not provided, base price is used

---

## ✅ Verification Checklist

- [ ] Single spreadsheet has three tabs: Users, Stays, Bookings
- [ ] Stays tab has 4 new columns added in correct positions
- [ ] All tab names are exact (case-sensitive)
- [ ] Spreadsheet sharing permissions are set to "Anyone with link can edit"
- [ ] Test stay registration works and saves to Stays tab
- [ ] Test booking works and saves to Bookings tab
- [ ] UPI ID appears in stay registration form
- [ ] UPI QR code can be uploaded
- [ ] Payment page shows UPI details correctly
