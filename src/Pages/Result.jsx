import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Result() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/search?title=${keyword}`);
      const data = response.data.data; // Fetch the data
      setResults(data); // Set the results
      setLoading(false); // Update loading state
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError(true); // Update error state
      setLoading(false); // Update loading state
    }
  };

  useEffect(() => {
    if (keyword) {
      fetchResults();
    }
  }, [keyword]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Error fetching results. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-slate-50 rounded-t-3xl dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-center">Search Results for "{keyword}"</h1>
      {results.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {results.map((anime) => (
            <div
              key={anime._id}
              className="group bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1"
            >
            <Link to={`/anime/${anime._id}`}>
              <img
                src={anime.thumbnail}
                alt={`Thumbnail of ${anime.title}`}
                className="w-full h-48 object-cover group-hover:opacity-90"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold truncate dark:text-cyan-400">{anime.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                  {anime.description}
                </p>
              </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No results found for "{keyword}".
        </p>
      )}
    </div>
  );
}