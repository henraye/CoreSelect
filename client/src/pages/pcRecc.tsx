import { usePCStore } from "../store";
import { motion } from "framer-motion";

interface RecommendationResponse {
  motherboard: string;
  cpu: string;
  memory: string;
  storage: string;
  gpu: string;
  case: string;
  cpu_cooler: string;
  case_fans: string;
  psu: string;
  total_cost: number;
  explanation: string;
}

export default function PCRecommendation() {
  const { recommendation } = usePCStore() as { recommendation: RecommendationResponse | null };

  if (!recommendation) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Your PC Build Recommendation
        </h2>
        <div className="p-6 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl">
          <p>No recommendation found. Please go back and generate one.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Your Perfect PC Build
      </h2>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6">
          <h3 className="text-xl font-semibold text-white">Recommended Components</h3>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Components Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(recommendation).map(([key, value]) => {
              if (key !== 'explanation' && key !== 'total_cost') {
                return (
                  <motion.div 
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 p-4 rounded-xl"
                  >
                    <p className="text-sm text-gray-500 uppercase">{key.replace(/_/g, ' ')}</p>
                    <p className="text-base font-medium">{value}</p>
                  </motion.div>
                );
              }
              return null;
            })}
          </div>

          {/* Total Cost */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 p-6 rounded-xl"
          >
            <div className="flex justify-between items-center">
              <p className="text-blue-700 font-semibold">Total Cost</p>
              <p className="text-2xl font-bold text-blue-700">
                ${recommendation.total_cost}
              </p>
            </div>
          </motion.div>

          {/* Explanation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 p-6 rounded-xl"
          >
            <h4 className="font-semibold text-gray-900 mb-2">Why this build?</h4>
            <p className="text-gray-600 leading-relaxed">
              {recommendation.explanation}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}