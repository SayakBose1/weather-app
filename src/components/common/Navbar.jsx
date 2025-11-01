import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";

export default function Navbar({
  dark,
  setDark,
  currentSection,
  setCurrentSection,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { name: "Home", id: "home", icon: "🏠" },
    { name: "World Map", id: "worldmap", icon: "🗺️" },
    { name: "Favorites", id: "favorites", icon: "❤️" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 shadow-lg border-b border-slate-200/50 dark:border-slate-700/50 z-[10000]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent cursor-pointer relative">
                Weathero
                <motion.span
                  className="absolute -top-1 -right-6 text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-0.5 rounded-full font-bold"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  ✨
                </motion.span>
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {links.map((link, index) => (
                <motion.button
                  key={link.id}
                  onClick={() => setCurrentSection(link.id)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative px-5 py-2 rounded-lg text-base font-semibold transition-all duration-300 group ${
                    currentSection === link.id
                      ? "text-white"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {/* Active Background */}
                  {currentSection === link.id && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Hover Background */}
                  {currentSection !== link.id && (
                    <div className="absolute inset-0 bg-gray-100 dark:bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}

                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">{link.icon}</span>
                    {link.name}
                  </span>

                  {/* Hover Underline Effect */}
                  {currentSection !== link.id && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-3/4 transition-all duration-300" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Right Side: Auth & Theme */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Signed In */}
              <SignedIn>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10 ring-2 ring-blue-500 dark:ring-purple-500",
                        },
                      }}
                    />
                  </div>
                </motion.div>
              </SignedIn>

              {/* Signed Out */}
              <SignedOut>
                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 text-base font-bold border-2 border-gray-300 dark:border-slate-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Login</span>
                    <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  </motion.button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 text-base font-bold rounded-lg bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Sign Up</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
                </SignUpButton>
              </SignedOut>

              {/* Dark Mode Toggle */}
              <motion.button
                onClick={() => setDark(!dark)}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative p-3 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 dark:from-slate-700 dark:to-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {dark ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: 180, scale: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SunIcon className="w-6 h-6 text-yellow-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: -180, scale: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MoonIcon className="w-6 h-6 text-slate-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              <motion.button
                onClick={() => setDark(!dark)}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800"
              >
                {dark ? (
                  <SunIcon className="w-5 h-5 text-yellow-400" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-gray-700" />
                )}
              </motion.button>

              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-2">
                {links.map((link, index) => (
                  <motion.button
                    key={link.id}
                    onClick={() => {
                      setCurrentSection(link.id);
                      setMobileMenuOpen(false);
                    }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center gap-3 ${
                      currentSection === link.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="text-xl">{link.icon}</span>
                    {link.name}
                  </motion.button>
                ))}

                {/* Mobile Auth Buttons */}
                <SignedOut>
                  <div className="pt-4 space-y-2 border-t border-slate-200 dark:border-slate-700">
                    <SignInButton mode="modal">
                      <button className="w-full px-4 py-3 text-base font-bold border-2 border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:border-blue-500 transition-all">
                        Login
                      </button>
                    </SignInButton>

                    <SignUpButton mode="modal">
                      <button className="w-full px-4 py-3 text-base font-bold rounded-lg bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white shadow-lg">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                </SignedOut>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
