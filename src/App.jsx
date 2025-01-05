import React, { useState } from "react";
import { MdDarkMode } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { RiMenu2Line } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
import { CiLight } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from "@vercel/analytics/react"
import Home from "./Pages/Home";
import Result from "./Pages/Result";
import Video from "./Pages/Components/Video";
import CommunitySupport from "./Pages/Other/CommunitySupport";
import About from "./Pages/Other/About";
import Search from "./Pages/Search";
import ViewAnimePage from "./Pages/ViewAnimePage";
import Login from "./Pages/Admin/Login";
import Dashboard from "./Pages/Admin/Dashboard";
import { useTheme } from "./App/Theme";

function App() {
  const [nav, setNav] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [switchBtn, setSwitchBtn] = useState(true);
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();

  const toggleNavbar = () => setNav(!nav);
  const toggleSearch = () => setSearchActive(!searchActive);
  const toggleHome = () => setSwitchBtn(false);
  const toggledHome = () => {
    setSwitchBtn(true);
    navigate("/home");
  };


  return (
    <div className={`p-0 m-0 ${darkMode ? "dark" : ""}`}>
    <SpeedInsights />
    <Analytics />
      {/* Side Navbar */}
      <div
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-slate-50 transform ${
          nav ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">Anime King</h1>
          <RxCross1 className="text-2xl cursor-pointer" onClick={toggleNavbar} />
        </div>
        <div className="flex flex-col space-y-4 p-4">
          <Link to="/" className="text-lg hover:text-gray-400">
            Home
          </Link>
          <Link to="/community-support" className="text-lg hover:text-gray-400">
            Community Support
          </Link>
          <Link to="/about" className="text-lg hover:text-gray-400">
            About
          </Link>
          <Link to="/admin-panel/login" className="text-lg hover:text-gray-400">
            Admin Panel
          </Link>
        </div>

        {/* Dark Mode Toggle */}
        <div className="absolute bottom-0 w-full flex items-center justify-center p-4">
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Dark Mode
          </span>
          <label className="relative inline-flex items-center cursor-pointer ml-4">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode((prev) => !prev)}
              className="sr-only"
              aria-label="Toggle dark mode"
            />
            <div className="w-16 h-8 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-300"></div>
            <div
              className={`absolute w-8 h-8 rounded-full transition-transform duration-300 transform ${
                darkMode ? "translate-x-8 bg-blue-500" : "translate-x-0 bg-yellow-500"
              } flex items-center justify-center`}
            >
              {darkMode ? (
                <CiLight className="text-white text-xl" />
              ) : (
                <MdDarkMode className="text-white text-xl" />
              )}
            </div>
          </label>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="p-4 flex justify-between items-center">
          {switchBtn ? (
            <RiMenu2Line className="text-2xl cursor-pointer" onClick={toggleNavbar} />
          ) : (
            <IoHomeOutline className="text-2xl cursor-pointer" onClick={toggledHome} />
          )}
          <IoIosSearch className="cursor-pointer text-2xl" onClick={toggleSearch} />
        </div>

        {/* Search Modal */}
        {searchActive && (
          <div
            className="fixed p-1 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
            role="dialog"
            aria-modal="true"
          >
            <Search toggleSearch={toggleSearch} />
          </div>
        )}

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/anime/:id" element={<ViewAnimePage toggleHome={toggleHome} />} />
          <Route path="/community-support" element={<CommunitySupport />} />
          <Route path="/about" element={<About/>} />
          <Route path="/anime/episode/v?" element={<Video/>} />
          <Route path="/search/q?" element={<Result/>} />
          <Route path="*" element={<h1>404 Error</h1>} />

          {/* Admin Routes */}
          <Route path="/admin-panel/login" element={<Login />} />
          <Route path="/admin-panel/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;