import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen rounded-t-3xl flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg w-[90%] max-w-2xl">
        <h1 className="text-3xl font-bold mb-4 text-center">About Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 text-center">
          Welcome to our Tamil Dubbed Anime platform! We bring you the best anime content, fully dubbed in Tamil, so you can enjoy your favorite shows in your own language.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Our mission is to make anime accessible and enjoyable for Tamil-speaking fans worldwide. Explore a wide range of genres, from action-packed adventures to heartfelt dramas, all in Tamil.
        </p>
        <div className="mt-6 flex justify-center">
          <a
            href="#"
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Start Watching
          </a>
        </div>
      </div>
    </div>
  );
}