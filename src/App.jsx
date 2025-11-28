import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Destinations from './pages/Destinations'
import About from './pages/About'
import Contact from './pages/Contact'
import RegisterStay from './pages/RegisterStay'
import StayDetail from './pages/StayDetail'
import BookingPage from './pages/BookingPage'
import PaymentPage from './pages/PaymentPage'
import BookingConfirmed from './pages/BookingConfirmed'
import TravelGuide from './pages/TravelGuide'
import Blog from './pages/Blog'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import JoinCommunity from './pages/JoinCommunity'
import { initOAuth } from './googlesheets/oauth'

function App() {
  const [oauthReady, setOauthReady] = useState(false)

  useEffect(() => {
    // Initialize OAuth when app loads
    const init = async () => {
      try {
        // Wait for Google Identity Services to load
        await new Promise((resolve) => {
          if (typeof google !== 'undefined' && google.accounts) {
            resolve()
          } else {
            const checkInterval = setInterval(() => {
              if (typeof google !== 'undefined' && google.accounts) {
                clearInterval(checkInterval)
                resolve()
              }
            }, 100)
            
            // Timeout after 10 seconds
            setTimeout(() => {
              clearInterval(checkInterval)
              resolve()
            }, 10000)
          }
        })

        await initOAuth()
        console.log('✅ OAuth initialized in App')
        setOauthReady(true)
      } catch (err) {
        console.error('⚠️ OAuth init failed:', err)
        setOauthReady(true) // Continue anyway
      }
    }

    init()
  }, [])

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/stay/:id" element={<StayDetail />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/payment/:id" element={<PaymentPage />} />
            <Route path="/booking-confirmed/:id" element={<BookingConfirmed />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register-stay" element={<RegisterStay />} />
            <Route path="/travel-guide" element={<TravelGuide />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/join-community" element={<JoinCommunity />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
