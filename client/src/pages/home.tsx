import { useState } from "react";
import { useNavigate } from "react-router";
import { usePCStore } from "../store";

interface RecommendationResponse {
  recommendation: string;
}

export default function Home() {
  const navigate = useNavigate();
  const { setBudget, markStepCompleted } = usePCStore();
  const [budget, setLocalBudget] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleNext = () => {
    if (budget) {
      setBudget(Number(budget));
      markStepCompleted(1);
      navigate('/priorities');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Set Your Budget</h2>
      <p className="text-gray-600">How much would you like to spend on your PC build?</p>
      <div>
        <input
          type="number"
          value={budget}
          onChange={(e) => setLocalBudget(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your budget in USD"
          required
          min="0"
        />
      </div>
      <button
        onClick={handleNext}
        disabled={!budget}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        Next
      </button>

      <input
        type="range"
        min="300"
        max="5000"
        step="100"
        value={budget}
        onChange={(e) => setLocalBudget(e.target.value)}
        className="w-full mb-4 accent-indigo-500"
      />
      <p className="text-sm text-center text-gray-400 mb-4">Current budget: ${budget}</p>
    </div>
  );
}
