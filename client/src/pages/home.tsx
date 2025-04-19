import { useState } from "react";
import { useNavigate } from "react-router";
import { usePCStore } from "../store";
import { motion } from "framer-motion";

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Set Your Budget
        </h2>
        <p className="text-lg text-gray-600">
          How much would you like to spend on your PC build?
        </p>
      </motion.div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <input
            type="number"
            value={budget}
            onChange={(e) => setLocalBudget(e.target.value)}
            className="w-full p-3 text-base border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Enter your budget in USD"
            required
            min="0"
          />

          <div className="space-y-2">
            <input
              type="range"
              min="600"
              max="5000"
              step="100"
              value={budget}
              onChange={(e) => setLocalBudget(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span className="text-sm text-gray-500">$600</span>
              <span className="text-sm text-gray-500">$5000</span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-600 font-medium">Selected Budget</p>
            <p className="text-2xl font-bold text-blue-700">${budget || 0}</p>
          </div>
        </motion.div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleNext}
        disabled={!budget}
        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg 
                 disabled:opacity-50 hover:bg-blue-600 transition-all"
      >
        Next
      </motion.button>
    </div>
  );
}
