import { Building2, Home, LogOut, Menu, Phone, Star, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/home", icon: <Home size={16} /> },
    { name: "Buy", path: "/buy", icon: <Building2 size={16} /> },
    { name: "Rent", path: "/rent", icon: <Building2 size={16} /> },
    { name: "Featured", path: "/featured", icon: <Star size={16} /> },
    { name: "Contact", path: "/contact", icon: <Phone size={16} /> },
  ];

  return (
    <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 lg:h-18">
          
          {/* Left Section: Logo + Desktop Navigation */}
          <div className="flex min-w-0 flex-1 items-center gap-5">
            {/* Brand Logo */}
            <Link
              to="/home"
              className="flex shrink-0 items-center gap-2.5 group text-lg lg:text-xl font-extrabold tracking-tight text-gray-900"
            >
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <Building2 className="w-5 h-5 lg:w-5.5 lg:h-5.5" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ESTATE.PRO
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="ml-auto hidden lg:flex items-center justify-end gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`
                        flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-full
                        transition-all duration-200 ease-out
                        ${
                          isActive
                            ? "bg-blue-50/80 text-blue-600 shadow-sm shadow-blue-50/50"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }
                      `}
                    >
                      <span className={isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}>
                        {link.icon}
                      </span>
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Section: Logout Button (Desktop) */}
          <div className="ml-4 hidden lg:block">
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 ease-out"
            >
              <LogOut size={14} className="opacity-70 group-hover:opacity-100" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="ml-auto lg:hidden p-2 -mr-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar (Dropdown Menu) */}
      <div
        className={`
          lg:hidden overflow-hidden transition-all duration-300 ease-out bg-white/95 backdrop-blur-lg
          ${isOpen ? "max-h-[450px] border-b border-gray-100 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
        `}
      >
        <div className="px-4 py-4 space-y-1.5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl
                  transition-all duration-150
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <span className={isActive ? "text-blue-600" : "text-gray-400"}>
                  {link.icon}
                </span>
                {link.name}
              </Link>
            );
          })}
          
          <div className="pt-3 mt-3 border-t border-gray-100">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50/60 transition-all duration-150"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
