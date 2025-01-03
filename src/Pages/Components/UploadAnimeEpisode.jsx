import React, { useState } from "react";
import { storage } from "../../App/Firebase.js";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function UploadAnimeEpisode({ toggleUploadModel, id, notifyError, notifySuccess, fetchAnime }) {
  const [uploadType, setUploadType] = useState("url");
  const [season, setSeason] = useState("");
  const [episode, setEpisode] = useState("");
  const [episodeUrl, setEpisodeUrl] = useState("");
  const [episodeFile, setEpisodeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const uploadEpisode = async () => {
    if (isValidInput()) {
      setUploading(true); // Start uploading
      try {
        const episodeData = await prepareEpisodeData();
        await sendToServer(episodeData);
        notifySuccess("Episode uploaded successfully!");
        fetchAnime();
        toggleUploadModel();
      } catch (error) {
        console.error("Error uploading episode", error);
        notifyError("Failed to upload episode.");
      } finally {
        setUploading(false); // Stop uploading
      }
    }
  };

  const isValidInput = () => {
    if (!season || !episode || (uploadType === "url" && !episodeUrl) || (uploadType === "file" && !episodeFile)) {
      notifyError("All fields are required.");
      return false;
    }
    return true;
  };

  const prepareEpisodeData = async () => {
    let episodeData = {};
    if (uploadType === "url") {
      episodeData[episode] = episodeUrl;
    } else {
      const fileUrl = await uploadToFirebase(episodeFile);
      episodeData[episode] = fileUrl;
    }
    return {
      season: `Season${season}`,
      episodes: episodeData,
    };
  };

  const uploadToFirebase = async (file) => {
    try {
      const fileRef = ref(storage, `${file.name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
      return fileUrl;
    } catch (error) {
      console.error("Error uploading file to Firebase:", error);
      throw error;
    }
  };

  const sendToServer = async (data) => {
    await axios.post(`${BACKEND_URL}/${id}/season`, data);
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

          {/* Uploading Animation */}
          {uploading && <div className="text-center text-blue-500 font-semibold mb-4">Uploading...</div>}

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
              disabled={uploading}
              className={`px-6 py-2 font-semibold rounded-md focus:outline-none focus:ring-2 ${
                uploading ? "bg-gray-400 text-gray-700" : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
              }`}
            >
              {uploading ? "Uploading..." : "Upload Episode"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}