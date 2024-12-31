import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
      console.log(err);
      setError("Failed to load video details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex items-center justify-center flex-col text-red-500 border border-red-300 rounded bg-red-50 dark:bg-red-900 dark:text-red-300 dark:border-red-600">
        <span className="text-4xl">⚠️</span>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 text-slate-950 dark:text-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{videoData.title || "Episode"}</h1>
      <p className="text-gray-400 text-lg mb-4">
        {videoData.description || "No description available."}
      </p>

      <div className="video-player-container mb-8">
        <video
          className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
          controls
          src={videoData.video[season][episode]}
          poster={videoData.thumbnail || ""}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Back
        </button>
        <p className="text-sm text-gray-500">
          Season: {season}, Episode: {episode}
        </p>
      </div>
    </div>
  );
};

export default Video;