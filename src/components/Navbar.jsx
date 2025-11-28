import { Link } from 'react-router-dom'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AuthModal from './AuthModalGoogleSheets'
import GoogleAuthButton from './GoogleAuthButton'
import { signOutUser, getCurrentUser, onAuthStateChange } from '../googlesheets/auth'
import logo from '../assets/images/logo_final.png'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState(null) // null = not logged in
  const [loading, setLoading] = useState(true)

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Experiences', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  // Listen to auth state changes
  useEffect(() => {
    console.log('🔧 Navbar: Setting up auth listener')
    
    // Get initial session
    getCurrentUser().then(user => {
      console.log('📱 Navbar: Initial user:', user)
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes (Google Sheets version)
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      console.log('🔔 Navbar: Auth state changed:', event)
      console.log('👤 Navbar: Session user:', session?.user?.email)
      
      if (event === 'SIGNED_IN' && session?.user) {
        // User signed in
        console.log('✨ Navbar: Setting user to:', session.user)
        setUser(session.user)
      } else {
        // User signed out
        console.log('👋 Navbar: User signed out')
        setUser(null)
      }
      setLoading(false)
    })

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleAuthSuccess = (userData) => {
    console.log('🎉 Navbar received auth success:', userData)
    console.log('📝 User name:', userData?.name)
    setUser(userData)
    setShowAuthModal(false)
    console.log('✅ User state updated, modal closed')
  }

  const handleLogout = async () => {
    const result = await signOutUser()
    if (result.success) {
      setUser(null)
    }
  }

  return (
    <>
      <nav className="fixed top-0 w-full bg-sand-50/95 backdrop-blur-sm z-50 border-b border-sage-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img src={logo} alt="NomadiCircle" className="h-12 w-auto" />
            <span className="text-xl font-serif font-bold text-sage-900">
              NomadiCircle
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-sage-700 hover:text-terracotta-500 transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  {/* Show user info and logout when logged in */}
                  <div className="flex items-center space-x-2 px-4 py-2 bg-sage-100 rounded-full max-w-xs">
                    <User size={18} className="text-sage-700 flex-shrink-0" />
                    <span className="text-sage-900 font-medium text-sm truncate">
                      {user.name || user.email || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-terracotta-500 text-white rounded-full hover:bg-terracotta-600 transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Sign Up: Google OAuth + OTP verification + save to Users */}
                  <GoogleAuthButton mode="signup" />
                  {/* Sign In: Google OAuth only */}
                  <GoogleAuthButton mode="signin" />
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-sage-700 hover:text-terracotta-500 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-4 pt-4 pb-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                      setIsOpen(false)
                    }}
                    className="text-sage-700 hover:text-terracotta-500 transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                ))}
                
                {/* Mobile Auth Button */}
                {user ? (
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-sage-100 rounded-full">
                      <User size={18} className="text-sage-700 flex-shrink-0" />
                      <span className="text-sage-900 font-medium text-sm truncate">{user.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-terracotta-500 text-white rounded-full hover:bg-terracotta-600 transition-colors"
                    >
                      <LogOut size={18} />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowAuthModal(true)
                      setIsOpen(false)
                    }}
                    className="px-6 py-2 bg-terracotta-500 text-white rounded-full hover:bg-terracotta-600 transition-colors font-medium text-center"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  )
}

export default Navbar
