import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePCStore } from "../store";
import { uri } from "../App";
import { motion } from "framer-motion";

interface PCRecommendation {
  motherboard: string;
  cpu: string;
  memory: string;
  storage: string;
  gpu: string;
  case: string;
  cpuCooler: string;
  caseFans: string;
  psu: string;
}

export default function ReviewBuild() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const {
    budget,
    priorities,
    wantToPlayGames,
    currentlyPlayingGames,
    setRecommendation,
    markStepCompleted,
  } = usePCStore();

  const isGamingPriority = priorities.includes("Gaming Performance");

  const handleGetRecommendation = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${uri}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          budget,
          priorities,
          wantToPlayGames,
          currentlyPlayingGames,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendation');
      }

      const data = await response.json() as PCRecommendation;
      setRecommendation(data);
      markStepCompleted(4);
      navigate('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Review Your Selections
      </h1>

      <div className="space-y-6">
        {/* Budget Section */}
        <motion.div 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold mb-3">Budget</h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-blue-700">${budget}</p>
          </div>
        </motion.div>

        {/* Priorities Section */}
        <motion.div 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold mb-3">Your Priorities</h2>
          <div className="space-y-2">
            {priorities.map((priority, index) => (
              <div 
                key={index}
                className="p-3 bg-gray-50 rounded-lg flex items-center"
              >
                <span className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 font-medium mr-3">
                  {index + 1}
                </span>
                <span className="text-base">{priority}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Gaming Preferences Section */}
        {isGamingPriority && (
          <motion.div 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Gaming Preferences</h2>
            <div className="space-y-6">
              {/* Want to Play Games */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-700">Games You Want to Play</h3>
                <div className="space-y-2">
                  {wantToPlayGames.map((game, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      {game}
                    </div>
                  ))}
                </div>
              </div>

              {/* Currently Playing Games */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-700">Games You Currently Play</h3>
                <div className="space-y-2">
                  {currentlyPlayingGames.map((game, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      {game}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGetRecommendation}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl 
                 font-semibold shadow-md disabled:opacity-50 transition-all"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Getting Recommendation...
          </div>
        ) : (
          'Get Recommendation'
        )}
      </motion.button>
    </motion.div>
  );
}
