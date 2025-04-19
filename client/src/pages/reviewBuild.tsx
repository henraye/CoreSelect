import { useState } from "react";
import { useNavigate } from "react-router";
import { usePCStore } from "../store";
import { uri } from "../App";

interface RecommendationResponse {
  recommendation: string;
}

export default function ReviewBuild() {
  const navigate = useNavigate();
  const { 
    budget, 
    priorities, 
    wantToPlayGames,
    currentlyPlayingGames,
    markStepCompleted 
  } = usePCStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const hasGamingPreferences = priorities.slice(0, 3).includes("Gaming Performance");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${uri}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          budget,
          priorities,
          gaming_preferences: hasGamingPreferences ? {
            want_to_play: wantToPlayGames,
            currently_playing: currentlyPlayingGames
          } : undefined
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendation");
      }

      const data: RecommendationResponse = await response.json();
      markStepCompleted(3);
      navigate('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review Your Selections</h2>
      
      {/* Budget Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Budget</h3>
        <p className="p-3 bg-gray-50 rounded-lg">${budget}</p>
      </div>

      {/* Priorities Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Your Priorities</h3>
        <div className="space-y-2">
          {priorities.map((priority, index) => (
            <div key={priority} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-500">{index + 1}.</span>
              <span>{priority}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gaming Preferences Section - Only show if gaming is a priority */}
      {hasGamingPreferences && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Gaming Preferences</h3>
          
          {/* Games Want to Play */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Games You Want to Play</h4>
            <div className="space-y-2">
              {wantToPlayGames.map((game, index) => (
                <div key={game} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500">{index + 1}.</span>
                  <span>{game}</span>
                </div>
              ))}
              {wantToPlayGames.length === 0 && (
                <p className="text-gray-500 italic">No games selected</p>
              )}
            </div>
          </div>

          {/* Currently Playing Games */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Games You Currently Play</h4>
            <div className="space-y-2">
              {currentlyPlayingGames.map((game, index) => (
                <div key={game} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500">{index + 1}.</span>
                  <span>{game}</span>
                </div>
              ))}
              {currentlyPlayingGames.length === 0 && (
                <p className="text-gray-500 italic">No games selected</p>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 text-red-500 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 w-full"
      >
        {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
      </button>
    </div>
  );
}
