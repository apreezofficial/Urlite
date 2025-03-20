import { useState, useEffect } from "react";
import SvgIcons from "./icons/SvgIcons";

const Nav = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <nav className="flex justify-between items-center py-5 px-8 fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <h3 className="text-[1.4rem] font-bold text-gray-900 dark:text-white">
        Urlite
      </h3>

      <div className="flex items-center gap-4">
        <a href="https://github.com/TreasureUzoma/Link-Lite" target="_blank" rel="noopener noreferrer">
          <SvgIcons icon="github" className="w-6 h-6 text-gray-900 dark:text-white" />
        </a>

        <button
          onClick={toggleTheme}
          className="w-10 h-5 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full p-1 transition duration-300"
        >
          <div
            className={`w-4 h-4 bg-white dark:bg-gray-900 rounded-full shadow-md transform ${
              theme === "dark" ? "translate-x-5" : ""
            } transition duration-300`}
          />
        </button>
      </div>
    </nav>
  );
};

export default Nav;
