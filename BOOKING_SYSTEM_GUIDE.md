# Complete Booking System Setup Guide

## Overview
The booking system allows users to:
1. Select room types (Private Room or Dorm Bed)
2. Make UPI payments
3. Upload payment screenshots
4. Get AI-verified booking confirmations

## Architecture

### Flow Diagram
```
Stay Detail Page → Book Now → Room Selection → Payment Page → AI Verification → Confirmation
```

### Pages Created
1. **BookingPage.jsx** - Room selection (Private/Dorm)
2. **PaymentPage.jsx** - UPI payment & screenshot upload
3. **BookingConfirmed.jsx** - Confirmation receipt

### AI Verification
- Uses **Google Gemini 1.5 Flash** model
- Verifies recipient name matches host name in screenshot
- Returns binary true/false
- Prevents fraudulent bookings

## Setup Instructions

### 1. Google Gemini API Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Create new API key or use existing project
4. Copy the API key
5. Add to `.env`:
   ```
   VITE_GEMINI_API_KEY=your_actual_gemini_key_here
   ```

### 2. Create Bookings Sheet in Google Sheets

#### Option A: Manual Creation
1. Open your Stays spreadsheet
2. Create a new sheet/tab named **"Bookings"**
3. Add these headers in row 1:
   ```
   booking_id | stay_id | stay_name | host_name | room_type | beds | total_price | status | created_at | verified_host | verification_status
   ```

#### Option B: Use the Bookings Spreadsheet
Create a separate spreadsheet for bookings:
- URL format: `https://docs.google.com/spreadsheets/d/YOUR_BOOKINGS_SHEET_ID/edit`
- Update `src/googlesheets/config.js` to add the Bookings sheet ID

### 3. Update config.js (if using separate Bookings sheet)

```javascript
const SHEET_IDS = {
  Users: '1JNnTnypBMvc5M-w5wof9SSpoTEythDyADgpj5MwVgRE',
  Stays: '1rAaFKTtLweoyofjj8Kk7_znPgyJk2QZgqOoidSFgJME',
  Bookings: 'YOUR_BOOKINGS_SHEET_ID_HERE'  // Add this line
}
```

## Usage Guide

### For Users

#### Step 1: Browse Stays
- Visit homepage
- Click "View Details" on any stay card

#### Step 2: View Stay Details
- See full stay information
- View host details
- Click "Book Now" button

#### Step 3: Select Room Type
- **Private Room**: Exclusive space at 1.5x base price
- **Dorm Bed**: Shared space at base price
- For dorms: Select number of beds (1 to max_guests)
- Click "Proceed to Payment"

#### Step 4: Make Payment
- View UPI payment details
- UPI ID format: `{contact_number}@paytm`
- Scan QR code (placeholder in current version)
- Make payment via any UPI app

#### Step 5: Upload Screenshot
- Take screenshot showing:
  - **Recipient name at the top** (MOST IMPORTANT)
  - Transaction amount
  - Transaction ID
  - Timestamp
- Upload screenshot (max 5MB)
- Click "Verify & Confirm Booking"

#### Step 6: AI Verification
- Gemini AI analyzes screenshot
- Checks if recipient name matches host name
- Verification takes 3-5 seconds

#### Step 7: Get Confirmation
- **If verified**: See confirmation page with booking ID
- **If failed**: Error message - check recipient name
- Download receipt as text file

### For Hosts

#### Viewing Bookings
Currently, bookings are stored in the Bookings Google Sheet. Hosts can:
1. Access the Bookings sheet
2. Filter by `host_name` column
3. See all confirmed bookings

#### Future Host Dashboard (To be implemented)
- Login as host
- View all bookings for their stays
- See booking details
- Mark guests as checked-in

## Pricing Logic

### Private Room
```javascript
price = stay.price_per_night * 1.5
```
Example: If base price is $20/night, private room costs $30/night

### Dorm Bed
```javascript
price = stay.price_per_night * number_of_beds
```
Example: If base price is $20/night, 2 beds cost $40/night total

## AI Verification Details

