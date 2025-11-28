<!-- GitHub Copilot / AI agent instructions for the NomadiCircle codebase -->

# Quick Orientation
- Purpose: Single-page React app (Vite) for listing and registering "stays". Frontend-only repository; data & auth are provided by **Google Sheets** as the database.
- Entry: `src/main.jsx` -> `src/App.jsx` (React Router pages under `src/pages/`).

# How to run (dev / build)
- Install: `npm install` from the repo root.
- Dev server: `npm run dev` (Vite). Default port usually `5173`.
- Build: `npm run build`, Preview build: `npm run preview`.

# Key architectural boundaries
- UI: `src/components/` and `src/pages/` (page-level containers). Example: `src/pages/RegisterStay.jsx` handles complex form flows and calls Google Sheets helpers.
- Data & Auth: `src/googlesheets/*` — this is the **primary data layer** (see `src/googlesheets/config.js`, `auth.js`, `stays.js`).
- Legacy backends: `src/supabase/*` and `src/firebase/*` — these are **deprecated** and no longer used. All new code uses Google Sheets.
- Storage: Images are currently converted to placeholders (filename + size). In production, integrate with Cloudinary/ImgBB.

# Environment variables (used throughout)
- `VITE_GOOGLE_API_KEY` — required for Google Sheets API access in `src/googlesheets/config.js`.
- Legacy `VITE_SUPABASE_*` and `VITE_FIREBASE_*` values are **no longer used**.
- Use Vite `.env` files or CI platform secrets. Code reads via `import.meta.env`.

# Project-specific patterns & gotchas (do not guess — check these files)
- Heavy inline console logging is intentional for runtime debugging. Key files: `src/googlesheets/auth.js`, `src/googlesheets/stays.js`, `src/googlesheets/oauth.js`.
- Authentication: Uses bcryptjs for password hashing. Sessions stored in localStorage. No email verification yet (can be added).
- Google Sheets connection: `src/googlesheets/config.js` uses Google Sheets REST API v4 with OAuth2 for writes and API key for reads.
- **OAuth2 Implementation**: Users must click "Sign in with Google" button to grant API access. Tokens stored in localStorage, auto-refresh every hour.
- Sheet structure: Both spreadsheets have a tab named "Sheet1". Code uses sheetName parameter ('Users'/'Stays') for routing to correct spreadsheet ID, not tab name.
- Parameter signature: `src/googlesheets/stays.js` defines `registerStay(stayData, images, userId)` where images is an array of File objects.
- Rate limits: Google Sheets API allows 100 requests per 100 seconds per user. Consider caching for production.
- **Write operations**: Fully functional via OAuth2. See OAUTH2_COMPLETE.md for testing instructions.

# Common edits and where to change
- Add a new API helper: `src/googlesheets/<feature>.js` and export functions used by pages.
- Update signup/login behavior: edit `src/googlesheets/auth.js`. Update localStorage keys if changing session structure.
- Add storage uploads: `src/googlesheets/stays.js` has placeholder `uploadStayImages`. Integrate with Cloudinary/ImgBB for real uploads.
- Add new data sheet: Use `getOrCreateSheet(sheetTitle, headerValues)` in `config.js`.

# Debugging & developer workflow guidance
- Reproduce locally: run `npm run dev` and open developer console — many modules rely on runtime console output.
- Check env: misconfigured `VITE_GOOGLE_API_KEY` manifests as "Cannot connect to Google Sheets" errors.
- Sheet permissions: Sheet must be shared as "Anyone with the link can edit". Check sharing settings in Google Sheets.
- API errors: Network tab in dev tools shows Google Sheets API responses. Look for 403 (permission) or 404 (sheet not found) errors.

# Tests & CI
- There are no unit tests in the repo. CI/deploy uses Vercel (see `vercel.json`). For PRs, run `npm run lint` to satisfy ESLint rules.

# Safety & secrets
- Do not commit real secret values. The codebase currently logs partial keys for debug; avoid printing full keys when adding diagnostics.

# Files to inspect for context (examples)
- `src/googlesheets/config.js` — Google Sheets connection and JWT auth
- `src/googlesheets/auth.js` — signup, login, session handling with bcrypt
- `src/googlesheets/stays.js` — image processing, registerStay, stay management
- `src/pages/RegisterStay.jsx` — form validation and how stay data is prepared
- `src/components/AuthModalGoogleSheets.jsx` — custom auth modal (replaces Supabase UI)
- `GOOGLE_SHEETS_SETUP.md` — comprehensive setup guide for Google Sheets integration
- Legacy: `src/supabase/*` and `src/firebase/*` — deprecated, kept for reference only

# When editing, be conservative
- Preserve existing console.debug flows unless removing them is part of a wider cleanup PR.
- If you change auth/session behavior, test both signup and login flows and validate data appears in Google Sheets.
- Remember: localStorage is used for sessions. Clear it when testing auth changes.

# Setup checklist
1. Create Google Cloud project and enable Sheets API
2. Create API key restricted to Google Sheets API
3. Share the Google Sheet as "Anyone with the link can edit"
4. Add `VITE_GOOGLE_API_KEY` to `.env`
5. Create "Users" and "Stays" sheets with proper headers (see GOOGLE_SHEETS_SETUP.md)
6. Run `npm install` and `npm run dev`
7. Test signup — check Users sheet for new row
8. Test stay registration — check Stays sheet for new row

See `GOOGLE_SHEETS_SETUP.md` for detailed instructions.
