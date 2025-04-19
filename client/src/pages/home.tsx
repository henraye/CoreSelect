import { useState } from "react";

export default function Home() {
  const [budget, setBudget] = useState(2000);

  const handleBuild = () => {
    if (budget < 300) {
      alert("Please enter a budget of at least $300.");
      return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 to-gray-800 px-4">
      <div className="bg-gray-900 shadow-2xl rounded-2xl p-8 max-w-md w-full text-white">
        <h1 className="text-3xl font-bold mb-2 text-center">The PC Builder</h1>
        <p className="text-gray-400 mb-6 text-center">Enter your budget. Get a PC.</p>

        <div className="flex items-center bg-gray-800 rounded-lg px-4 py-2 mb-4 focus-within:ring-2 focus-within:ring-indigo-500">
          <span className="text-gray-400 mr-2">$</span>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value))}
            className="bg-transparent outline-none w-full text-white placeholder-gray-500"
            placeholder="Enter your budget"
            min="300"
          />
        </div>

        <input
          type="range"
          min="300"
          max="5000"
          step="100"
          value={budget}
          onChange={(e) => setBudget(parseInt(e.target.value))}
          className="w-full mb-4 accent-indigo-500"
        />
        <p className="text-sm text-center text-gray-400 mb-4">Current budget: ${budget}</p>

        <button
          onClick={handleBuild}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Build!
        </button>
      </div>
    </div>
  );
}
