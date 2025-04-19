import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePCStore } from "../store";
import { uri } from "../App";

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
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Review Your Selections</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Budget</h2>
          <p className="text-lg">${budget}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Your Priorities</h2>
          <ol className="list-decimal list-inside space-y-1">
            {priorities.map((priority, index) => (
              <li key={index} className="text-lg">{priority}</li>
            ))}
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Gaming Preferences</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-1">Games You Want to Play</h3>
              <ol className="list-decimal list-inside space-y-1">
                {wantToPlayGames.map((game, index) => (
                  <li key={index}>{game}</li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-1">Games You Currently Play</h3>
              <ol className="list-decimal list-inside space-y-1">
                {currentlyPlayingGames.map((game, index) => (
                  <li key={index}>{game}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={handleGetRecommendation}
        disabled={loading}
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
      </button>
    </div>
  );
}
