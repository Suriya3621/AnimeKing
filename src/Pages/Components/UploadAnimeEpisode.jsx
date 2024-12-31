import React, { useState } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function UploadAnimeEpisode({ toggleUploadModel, id, notifyError, notifySuccess, fetchAnime }) {
  const [uploadType, setUploadType] = useState("url"); // 'url' or 'file'
  const [season, setSeason] = useState("");
  const [episode, setEpisode] = useState("");
  const [episodeUrl, setEpisodeUrl] = useState("");
  const [episodeFile, setEpisodeFile] = useState(null);

  // Function to handle the episode upload
  const uploadEpisode = async () => {
    if (isValidInput()) {
      try {
        const episodeData = await prepareEpisodeData();
        await sendToServer(episodeData);
        notifySuccess();
        fetchAnime()
        toggleUploadModel();
      } catch (error) {
        console.log("Error uploading episode", error);
        notifyError();
      }
    }
  };

  // Validate inputs
  const isValidInput = () => {
    if (!season || !episode || (uploadType === "url" && !episodeUrl) || (uploadType === "file" && !episodeFile)) {
      notifyError();
      return false;
    }
    return true;
  };

  // Prepare episode data for submission
  const prepareEpisodeData = async () => {
    let episodeData = {};
    if (uploadType === "url") {
      episodeData[episode] = episodeUrl; // Store URL under the episode key
    } else {
      const fileUrl = await uploadToFirebase(episodeFile); // Assuming you upload to Firebase
      episodeData[episode] = fileUrl; // Store the Firebase URL
    }
    return {
      season: `Season${season}`,
      episodes: episodeData,
    };
  };

  // Function to upload the file to Firebase (dummy function, implement your own)
  const uploadToFirebase = async (file) => {
    // Replace this with your Firebase upload logic
    return "https://firebase.url/to/your/file.mp4"; // Placeholder URL
  };

  // Send data to backend
  const sendToServer = async (data) => {
    await axios.post(`${BACKEND_URL}/${id}/episode`, data);
  };

  return (
    <div className="fixed text-slate-950 dark:text-slate-50 flex top-0 left-0 z-50 w-full min-h-screen bg-slate-950 bg-opacity-75">
      <div className="flex justify-center items-center w-full">
        <div className="bg-slate-50 dark:bg-slate-700 p-8 rounded-lg shadow-lg w-[90%] max-w-lg">
          <h2 className="text-2xl font-bold mb-6">Upload Anime Episode</h2>

          {/* Season and Episode Inputs */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Season</label>
            <input
              type="number"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-transparent dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter season number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Episode</label>
            <input
              type="number"
              value={episode}
              onChange={(e) => setEpisode(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-transparent dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter episode number"
            />
          </div>

          {/* Upload Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Upload Type</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setUploadType("url")}
                className={`px-4 py-2 rounded-md border ${
                  uploadType === "url" ? "bg-blue-500 text-white" : "bg-transparent border-gray-300 dark:border-slate-600"
                }`}
              >
                URL
              </button>
              <button
                onClick={() => setUploadType("file")}
                className={`px-4 py-2 rounded-md border ${
                  uploadType === "file" ? "bg-blue-500 text-white" : "bg-transparent border-gray-300 dark:border-slate-600"
                }`}
              >
                File
              </button>
            </div>
          </div>

          {/* Conditional Input */}
          {uploadType === "url" ? (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Episode URL</label>
              <input
                type="url"
                value={episodeUrl}
                onChange={(e) => setEpisodeUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-transparent dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter episode URL"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Episode File</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setEpisodeFile(e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded-md bg-transparent dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Submit and Close Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={toggleUploadModel}
              className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
            <button
              onClick={uploadEpisode}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Upload Episode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}