import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../App/Socket";

export default function Dashboard() {
  const navigate = useNavigate();
  const [visitorCount, setVisitorCount] = useState(0);
  const socket = useSocket();

  useEffect(() => {
    const admin = sessionStorage.getItem("admin");
    if (!admin) {
      navigate("/admin-panel/login");
    }

    // Listen for visitor count updates from the server
    if (socket) {
      socket.on("visitorCount", (count) => {
        setVisitorCount(count);
      });
    }

    // Cleanup on unmount
    return () => {
      if (socket) socket.off("visitorCount");
    };
  }, [navigate, socket]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center p-6">
      <header className="w-full bg-blue-600 dark:bg-gray-800 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            className="bg-white dark:bg-gray-700 dark:text-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-gray-600 transition"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, Admin</h2>
        <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-700 rounded shadow">
          <h3 className="text-lg font-bold text-green-600 dark:text-blue-400">
            Online User Count
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Number of users currently Online: <span className="font-bold">{visitorCount}</span>
          </p>
        </div>
      </main>
    </div>
  );
}