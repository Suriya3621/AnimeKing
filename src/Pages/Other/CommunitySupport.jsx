import React, { useState } from "react";

export default function CommunitySupportPage() {
  const [dcUsername, setDcUsername] = useState("");

  const handleJoin = () => {
    if (dcUsername.trim()) {
      alert(`Welcome, ${dcUsername}! Check your Discord for the invite.`);
      setDcUsername(""); // Clear input after submission
    } else {
      alert("Please enter your Discord username.");
    }
  };

  return (
    <div className="min-h-screen rounded-t-3xl flex items-center justify-center bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Join Our Community</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Discord Username</label>
          <input
            type="text"
            value={dcUsername}
            onChange={(e) => setDcUsername(e.target.value)}
            placeholder="e.g., User#1234"
            className="w-full p-2 border rounded-md bg-transparent dark:border-slate-600 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleJoin}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Join
        </button>
      </div>
    </div>
  );
}