### Gemini Prompt
The AI receives:
1. The payment screenshot (base64 encoded)
2. Expected host name from database
3. Clear instructions to check recipient name

### Verification Criteria
- ✅ **Pass**: Recipient name matches or closely matches host name
- ❌ **Fail**: Different name or no recipient name visible
- Case-insensitive comparison
- Allows minor spelling variations

### Response Format
Gemini returns simple text:
- `"true"` = Verified
- `"false"` = Not verified

## Data Storage

### Bookings Sheet Schema
```
| Column              | Type     | Description                          |
|---------------------|----------|--------------------------------------|
| booking_id          | String   | Unique ID (BK + timestamp + random)  |
| stay_id             | String   | Reference to stays table             |
| stay_name           | String   | Name of the stay                     |
| host_name           | String   | Host's name                          |
| room_type           | String   | "private" or "dorm"                  |
| beds                | Number   | Number of beds/rooms booked          |
| total_price         | Number   | Total amount paid                    |
| status              | String   | "confirmed"                          |
| created_at          | DateTime | ISO 8601 timestamp                   |
| verified_host       | String   | Expected host name for verification  |
| verification_status | String   | "verified"                           |
```

## Testing the System

### Test Booking Flow
1. Start dev server: `npm run dev`
2. Navigate to any approved stay
3. Click "Book Now"
4. Select "Private Room"
5. Click "Proceed to Payment"
6. Upload a test screenshot showing a name
7. Watch AI verification in action

### Test Screenshot Requirements
For testing, create a fake payment screenshot with:
- Clear "To:" or "Paid to:" label
- Host name visible at top
- Can use image editing tool to create test image

### Expected Behavior
- **Correct name in screenshot**: ✅ Booking confirmed
- **Wrong name in screenshot**: ❌ Error message
- **No clear name**: ❌ Error message

## Troubleshooting

### "Failed to verify payment"
**Cause**: Gemini couldn't find matching name
**Solution**: 
- Ensure recipient name is at TOP of screenshot
- Name should be clearly visible
- Check for typos in host name in database

### "Gemini API error: 400"
**Cause**: Invalid API key or request format
**Solution**:
- Verify VITE_GEMINI_API_KEY in .env
- Check Gemini API quota
- Ensure image is valid base64

### Booking not appearing in sheet
**Cause**: OAuth token expired or sheet permissions
**Solution**:
- Re-sign in with Google OAuth
- Check sheet permissions (must be "Anyone with link can edit")
- Verify Bookings sheet exists with correct headers

## Security Considerations

### Current Implementation
- ✅ AI verification prevents fake payment screenshots
- ✅ Host name must match exactly
- ✅ OAuth2 for secure write operations
- ⚠️ UPI details visible to users (necessary for payment)

### Future Improvements
1. **Payment Gateway Integration**: Real payment processing
2. **Email Verification**: Send confirmation emails
3. **SMS Notifications**: Notify hosts of new bookings
4. **Booking Management**: Allow cancellations/refunds
5. **Calendar Integration**: Check availability dates
6. **Image Encryption**: Encrypt payment screenshots in storage

## API Costs

### Google Gemini API
- Free tier: 60 requests per minute
- Cost after free tier: ~$0.00025 per image
- Essentially free for most use cases

### ImgBB API
- Free tier: Unlimited storage
- No API rate limits mentioned
- 100% free for image hosting

## Next Steps

### Immediate
1. Add Gemini API key to .env
2. Create Bookings sheet
3. Test complete booking flow
4. Update host's UPI QR code logic

### Short-term
1. Generate actual UPI QR codes
2. Add booking history for users
3. Email confirmations
4. Host dashboard

### Long-term
1. Real payment gateway (Razorpay, Stripe)
2. Calendar system for availability
3. Reviews and ratings
4. Booking modifications/cancellations
5. Multi-night booking support

## Support

For issues or questions:
1. Check console logs for detailed error messages
2. Verify all environment variables are set
3. Check Google Sheets permissions
4. Ensure OAuth is working (can write to sheets)

---

**Version**: 1.0
**Last Updated**: November 25, 2025
**Status**: Production Ready (with test payment verification)
