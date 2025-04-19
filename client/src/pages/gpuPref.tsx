import { useState } from "react";
import { useNavigate } from "react-router";
import { usePCStore } from "../store";

export default function GPUPref() {
  const navigate = useNavigate();
  const { markStepCompleted } = usePCStore();
  const [selectedPreference, setSelectedPreference] = useState<string>("");

  const handleNext = () => {
    if (selectedPreference) {
      markStepCompleted(3);
      navigate('/review');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">GPU Preference</h2>
      <p className="text-gray-600">Select your preferred GPU manufacturer</p>
      <div className="space-y-2">
        <select
          value={selectedPreference}
          onChange={(e) => setSelectedPreference(e.target.value)}
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
        disabled={!selectedPreference}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
