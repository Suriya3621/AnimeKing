import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import UploadAnimeEpisode from "./Components/UploadAnimeEpisode";
import "react-toastify/dist/ReactToastify.css";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../App/Firebase.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ViewAnimePage({ toggleHome }) {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [uploadModel, setUploadModel] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSeason, setExpandedSeason] = useState(null);
  const [admin, setAdmin] = useState(false);

  const notifyError = () => toast.error("Can't upload an episode.");
  const notifySuccess = () => toast.success("Successfully uploaded episode.");

  useEffect(() => {
    toggleHome();
    const storage = sessionStorage.getItem("admin");
    setAdmin(storage || false);
  }, []);

  const fetchAnime = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/${id}`);
      setAnime(response.data.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load anime details.");
      setAnime(null);
    }
  };

  useEffect(() => {
    fetchAnime();
  }, [id]);

  const toggleUploadModel = () => setUploadModel(!uploadModel);

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

  if (!anime) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

const deleteEpisode = async (season, episodeKey,file) => {
  try {
   const fileRef = ref(storage, file);
   await axios.delete(`${BACKEND_URL}/${id}/episode`, {
      data: { season, episodeKey },
    });
   await deleteObject(fileRef);
  
    fetchAnime(); // Refresh the anime data after deletion
  } catch (error) {
    console.error("Error deleting episode:", error);
  }
};
  return (
    <div className="p-4 z-20 bg-gray-100 dark:bg-gray-900 text-slate-950 dark:text-slate-50 min-h-screen">
      {uploadModel && (
        <UploadAnimeEpisode
          fetchAnime={fetchAnime}
          id={id}
          notifyError={notifyError}
          notifySuccess={notifySuccess}
          toggleUploadModel={toggleUploadModel}
        />
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <h1 className="text-3xl font-mono font-bold mb-4">{anime.title}</h1>
      <img
        src={anime.thumbnail}
        alt={anime.title || "Anime Thumbnail"}
        className="w-full max-w-lg mx-auto rounded-lg mb-4 object-cover sm:w-1/2"
      />
      <p className="text-gray-400 text-lg mb-8">
        {anime.description || "No description available."}
      </p>

      <div className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-4">Seasons</h2>
          {admin && (
            <button
              onClick={toggleUploadModel}
              className="text-sm bg-slate-300 dark:bg-slate-400 border p-2 font-bold rounded-3xl shadow text-blue-500 dark:text-blue-700"
            >
              Upload Episode
            </button>
          )}
        </div>

        <div className="flex overflow-x-auto gap-4 season-scroll">
          {anime.video && typeof anime.video === "object" && Object.keys(anime.video).length > 0 ? (
            Object.keys(anime.video).map((season) => (
              <button
                key={season}
                onClick={() =>
                  setExpandedSeason(expandedSeason === season ? null : season)
                }
                className={`season-button text-white bg-gray-700 dark:bg-gray-600 px-6 py-2 rounded-md shadow hover:bg-blue-600 dark:hover:bg-blue-500 transition ${
                  expandedSeason === season ? "bg-blue-600 dark:bg-blue-500" : ""
                }`}
              >
                {season}
              </button>
            ))
          ) : (
            <p className="text-gray-500">No seasons available.</p>
          )}
        </div>

        {expandedSeason && anime.video[expandedSeason] && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Episodes - {expandedSeason}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Object.keys(anime.video[expandedSeason]).map((episode, index) => (
                <div
                  key={index}
                  className="flex justify-between text-center text-slate-50 font-black dark:text-blue-400 bg-gray-900 dark:bg-gray-800 px-4 py-2 rounded-md shadow hover:bg-gray-700 dark:hover:bg-gray-700 transition"
                >
                <Link to={`/anime/episode/v?id=${anime._id}&season=${expandedSeason}&episode=${episode}`}>
                  Episode-{episode}
                </Link>
{admin && (
  <button onClick={() => deleteEpisode(expandedSeason, episode,anime.video[expandedSeason][episode])}>
    <MdDeleteOutline className="text-2xl text-red-700" />
  </button>
)}
</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}