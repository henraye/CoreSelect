import { useState, useEffect } from "react";
import { usePCStore } from "../store";
import { uri } from "../App";

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
  const { 
    budget, 
    priorities,
    wantToPlayGames,
    currentlyPlayingGames 
  } = usePCStore();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchRecommendation = async () => {
      try {
        setLoading(true);
        setError("");
        
        console.log("Sending request with data:", {
          budget,
          priorities,
          wantToPlayGames,
          currentlyPlayingGames
        });

        const response = await fetch(`${uri}/recommend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            budget,
            priorities,
            wantToPlayGames,
            currentlyPlayingGames
          }),
          signal: abortController.signal,
        });

        console.log("Response status:", response.status);
        const responseText = await response.text();
        console.log("Raw response:", responseText);

        if (!response.ok) {
          throw new Error(`Failed to get recommendation: ${responseText}`);
        }

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error("Failed to parse JSON:", e);
          throw new Error("Invalid response format from server");
        }

        if (!abortController.signal.aborted) {
          if (data.error) {
            throw new Error(data.error);
          }
          console.log("Setting recommendation:", data);
          setRecommendation(data);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          const errorMessage = err instanceof Error ? err.message : "An error occurred";
          console.error("Recommendation error:", errorMessage);
          setError(errorMessage);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (budget > 0) {
      fetchRecommendation();
    } else {
      setError("Please set a budget first");
      setLoading(false);
    }

    return () => {
      abortController.abort();
    };
  }, [budget, priorities, wantToPlayGames, currentlyPlayingGames]);

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your PC Build Recommendation</h2>
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your PC Build Recommendation</h2>
      {loading && (
        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg">
          <p>Getting your recommendation...</p>
        </div>
      )}
      {recommendation && !loading && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <h3 className="text-xl font-semibold">Recommended Build</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>CPU:</strong> {recommendation.cpu}</p>
              <p><strong>Motherboard:</strong> {recommendation.motherboard}</p>
              <p><strong>Memory:</strong> {recommendation.memory}</p>
              <p><strong>Storage:</strong> {recommendation.storage}</p>
              <p><strong>GPU:</strong> {recommendation.gpu}</p>
            </div>
            <div>
              <p><strong>Case:</strong> {recommendation.case}</p>
              <p><strong>CPU Cooler:</strong> {recommendation.cpu_cooler}</p>
              <p><strong>Case Fans:</strong> {recommendation.case_fans}</p>
              <p><strong>Power Supply:</strong> {recommendation.psu}</p>
              <p><strong>Total Cost:</strong> ${recommendation.total_cost}</p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold">Explanation</h4>
            <p className="whitespace-pre-line">{recommendation.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
