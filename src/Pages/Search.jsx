import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Search({ toggleSearch }) {
  const [query, setQuery] = useState("");
  const [mockData, setMockData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return; // Ignore empty input
    navigate(`/search/q?keyword=${query}`);
    toggleSearch();
  };

  const fetchSuggestions = async (input) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/suggestion`);
      setMockData(response.data.data);
      setSuggestions(
        response.data.data.filter((item) =>
          item.toLowerCase().includes(input.toLowerCase())
        )
      );
    } catch (error) {
      console.error(error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query) fetchSuggestions(query);
      else setSuggestions([]);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") toggleSearch();
      if (e.key === "ArrowDown") {
        setFocusedIndex((prev) => (prev + 1) % suggestions.length);
      }
      if (e.key === "ArrowUp") {
        setFocusedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      }
      if (e.key === "Enter" && focusedIndex >= 0) {
        setQuery(suggestions[focusedIndex]);
        setSuggestions([]);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, suggestions, toggleSearch]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
      <div className="relative bg-white dark:bg-gray-900 shadow-lg w-full max-w-2xl mx-auto mt-4 p-6 rounded-lg">
        <button
          onClick={toggleSearch}
          className="absolute top-2 right-2 text-2xl text-gray-800 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close search"
        >
          <IoMdClose />
        </button>
        <h1 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Search
        </h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring focus:ring-cyan-400 outline-none mb-4"
            aria-label="Search input"
          />
          {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>}
          {suggestions.length > 0 && (
            <ul
              className="bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700 max-h-40 overflow-y-auto mb-4"
              aria-live="polite"
              aria-label="Search suggestions"
            >
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setQuery(item);
                    setSuggestions([]);
                  }}
                  className={`cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    focusedIndex === index ? "bg-gray-200 dark:bg-gray-700" : ""
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}