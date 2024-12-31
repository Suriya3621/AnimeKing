import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Video = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const id = searchParams.get("id");
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");

  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVideoDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/${id}`);
      setVideoData(response.data.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load video details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-red-500">
        <span className="text-4xl mb-4">⚠️</span>
        <p className="text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-4">{videoData.title || "Episode"}</h1>
          <p className="text-lg text-gray-500">{videoData.description || "No description available."}</p>
        </div>

        {/* Video Player */}
        <div className="flex justify-center mb-8">
          <video
            className="w-full max-w-4xl rounded-lg shadow-lg"
            controls
            src={videoData.video[season][episode]}
            poster={videoData.thumbnail || ""}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Episode Listing */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Episodes - {season}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Object.keys(videoData.video[season]).map((ep, index) => (
              <Link
                to={`/anime/episode/v?id=${id}&season=${season}&episode=${ep}`}
                key={index}
                className={`flex justify-center items-center text-center bg-gray-700 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 ${
                  ep === episode ? "ring-4 ring-blue-500" : ""
                }`}
              >
                Episode {ep}
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
          >
            ⬅️ Back
          </button>
          <div className="text-sm text-gray-500">
            <p>
              <span className="font-semibold">Season:</span> {season}
            </p>
            <p>
              <span className="font-semibold">Episode:</span> {episode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;