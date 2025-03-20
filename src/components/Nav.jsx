import { useState, useEffect } from "react";
import SvgIcons from "./icons/SvgIcons"; // Assuming it supports 'sun' & 'moon' icons

const Nav = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <nav className="flex justify-between items-center py-5 px-8 fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-all duration-300">
      <h3 className="text-[1.4rem] font-bold text-gray-900 dark:text-white">Urlite</h3>

      <div className="flex items-center gap-4">
        {/* GitHub Icon */}
        <a href="https://github.com/TreasureUzoma/Link-Lite" target="_blank" rel="noopener noreferrer">
          <SvgIcons icon="github" className="w-6 h-6 text-gray-900 dark:text-white transition-all duration-300" />
        </a>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-12 h-6 flex items-center justify-between bg-gray-300 dark:bg-gray-700 rounded-full p-1 transition-all duration-300 relative"
        >
          {/* Light Mode Icon */}
          <SvgIcons 
            icon="sun" 
            className={`absolute left-1 w-4 h-4 text-yellow-500 transition-all duration-300 ${theme === "light" ? "opacity-100" : "opacity-0"}`} 
          />

          {/* Dark Mode Icon */}
          <SvgIcons 
            icon="moon" 
            className={`absolute right-1 w-4 h-4 text-gray-900 dark:text-white transition-all duration-300 ${theme === "dark" ? "opacity-100" : "opacity-0"}`} 
          />

          {/* Toggle Knob */}
          <div
            className={`w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow-md transform ${
              theme === "dark" ? "translate-x-6" : "translate-x-0"
            } transition-all duration-300`}
          />
        </button>
      </div>
    </nav>
  );
};

export default Nav;
