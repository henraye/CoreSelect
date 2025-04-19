import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { usePCStore } from "../store";
import { motion } from "framer-motion";

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

const MAX_PRIORITIES = 3;

export default function Priorities() {
  const navigate = useNavigate();
  const { priorities, setPriorities, markStepCompleted } = usePCStore();
  const [wordBank, setWordBank] = useState<string[]>([]);

  // Initialize word bank with priorities not yet selected
  useEffect(() => {
    setWordBank(availablePriorities.filter(p => !priorities.includes(p)));
  }, [priorities]);

  const handleDragStart = (e: React.DragEvent, priority: string) => {
    if (priorities.length >= MAX_PRIORITIES) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", priority);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (priorities.length >= MAX_PRIORITIES) return;
    
    const priority = e.dataTransfer.getData("text/plain");
    if (!priorities.includes(priority)) {
      setPriorities([...priorities, priority]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (priorities.length >= MAX_PRIORITIES) {
      e.dataTransfer.dropEffect = "none";
    }
  };

  const removePriority = (priority: string) => {
    setPriorities(priorities.filter(p => p !== priority));
  };

  const handleNext = () => {
    if (priorities.length > 0) {
      markStepCompleted(2);
      // Check if Gaming Performance is in top 3
      if (priorities.slice(0, 3).includes("Gaming Performance")) {
        navigate('/game-preferences');
      } else {
        navigate('/review');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Select Your Priorities
        </h2>
        <p className="text-lg text-gray-600">
          Drag and drop up to {MAX_PRIORITIES} priorities in order of importance
        </p>
      </div>

      {/* Available Priorities */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Available Priorities</h3>
        <div className="flex flex-wrap gap-3 pb-2">
          {wordBank.map((priority) => (
            <div
              key={priority}
              draggable={priorities.length < MAX_PRIORITIES}
              onDragStart={(e: React.DragEvent) => handleDragStart(e, priority)}
              className={`
                px-6 py-3 rounded-lg border-2 border-gray-300 bg-white
                ${priorities.length < MAX_PRIORITIES 
                  ? 'cursor-grab hover:border-blue-500 hover:shadow-md transition-all'
                  : 'opacity-50 cursor-not-allowed'}
              `}
            >
              {priority}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Priorities */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Your Priorities (in order)</h3>
          <span className="text-sm text-gray-500">
            {priorities.length}/{MAX_PRIORITIES}
          </span>
        </div>
        <motion.div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`
            p-6 rounded-lg min-h-[200px] space-y-3 transition-all duration-200
            ${priorities.length < MAX_PRIORITIES 
              ? 'bg-gray-50 border-2 border-dashed border-gray-300' 
              : 'bg-gray-100 border-2 border-gray-200'}
          `}
        >
          {priorities.map((priority, index) => (
            <motion.div
              key={priority}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm"
            >
              <span className="text-gray-500 font-medium">{index + 1}.</span>
              <span className="flex-1">{priority}</span>
              <button
                onClick={() => removePriority(priority)}
                className="p-1 text-gray-500 hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </motion.div>
          ))}
          {priorities.length === 0 && (
            <p className="text-gray-400 text-center py-4">Drag priorities here</p>
          )}
          {priorities.length >= MAX_PRIORITIES && (
            <p className="text-orange-500 text-center font-medium py-2">
              Maximum priorities reached. Remove one to add another.
            </p>
          )}
        </motion.div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleNext}
        disabled={priorities.length === 0}
        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
      >
        Next
      </motion.button>
    </div>
  );
} 