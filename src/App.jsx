import React, { useState } from "react";
import Navbar from "./components/common/Navbar";
import HomePage from "./pages/HomePage";
import WorldMapPage from "./pages/WorldMapPage";
import FavoritesPage from "./pages/FavoritesPage";
import Footer from "./components/common/Footer";

export default function App() {
  const [dark, setDark] = useState(false);
  const [currentSection, setCurrentSection] = useState("home");

  return (
    <div className={dark ? "dark bg-slate-900 text-white min-h-screen" : "bg-white text-black min-h-screen"}>
      <Navbar 
        dark={dark} 
        setDark={setDark} 
        currentSection={currentSection} 
        setCurrentSection={setCurrentSection} 
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {currentSection === "home" && <HomePage />}
        {currentSection === "worldmap" && <WorldMapPage />}
        {currentSection === "favorites" && <FavoritesPage />}
      </main>

      <Footer />
    </div>
  );
}
