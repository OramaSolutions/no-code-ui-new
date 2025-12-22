import React from "react";
import { Link } from "react-router-dom";
import {
 
 
  Menu,
  X
} from "lucide-react";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${isScrolled ? 'bg-white shadow-lg text-gray-900' : 'bg-white/10 text-white'} backdrop-blur-md border-b border-white/20 fixed w-full z-50 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-white rounded-full p-1">
              <img
                src="/images/logo-sq.png"
                alt="Orama Solutions"
                className="h-8 w-auto rounded-full"
              />
            </div>
            <span className="text-xl font-bold">Orama Solutions</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#applications" className={`hover:${isScrolled ? 'text-indigo-600' : 'text-indigo-200'} transition`}>
              Applications
            </a>
            <a href="#process" className={`hover:${isScrolled ? 'text-indigo-600' : 'text-indigo-200'} transition`}>
              How It Works
            </a>
            <a href="#features" className={`hover:${isScrolled ? 'text-indigo-600' : 'text-indigo-200'} transition`}>
              Features
            </a>
            <Link
              to="/contact"
              className={`px-4 py-2 rounded-lg border ${isScrolled ? 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white' : 'border-white text-white hover:bg-white hover:text-indigo-600'} transition`}
            >
              Contact Sales
            </Link>
            <Link
              to="/login"
              className={`px-4 py-2 rounded-lg ${isScrolled ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white text-indigo-600 hover:bg-indigo-50'} transition font-medium`}
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden mt-4 pb-4 border-t ${isScrolled ? 'border-gray-200' : 'border-white/20'} pt-4`}>
            <div className="flex flex-col space-y-4">
              <a href="#applications" className={`${isScrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'} transition`}>
                Applications
              </a>
              <a href="#process" className={`${isScrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'} transition`}>
                How It Works
              </a>
              <a href="#features" className={`${isScrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'} transition`}>
                Features
              </a>
              <Link
                to="/contact"
                className={`${isScrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'} transition`}
              >
                Contact Sales
              </Link>
              <Link
                to="/login"
                className={`text-center py-2 rounded-lg font-medium ${isScrolled ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;