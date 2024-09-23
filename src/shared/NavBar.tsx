import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.svg";

const Navbar: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    if (authContext) {
      authContext.logout();
      navigate("/login");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { user } = authContext;

  // Only render the Navbar if the user is defined
  if (!user) {
    return null;
  }

  return (
    <nav className="bg-blue-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center">
            <img
              className="h-12 w-12"
              src={logo}
              alt="Password Guardian Logo"
            />
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span className="text-white text-3xl font-bold">
              Password Guardian
            </span>
          </div>
          <div className="flex items-center pr-2 sm:ml-6 sm:pr-0">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                id="user-menu-button"
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
                onClick={toggleMenu}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src={`https://i.pravatar.cc/150?img=${user.username}`}
                  alt="User Avatar"
                />
              </button>

              {isMenuOpen && (
                <div
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                  >
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-gray-700 text-left"
                    role="menuitem"
                    tabIndex={-1}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
