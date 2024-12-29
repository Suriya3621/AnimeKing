import React, { useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function CreateAnime({ fetchAnimes, toggleCloseOfCreateModel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Title and description cannot be empty.");
      return;
    }


    setLoading(true);
    try {
      const animeData = {
        title: formData.title,
        description: formData.description,
        thumbnail: formData.thumbnail,
      };

      await axios.post(`${BACKEND_URL}`, animeData);
      setFormData({ title: "", description: "", thumbnail: "" });
      toggleCloseOfCreateModel();
      fetchAnimes();
    } catch (err) {
      console.error("Error creating anime:", err);
      alert("Failed to create anime. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-opacity-75">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Create New Anime
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter anime title"
              className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter anime description"
              className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Thumbnail */}
          <div className="mb-4">
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Thumbnail URL
            </label>
            <input
              type="url"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="Enter thumbnail URL"
              className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          {/* Thumbnail Preview */}
          {formData.thumbnail && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thumbnail Preview:
              </p>
              <img
                src={formData.thumbnail}
                alt="Thumbnail Preview"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="py-2 px-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-md transition"
              onClick={toggleCloseOfCreateModel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Anime"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}