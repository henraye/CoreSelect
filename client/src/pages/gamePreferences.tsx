import { useState } from "react";
import { useNavigate } from "react-router";
import { usePCStore } from "../store";

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
      <h2 className="text-2xl font-bold">Gaming Preferences</h2>
      <p className="text-gray-600">Since gaming is one of your top priorities, let us know about your gaming habits</p>

      {/* Games Want to Play */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Games You Want to Play</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={wantToPlay}
            onChange={(e) => setWantToPlay(e.target.value)}
            placeholder="Enter a game title"
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={wantToPlayGames.length >= MAX_GAMES}
          />
          <button
            onClick={addWantToPlay}
            disabled={!wantToPlay || wantToPlayGames.length >= MAX_GAMES}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {wantToPlayGames.map((game, index) => (
            <div
              key={game}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
            >
              <span className="text-gray-500">{index + 1}.</span>
              <span className="flex-1">{game}</span>
              <button
                onClick={() => removeWantToPlay(game)}
                className="text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
          {wantToPlayGames.length === MAX_GAMES && (
            <p className="text-orange-500 text-sm">Maximum games reached</p>
          )}
        </div>
      </div>

      {/* Currently Playing Games */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Games You Currently Play</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={currentlyPlaying}
            onChange={(e) => setCurrentlyPlaying(e.target.value)}
            placeholder="Enter a game title"
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={currentlyPlayingGames.length >= MAX_GAMES}
          />
          <button
            onClick={addCurrentlyPlaying}
            disabled={!currentlyPlaying || currentlyPlayingGames.length >= MAX_GAMES}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {currentlyPlayingGames.map((game, index) => (
            <div
              key={game}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
            >
              <span className="text-gray-500">{index + 1}.</span>
              <span className="flex-1">{game}</span>
              <button
                onClick={() => removeCurrentlyPlaying(game)}
                className="text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
          {currentlyPlayingGames.length === MAX_GAMES && (
            <p className="text-orange-500 text-sm">Maximum games reached</p>
          )}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Next
      </button>
    </div>
  );
} 