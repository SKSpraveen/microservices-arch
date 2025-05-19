"use client";

import { useState, useEffect,useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getToken, setToken } from "@/store";
import { checkAuth } from "@/api";
import { refreshToken } from "@/api";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(storedLogin);
  }, []);

  const handleMouseEnter = () => {
    // Clear any existing hide timeout and open immediately
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    setMenuOpen(true);
  };

  const handleMouseLeave = () => {
    // Set timeout to close the menu after 2 seconds
    hideTimeout.current = setTimeout(() => {
      setMenuOpen(false);
    }, 500);
  };

  // useEffect(() => {
  //   const refreshInterval = setInterval(async () => {
  //     const refreshedToken = await refreshToken();
  //     if (refreshedToken) {
  //       setToken(refreshedToken); 
  //     }
  //   }, 30 * 60 * 1000); 

  //   return () => clearInterval(refreshInterval);
  // }, []);

  useEffect(() => {
    const checkUserAuth = async () => {
      const isAuthenticated = await checkAuth();
    };

    checkUserAuth();

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    router.push("/signin");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "nav-blur py-2" : "bg-transparent py-4"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-primary-600 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-1 bg-primary-600 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-4 h-4"
                >
                  <path d="M11.9999 3C8.41258 3 5.24327 4.95029 3.65002 7.9991C3.45867 8.37697 3.57162 8.83553 3.9055 9.0723C4.23938 9.30907 4.68222 9.22879 4.93355 8.91537C5.11003 8.69322 5.29603 8.48392 5.49097 8.28898C7.52724 6.25271 10.4727 5.25 13.5 5.25C14.3284 5.25 15 4.57843 15 3.75C15 2.92157 14.3284 2.25 13.5 2.25C12.6716 2.25 12 2.92157 12 3.75V3.75C12 4.57843 11.3284 5.25 10.5 5.25C9.67157 5.25 9 4.57843 9 3.75V3.75C9 2.92157 8.32843 2.25 7.5 2.25C6.67157 2.25 6 2.92157 6 3.75C6 4.57843 5.32843 5.25 4.5 5.25C3.67157 5.25 3 4.57843 3 3.75" />
                  <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" />
                  <path d="M12 13.5C9.49997 13.5 7.24997 14.7 5.99997 16.5C5.39997 17.4 6.09997 18.5 7.19997 18.5H16.8C17.9 18.5 18.6 17.4 18 16.5C16.75 14.7 14.5 13.5 12 13.5Z" />
                </svg>
              </div>
            </div>
            <span className="text-xl font-bold text-primary-600">
              QuickBite
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-dark-800 hover:text-primary-600 font-medium dark:text-gray-200 dark:hover:text-primary-400"
            >
              Home
            </Link>
            <Link
              href="/restaurants"
              className="text-dark-800 hover:text-primary-600 font-medium dark:text-gray-200 dark:hover:text-primary-400"
            >
              Restaurants
            </Link>
            <Link
              href="/about"
              className="text-dark-800 hover:text-primary-600 font-medium dark:text-gray-200 dark:hover:text-primary-400"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-dark-800 hover:text-primary-600 font-medium dark:text-gray-200 dark:hover:text-primary-400"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/cart" className="btn btn-ghost btn-icon relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </Link>
                <div className="relative group" 
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}>
                  {/* Trigger Button */}
                  <button className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                      JD
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  
                  {menuOpen && (
                    /* Dropdown Menu */
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 group-hover:block dark:bg-dark-800">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/profile/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/profile/addresses"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
                    >
                      Addresses
                    </Link>
                    <Link
                      href="/profile/payment"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
                    >
                      Payment Methods
                    </Link>
                    <Link
                      href="/profile/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-dark-700"
                    >
                      Sign out
                    </button>
                  </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    router.push("/signin");
                  }}
                  className="btn btn-outline dark:text-primary-300"
                >
                  Sign in
                </button>
                <Link href="/signup" className="btn btn-primary">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center text-white"
            onClick={toggleMobileMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 w-full px-4 rounded-lg animate-fade-in bg-white dark:bg-gray-800">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-dark-800 hover:text-primary-600 font-medium dark:text-gray-200 dark:hover:text-primary-400"
              >
                Home
              </Link>
              <Link
                href="/restaurants"
                className="text-dark-800 hover:text-primary-600 font-medium dark:text-gray-200 dark:hover:text-primary-400"
              >
                Restaurants
              </Link>
              <Link
                href="/about"
                className="text-dark-800 hover:text-primary-600 font-medium dark:text-gray-200 dark:hover:text-primary-400"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-dark-800 hover:text-primary-600 font-medium dark:text-gray-200 dark:hover:text-primary-400"
              >
                Contact
              </Link>

              <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                          JD
                        </div>
                        <span className="font-medium">John Doe</span>
                      </div>
                      <Link
                        href="/cart"
                        className="btn btn-ghost btn-icon relative"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          3
                        </span>
                      </Link>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Link
                        href="/profile"
                        className="block py-2 text-sm text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/profile/orders"
                        className="block py-2 text-sm text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
                      >
                        Orders
                      </Link>
                      <Link
                        href="/profile/addresses"
                        className="block py-2 text-sm text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
                      >
                        Addresses
                      </Link>
                      <Link
                        href="/profile/payment"
                        className="block py-2 text-sm text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
                      >
                        Payment Methods
                      </Link>
                      <Link
                        href="/profile/settings"
                        className="block py-2 text-sm text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left py-2 text-sm text-red-600"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => {
                        router.push("/signin");
                      }}
                      className="btn btn-outline w-full dark:text-white"
                    >
                      Sign in
                    </button>
                    <Link href="/signup" className="btn btn-primary w-full">
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
