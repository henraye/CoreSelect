import { useState } from "react";
import { useNavigate } from "react-router";
import { usePCStore } from "../store";
import { motion, AnimatePresence } from "framer-motion";

const MAX_GAMES = 3;

export default function GamePreferences() {
  const navigate = useNavigate();
  const { 
    priorities,
    wantToPlayGames,
    setWantToPlayGames,
    currentlyPlayingGames,
    setCurrentlyPlayingGames,
    markStepCompleted
  } = usePCStore();

  const [wantToPlay, setWantToPlay] = useState<string>("");
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string>("");

  // Check if Gaming Performance is in top 3 priorities
  const isGamingPriority = priorities.slice(0, 3).includes("Gaming Performance");

  const addWantToPlay = () => {
    if (wantToPlay && wantToPlayGames.length < MAX_GAMES) {
      setWantToPlayGames([...wantToPlayGames, wantToPlay]);
      setWantToPlay("");
    }
  };

  const addCurrentlyPlaying = () => {
    if (currentlyPlaying && currentlyPlayingGames.length < MAX_GAMES) {
      setCurrentlyPlayingGames([...currentlyPlayingGames, currentlyPlaying]);
      setCurrentlyPlaying("");
    }
  };

  const removeWantToPlay = (game: string) => {
    setWantToPlayGames(wantToPlayGames.filter(g => g !== game));
  };

  const removeCurrentlyPlaying = (game: string) => {
    setCurrentlyPlayingGames(currentlyPlayingGames.filter(g => g !== game));
  };

  const handleNext = () => {
    markStepCompleted(3);
    navigate('/review');
  };

  if (!isGamingPriority) {
    // Skip this page if gaming is not a priority
    handleNext();
    return null;
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Gaming Preferences
        </h2>
        <p className="text-lg text-gray-600">Since gaming is one of your top priorities, let us know about your gaming habits</p>
      </motion.div>

      {/* Games Want to Play Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="text-xl font-semibold">Games You Want to Play</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={wantToPlay}
            onChange={(e) => setWantToPlay(e.target.value)}
            placeholder="Enter a game title"
            className="flex-1 p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={wantToPlayGames.length >= MAX_GAMES}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addWantToPlay}
            disabled={!wantToPlay || wantToPlayGames.length >= MAX_GAMES}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600"
          >
            Add
          </motion.button>
        </div>
        <AnimatePresence>
          {wantToPlayGames.map((game, index) => (
            <motion.div
              key={game}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
            >
              <span className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 text-sm">
                {index + 1}
              </span>
              <span className="text-base">{game}</span>
              <button
                onClick={() => removeWantToPlay(game)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Currently Playing Games Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="text-xl font-semibold">Games You Currently Play</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={currentlyPlaying}
            onChange={(e) => setCurrentlyPlaying(e.target.value)}
            placeholder="Enter a game title"
            className="flex-1 p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={currentlyPlayingGames.length >= MAX_GAMES}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addCurrentlyPlaying}
            disabled={!currentlyPlaying || currentlyPlayingGames.length >= MAX_GAMES}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600"
          >
            Add
          </motion.button>
        </div>
        <AnimatePresence>
          {currentlyPlayingGames.map((game, index) => (
            <motion.div
              key={game}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
            >
              <span className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 text-sm">
                {index + 1}
              </span>
              <span className="text-base">{game}</span>
              <button
                onClick={() => removeCurrentlyPlaying(game)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleNext}
        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:bg-blue-600 transition-all"
      >
        Next
      </motion.button>
    </div>
  );
} 