import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { usePCStore } from "../store";

const availablePriorities = [
  "Gaming Performance",
  "Video Editing",
  "3D Rendering",
  "Programming",
  "General Use",
  "Streaming",
  "Content Creation",
  "Machine Learning"
];

export default function Priorities() {
  const navigate = useNavigate();
  const { priorities, setPriorities, markStepCompleted } = usePCStore();
  const [wordBank, setWordBank] = useState<string[]>([]);

  // Initialize word bank with priorities not yet selected
  useEffect(() => {
    setWordBank(availablePriorities.filter(p => !priorities.includes(p)));
  }, [priorities]);

  const handleDragStart = (e: React.DragEvent, priority: string) => {
    e.dataTransfer.setData("text/plain", priority);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const priority = e.dataTransfer.getData("text/plain");
    
    if (!priorities.includes(priority)) {
      setPriorities([...priorities, priority]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removePriority = (priority: string) => {
    setPriorities(priorities.filter(p => p !== priority));
  };

  const handleNext = () => {
    if (priorities.length > 0) {
      markStepCompleted(2);
      navigate('/review');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Select Your Priorities</h2>
      <p className="text-gray-600">Drag and drop your priorities in order of importance</p>
      
      {/* Word Bank */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Available Priorities</h3>
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg min-h-[100px]">
          {wordBank.map((priority) => (
            <div
              key={priority}
              draggable
              onDragStart={(e) => handleDragStart(e, priority)}
              className="px-3 py-2 bg-white border rounded-lg cursor-move hover:bg-gray-100"
            >
              {priority}
            </div>
          ))}
        </div>
      </div>

      {/* Drop Zone */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Your Priorities (in order)</h3>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="p-4 bg-gray-50 rounded-lg min-h-[200px] space-y-2"
        >
          {priorities.map((priority, index) => (
            <div
              key={priority}
              className="flex items-center gap-2 p-2 bg-white border rounded-lg"
            >
              <span className="text-gray-500">{index + 1}.</span>
              <span className="flex-1">{priority}</span>
              <button
                onClick={() => removePriority(priority)}
                className="p-1 text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
          {priorities.length === 0 && (
            <p className="text-gray-400 text-center">Drag priorities here</p>
          )}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={priorities.length === 0}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
} 