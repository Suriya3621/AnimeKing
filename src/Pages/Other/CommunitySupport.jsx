import React, { useState, useEffect } from 'react';
import { FaDiscord } from 'react-icons/fa';

function JoinDiscord() {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered) {
      // Adding animation class when hovered
      document.body.style.transition = 'all 0.3s ease-in-out';
    }
  }, [hovered]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <a
        href="https://discord.gg/3KYfrakN"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full shadow-md hover:shadow-xl transform transition duration-300 dark:from-purple-600 dark:to-indigo-700 ${hovered ? 'scale-105 animate-pulse' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <FaDiscord className="w-6 h-6" />
        Join Discord
      </a>
    </div>
  );
}

export default JoinDiscord;