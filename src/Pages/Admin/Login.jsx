import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineClear, AiOutlineArrowLeft } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const correctPin = import.meta.env.VITE_ADMINPASS || "12345"; // Fallback for dev

  const notifyError = () => toast.error("Incorrect PIN. Please try again.");

  const handleButtonClick = (value) => {
    if (input.length < 5) {
      setInput((prev) => prev + value);
    }
  };

  const handleClear = () => setInput("");

  const handleBackspace = () => setInput((prev) => prev.slice(0, -1));

  const handleSubmit = () => {
    if (input === correctPin) {
      sessionStorage.setItem("admin", true);
      navigate(`/admin-panel/dashboard`);
    } else {
      notifyError();
      setInput("");
    }
  };

  return (
    <div className="flex items-center justify-center mt-3 rounded-3xl bg-gradient-to-br dark:from-gray-900 from-gray-200 dark:via-gray-800 via-gray-100 dark:to-gray-900 to-gray-50">
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
      <div className="w-full max-w-md p-8 dark:text-slate-50 dark:bg-gray-800 bg-slate-100 text-slate-950 rounded-lg shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">Secure PIN Login</h1>
        <div className="flex justify-center mb-6">
          <input
            type="password"
            value={input}
            readOnly
            maxLength={5}
            className="w-3/4 text-center text-3xl bg-gray-200 dark:bg-gray-700 border dark:border-gray-600 border-gray-100 rounded-lg py-3 dark:text-gray-100 text-gray-900 tracking-widest focus:outline-none"
            placeholder="•••••"
          />
        </div>
        <div className="grid grid-cols-3 text-white gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0, "C"].map((item, index) => (
            <button
              key={index}
              onClick={
                item === "C"
                  ? handleClear
                  : item === "⌫"
                  ? handleBackspace
                  : () => handleButtonClick(item)
              }
              className={`w-full h-16 flex items-center justify-center text-2xl font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105 ${
                item === "C"
                  ? "bg-red-500 hover:bg-red-600"
                  : item === "⌫"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              aria-label={
                item === "C"
                  ? "Clear"
                  : item === "⌫"
                  ? "Backspace"
                  : `Enter ${item}`
              }
            >
              {item === "⌫" ? <AiOutlineArrowLeft size={30} /> : item === "C" ? <AiOutlineClear size={30} /> : item}
            </button>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md"
          >
            Submit
          </button>
        </div>

        <div className="text-center mt-8 text-sm text-gray-400">Enter your 5-digit PIN to continue.</div>
      </div>
    </div>
  );
}