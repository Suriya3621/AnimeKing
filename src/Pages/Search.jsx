import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
export default function Search({ toggleSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", query);
    // Trigger the search functionality here.
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <button
          onClick={toggleSearch}
          className="absolute top-4  text-5xl right-4 text-gray-800 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <IoMdClose />
        </button>
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 text-center">
          Search
        </h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring focus:ring-cyan-400 outline-none mb-4"
          />
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