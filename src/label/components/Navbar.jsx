import React from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {

  return (
    <nav className={`bg-black fixed w-full z-50 transition-all duration-300 h-14`}>
      <div className="max-w-7xl mx-auto px-6 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Left side - Logo and Brand Name */}
          <div className="flex items-center space-x-3">
            <div className={`bg-white rounded-full p-1`}>
              <img
                src="/images/logo-sq.png"
                alt="Orama Solutions"
                className="h-7 w-auto rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-bold text-white`}>
                ORAMA SOLUTIONS
              </span>
              <span className={`text-xs text-gray-300`}>
                Labeling Tool
              </span>
            </div>
          </div>

          {/* Right side - Optional empty space or could add something later */}
          <div className="flex items-center space-x-4">
            {/* Empty for now - can add items later if needed */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;