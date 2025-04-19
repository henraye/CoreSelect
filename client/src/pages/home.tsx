import { useState } from "react";
import { uri } from "../App";
import Sidebar from "../components/Sidebar";

interface RecommendationResponse {
  recommendation: string;
}

function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [budget, setBudget] = useState<string>("");
  const [cpuPreference, setCpuPreference] = useState<string>("");
  const [gpuPreference, setGpuPreference] = useState<string>("");
  const [recommendation, setRecommendation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setRecommendation("");

    try {
      const response = await fetch(`${uri}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          budget,
          cpu_preference: cpuPreference,
          gpu_preference: gpuPreference,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendation");
      }

      const data: RecommendationResponse = await response.json();
      setRecommendation(data.recommendation);
      setCurrentStep(5); // Move to results step
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
    if (currentStep === 4) {
      handleSubmit();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Set Your Budget</h2>
            <p className="text-gray-600">How much would you like to spend on your PC build?</p>
            <div>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">CPU Preference</h2>
            <p className="text-gray-600">Select your preferred CPU manufacturer</p>
            <div className="space-y-2">
              <select
                value={cpuPreference}
                onChange={(e) => setCpuPreference(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select CPU Preference</option>
                <option value="AMD">AMD</option>
                <option value="Intel">Intel</option>
                <option value="No Preference">No Preference</option>
              </select>
            </div>
            <button
              onClick={handleNext}
              disabled={!cpuPreference}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">GPU Preference</h2>
            <p className="text-gray-600">Select your preferred GPU manufacturer</p>
            <div className="space-y-2">
              <select
                value={gpuPreference}
                onChange={(e) => setGpuPreference(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select GPU Preference</option>
                <option value="AMD">AMD</option>
                <option value="NVIDIA">NVIDIA</option>
                <option value="Intel">Intel</option>
                <option value="No Preference">No Preference</option>
              </select>
            </div>
            <button
              onClick={handleNext}
              disabled={!gpuPreference}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Review Your Selections</h2>
            <div className="space-y-2">
              <p><strong>Budget:</strong> ${budget}</p>
              <p><strong>CPU Preference:</strong> {cpuPreference}</p>
              <p><strong>GPU Preference:</strong> {gpuPreference}</p>
            </div>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Get Recommendation
            </button>
          </div>
        );

      case 5:
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

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar currentStep={currentStep} onStepChange={setCurrentStep} />
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}

export default Home;
