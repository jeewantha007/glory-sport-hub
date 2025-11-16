import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from '../assets/logo.jpg';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
            <img
              src={logo}
              alt="Glory of Sport Logo"
              className="w-10 h-10 rounded-full object-cover group-hover:scale-110 transition-transform"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Glory of Sport
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`transition-colors ${
                isActive("/")
                  ? "text-white font-medium"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              to="/categories"
              className={`transition-colors ${
                isActive("/categories")
                  ? "text-white font-medium"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Categories
            </Link>
            <Link
              to="/about"
              className={`transition-colors ${
                isActive("/about")
                  ? "text-white font-medium"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`transition-colors ${
                isActive("/contact")
                  ? "text-white font-medium"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={closeMenu}
                className={`transition-colors ${
                  isActive("/")
                    ? "text-white font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                to="/categories"
                onClick={closeMenu}
                className={`transition-colors ${
                  isActive("/categories")
                    ? "text-white font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Categories
              </Link>
              <Link
                to="/about"
                onClick={closeMenu}
                className={`transition-colors ${
                  isActive("/about")
                    ? "text-white font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={closeMenu}
                className={`transition-colors ${
                  isActive("/contact")
                    ? "text-white font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;