# 🌍 NomadiCircle

> Travel. Connect. Belong.

A modern, minimalist travel website connecting curious souls with authentic local cultures through offbeat journeys in the Himalayas and Northeast India.

![React](https://img.shields.io/badge/React-18.2-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC) ![Vite](https://img.shields.io/badge/Vite-5.1-646CFF) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0-FF0055)

## ✨ Features

- 🏔️ **Offbeat Destinations** - Mechuka, Spiti, Ziro, Tirthan Valley and more
- 🎭 **Local Experiences** - Tribal immersions, monastery retreats, cultural exchanges
- 🎨 **Cultural Stories** - Art, music, cuisine, and people from the road
- 📱 **Fully Responsive** - Beautiful on all devices
- ⚡ **Fast & Modern** - Built with Vite and React 18
- � **Smooth Animations** - Framer Motion scroll reveals and interactions
- 🎨 **Natural Design** - Sand, sage, and terracotta color palette

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud account (free tier works)
- Google Sheets API key

### Installation

```bash
# Navigate to project
cd NomadiCircle

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your VITE_GOOGLE_API_KEY

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see your site!

### First Time Setup
1. Follow the complete setup guide in `GOOGLE_SHEETS_SETUP.md`
2. Test your connection: Open `http://localhost:5173/test-google-sheets.html`
3. Create "Users" and "Stays" sheets in your Google Sheet
4. Try signing up and registering a stay

## 📂 Project Structure

```
nomadic-roots/
├── src/
│   ├── components/           # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroSection.jsx
│   │   ├── DestinationCard.jsx
│   │   ├── ExperienceCard.jsx
│   │   ├── CulturalHighlight.jsx
│   │   ├── ContactForm.jsx
│   │   └── AuthModalGoogleSheets.jsx
│   │
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── Destinations.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── RegisterStay.jsx
│   │
│   ├── googlesheets/        # Google Sheets integration
│   │   ├── config.js
│   │   ├── auth.js
│   │   └── stays.js
│   │
│   ├── assets/              # Images and static files
│   │   └── images/
│   │
│   ├── data.js              # Mock data (destinations, experiences)
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
│
├── public/                  # Static assets
│   └── test-google-sheets.html
├── .github/
│   └── copilot-instructions.md
├── GOOGLE_SHEETS_SETUP.md   # Complete setup guide
├── MIGRATION_SUMMARY.md     # Migration details
└── vercel.json              # Vercel config
```

## 🎨 Design System

### Colors
- **Sand** - Warm neutral tones (#f9f7f4 to #544025)
- **Sage** - Natural green tones (#f6f7f6 to #243124)
- **Terracotta** - Earthy accent colors (#fdf6f4 to #65291c)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

## 🛠️ Built With

- **[React](https://react.dev/)** - UI library
- **[Vite](https://vitejs.dev/)** - Build tool & dev server
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[React Router](https://reactrouter.com/)** - Client-side routing
- **[Lucide React](https://lucide.dev/)** - Icon library

## 📝 Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🚢 Deployment

### Vercel (Recommended)
1. Add `VITE_GOOGLE_API_KEY` to environment variables in Vercel dashboard
2. Deploy:
```bash
npm run build
vercel --prod
```

### Environment Variables for Production
Make sure to add these in your hosting platform:
- `VITE_GOOGLE_API_KEY` - Your Google Sheets API key

## 📊 Data Structure

Mock data in `src/data.js`:
- `destinations` - Offbeat locations
- `experiences` - Local experiences  
- `culturalStories` - Art, music, food, people stories
- `testimonials` - Traveler reviews
- `homePageCopy` - Poetic website copy

---

**Made with ❤️ for travelers who seek connection over collection**

*Pack light. Stay curious. Leave gently.*
