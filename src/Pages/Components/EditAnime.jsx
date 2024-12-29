import React, { useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function EditAnime({ animeData, fetchAnimes, toggleCloseOfEditModel }) {
  const [formData, setFormData] = useState({
    title: animeData?.title || "",
    description: animeData?.description || "",
    thumbnail: animeData?.thumbnail || "",
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
    setLoading(true);

    try {
      const updatedData = {
        title: formData.title,
        description: formData.description,
        thumbnail: formData.thumbnail,
      };
  console.log(updatedData);
      await axios.put(`${BACKEND_URL}/${animeData._id}`, updatedData);
      console.log("Anime updated successfully!");
      fetchAnimes();
      toggleCloseOfEditModel();
    } catch (err) {
      console.log("Error updating anime:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl text-gray-900 dark:text-gray-100">
      <center>
        <div className="bg-slate-800 dark:bg-slate-50 w-36 h-2 rounded-3xl mb-6"></div>
      </center>
      <h1 className="text-4xl font-extrabold mb-8 text-center">Edit Anime</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-2"
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
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter anime description"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            rows="4"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="thumbnail"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-2"
          >
            Thumbnail
          </label>
          <input
            type="url"
            id="thumbnail"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            placeholder="Enter thumbnail URL"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        {formData.thumbnail && (
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Thumbnail Preview:
            </p>
            <img
              src={formData.thumbnail}
              alt="Thumbnail Preview"
              className="w-full h-auto rounded-lg shadow"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Anime"}
        </button>
      </form>
    </div>
  );
}