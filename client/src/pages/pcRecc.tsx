import { usePCStore } from "../store";

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
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your PC Build Recommendation</h2>
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg">
          <p>No recommendation found. Please go back and generate one.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your PC Build Recommendation</h2>
      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <h3 className="text-xl font-semibold">Recommended Build</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>CPU:</strong> {recommendation.cpu}</p>
            <p><strong>Motherboard:</strong> {recommendation.motherboard}</p>
            <p><strong>Memory:</strong> {recommendation.memory}</p>
            <p><strong>Storage:</strong> {recommendation.storage}</p>
          </div>
          <div>
            <p><strong>GPU:</strong> {recommendation.gpu}</p>
            <p><strong>Case:</strong> {recommendation.case}</p>
            <p><strong>CPU Cooler:</strong> {recommendation.cpu_cooler}</p>
            <p><strong>Case Fans:</strong> {recommendation.case_fans}</p>
            <p><strong>PSU:</strong> {recommendation.psu}</p>
          </div>
        </div>
        <div>
          <p><strong>Total Cost:</strong> ${recommendation.total_cost}</p>
          <p><strong>Explanation:</strong> {recommendation.explanation}</p>
        </div>
      </div>
    </div>
  );
}
