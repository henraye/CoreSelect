import { useState } from "react";
import { useNavigate } from "react-router";
import { usePCStore } from "../store";
import { uri } from "../App";

interface RecommendationResponse {
  recommendation: string;
}

export default function ReviewBuild() {
  const navigate = useNavigate();
  const { budget, priorities, markStepCompleted } = usePCStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Review Your Selections</h2>
      <div className="space-y-4">
        <div>
          <p className="font-semibold">Budget</p>
          <p>${budget}</p>
        </div>
        <div>
          <p className="font-semibold">Your Priorities</p>
          <div className="space-y-2">
            {priorities.map((priority, index) => (
              <div key={priority} className="flex items-center gap-2">
                <span className="text-gray-500">{index + 1}.</span>
                <span>{priority}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
      </button>
    </div>
  );
}
