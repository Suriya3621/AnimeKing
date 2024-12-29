import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import CreateAnime from "./Components/CreateAnime";
import EditAnime from "./Components/EditAnime";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const [animes, setAnimes] = useState([]);
  const [error, setError] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [createModel, setCreateModel] = useState(false);
  const [editModel, setEditModel] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState(null); // Store the anime to edit

  const fetchAnimes = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}`);
      setAnimes(response.data.data);
    } catch (error) {
      console.error("Error fetching animes:", error);
      setError(true);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this anime?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`${BACKEND_URL}/${id}`);
      setAnimes(animes.filter((anime) => anime._id !== id));
      alert("Anime deleted successfully!");
    } catch (error) {
      console.error("Error deleting anime:", error);
      alert("Failed to delete anime. Please try again.");
    }
  };

  const toggleCloseOfEditModel = () => {
    setEditModel(!editModel);
  };

  const toggleCloseOfCreateModel = () => {
    setCreateModel(!createModel);
  };

  const handleEdit = (anime) => {
    setSelectedAnime(anime); // Set the selected anime for editing
    setEditModel(true); // Open the edit modal
  };

  useEffect(() => {
    const storage = sessionStorage.getItem("admin");
    setAdmin(storage || false);
    fetchAnimes();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-center">
        <h1 className="text-4xl font-bold text-red-500 dark:text-red-400 mb-4">Error</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Failed to load animes. Please try again later.
        </p>
        <button
          onClick={fetchAnimes}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-500 text-white font-semibold rounded-lg transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-slate-50 dark:bg-slate-900 rounded-t-3xl text-gray-900 dark:text-gray-100">
      <center>
        <div className="bg-slate-800 dark:bg-slate-50 w-36 h-2 rounded-3xl mb-6"></div>
      </center>
      <h1 className="text-4xl font-extrabold mb-8 text-center">Anime Collection</h1>
      <center>
        {admin && (
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setCreateModel(!createModel)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg transition"
            >
              Create an Anime
            </button>
          </div>
        )}
      </center>

      {/* Create Anime Modal */}
      {createModel && (
        <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-lg rounded-lg shadow-lg">
            <button
              onClick={() => setCreateModel(false)}
              aria-label="Close Modal"
              className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-red-500 focus:outline-none"
            >
              <span className="text-2xl">&times;</span>
            </button>
            <CreateAnime
              fetchAnimes={fetchAnimes}
              toggleCloseOfCreateModel={toggleCloseOfCreateModel}
            />
          </div>
        </div>
      )}

      {/* Edit Anime Modal */}
      {editModel && (
        <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-lg rounded-lg shadow-lg">
            <button
              onClick={() => setEditModel(false)}
              aria-label="Close Modal"
              className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-red-500 focus:outline-none"
            >
              <span className="text-5xl ">&times;</span>
            </button>
            <EditAnime
              animeData={selectedAnime} // Pass the selected anime data
              fetchAnimes={fetchAnimes}
              toggleCloseOfEditModel={toggleCloseOfEditModel}
            />
          </div>
        </div>
      )}

      {/* Anime Cards */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {animes.length > 0 ? (
          animes.map((anime) => (
            <div
              key={anime._id}
              className="group bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-black rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1"
            >
              <Link to={`/anime/${anime._id}`}>
                <img
                  src={anime.thumbnail}
                  alt={`Thumbnail of ${anime.title}`}
                  className="w-full h-48 object-cover group-hover:opacity-90"
                />
              </Link>
              <div className="p-4">
                <h2 className="text-lg font-bold truncate dark:text-cyan-400">
                  {anime.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                  {anime.description}
                </p>
                {admin && (
                  <div className="flex justify-between items-center gap-4 mt-4">
                    <button
                      onClick={() => handleDelete(anime._id)}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 text-2xl"
                      title="Delete"
                    >
                      <MdDeleteOutline />
                    </button>
                    <button
                      onClick={() => handleEdit(anime)}
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 text-xl"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg shadow-lg"
            >
              <div className="bg-gray-200 dark:bg-gray-600 h-48 w-full rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="bg-gray-200 dark:bg-gray-600 h-4 w-3/4 rounded"></div>
                <div className="bg-gray-200 dark:bg-gray-600 h-4 w-1/2 rounded"></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}