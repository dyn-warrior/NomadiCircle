import { Link } from 'react-router-dom'
import { Instagram, Mail } from 'lucide-react'
import logo from '../assets/images/logo_final.png'

function Footer() {
  const currentYear = new Date().getFullYear()

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-sage-900 text-sand-100">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <img src={logo} alt="NomadiCircle" className="h-12 w-auto" />
              <span className="text-lg font-serif font-bold">NomadiCircle</span>
            </div>
            <p className="text-sage-300 text-sm">
              Connecting travelers with authentic local cultures through offbeat journeys and meaningful experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-bold mb-4 text-sand-100">Explore</h3>
            <ul className="space-y-2 text-sage-300 text-sm">
              <li>
                <Link to="/" onClick={handleLinkClick} className="hover:text-terracotta-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/destinations" onClick={handleLinkClick} className="hover:text-terracotta-400 transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={handleLinkClick} className="hover:text-terracotta-400 transition-colors">
                  Experiences
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={handleLinkClick} className="hover:text-terracotta-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-serif font-bold mb-4 text-sand-100">Resources</h3>
            <ul className="space-y-2 text-sage-300 text-sm">
              <li>
                <Link to="/travel-guide" onClick={handleLinkClick} className="hover:text-terracotta-400 transition-colors">
                  Travel Guide
                </Link>
              </li>
              <li>
                <Link to="/blog" onClick={handleLinkClick} className="hover:text-terracotta-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" onClick={handleLinkClick} className="hover:text-terracotta-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" onClick={handleLinkClick} className="hover:text-terracotta-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="font-serif font-bold mb-4 text-sand-100">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://www.instagram.com/nomadi_circle6/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-300 hover:text-terracotta-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <Link
                to="/contact"
                onClick={handleLinkClick}
                className="text-sage-300 hover:text-terracotta-400 transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </Link>
            </div>
            <p className="text-sage-300 text-sm">
              Subscribe to our newsletter for travel tips and exclusive offers.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sage-700 pt-8 text-center text-sage-400 text-sm">
          <p>
            © {currentYear} NomadiCircle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
