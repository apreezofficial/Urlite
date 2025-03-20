import { useState, useEffect } from "react";
import SvgIcons from "./icons/SvgIcons"; // Your custom SVG icons

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
    <>
      {/* Apply full-page styles */}
      <style>{`
        html, body {
          transition: background-color 0.5s ease-in-out, color 0.5s ease-in-out;
        }
        .dark body {
          background-color: #111827;
          color: white;
        }
        .light body {
          background-color: white;
          color: black;
        }

        /* Input fields */
        input, textarea, select {
          background-color: #f3f4f6;
          color: #111827;
          border: 1px solid #d1d5db;
          padding: 10px;
          border-radius: 5px;
          transition: all 0.3s ease-in-out;
        }
        .dark input, .dark textarea, .dark select {
          background-color: #1f2937;
          color: white;
          border: 1px solid #374151;
        }

        /* Placeholder */
        input::placeholder, textarea::placeholder {
          color: #9ca3af;
          transition: color 0.3s ease-in-out;
        }
        .dark input::placeholder, .dark textarea::placeholder {
          color: #6b7280;
        }

        /* Buttons */
        button {
          background-color: #e5e7eb;
          color: #111827;
          padding: 10px 16px;
          border-radius: 5px;
          transition: all 0.3s ease-in-out;
        }
        .dark button {
          background-color: #374151;
          color: white;
        }
        button:hover {
          background-color: #d1d5db;
        }
        .dark button:hover {
          background-color: #4b5563;
        }
      `}</style>

      {/* Navbar */}
      <nav className="flex justify-between items-center py-5 px-8 fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-all duration-300">
        <h3 className="text-[1.4rem] font-bold text-gray-900 dark:text-white">Urlite</h3>

        <div className="flex items-center gap-4">
          {/* GitHub Icon */}
          <a href="https://github.com/TreasureUzoma/Link-Lite" target="_blank" rel="noopener noreferrer">
            <SvgIcons icon="github" className="w-6 h-6 text-gray-900 dark:text-white transition-all duration-300" />
          </a>

          {/* Theme Toggle Button (Shows Only Active Icon) */}
          <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 p-2 transition-all duration-300">
            {theme === "light" ? (
              <SvgIcons icon="moon" className="w-6 h-6 text-gray-900 dark:text-white transition-all duration-300" />
            ) : (
              <SvgIcons icon="sun" className="w-6 h-6 text-yellow-500 transition-all duration-300" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Nav;
