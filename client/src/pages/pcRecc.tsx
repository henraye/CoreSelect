import { useState, useEffect } from "react";
import { usePCStore } from "../store";
import { uri } from "../App";

interface RecommendationResponse {
  recommendation: string;
}

export default function PCRecommendation() {
  const { budget } = usePCStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [recommendation, setRecommendation] = useState<string>("");

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await fetch(`${uri}/recommend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            budget,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get recommendation");
        }

        const data: RecommendationResponse = await response.json();
        setRecommendation(data.recommendation);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [budget]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your PC Build Recommendation</h2>
      {loading && <p>Getting your recommendation...</p>}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {recommendation && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="whitespace-pre-line">{recommendation}</p>
        </div>
      )}
    </div>
  );
}
