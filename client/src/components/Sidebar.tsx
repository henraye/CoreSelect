import { useNavigate, useLocation } from 'react-router';
import { usePCStore } from '../store';

interface SidebarProps {}

const baseSteps = [
  { id: 1, name: 'Budget', icon: '💰', path: '/' },
  { id: 2, name: 'Priorities', icon: '🎯', path: '/priorities' },
  { id: 3, name: 'Review', icon: '📋', path: '/review' },
  { id: 4, name: 'Results', icon: '✨', path: '/results' }
];

export default function Sidebar({}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { completedSteps, priorities } = usePCStore();
  
  // Insert game preferences step if gaming is in top 3 priorities
  const steps = [...baseSteps];
  if (priorities.slice(0, 3).includes("Gaming Performance")) {
    steps.splice(2, 0, {
      id: 2.5,
      name: 'Gaming',
      icon: '🎮',
      path: '/game-preferences'
    });
  }

  const currentStep = steps.findIndex(step => step.path === location.pathname) + 1;

  return (
    <div className="w-80 min-h-screen bg-gray-900 text-white p-6">
      <div className="flex items-center gap-3 mb-10 p-2">
        <span className="text-3xl">🖥️</span>
        <h1 className="text-2xl font-bold">CoreSelect</h1>
      </div>

      <div className="relative">
        {/* Vertical progress line */}
        <div className="absolute left-[2.10rem] top-0 h-full w-1 bg-gray-700 z-0">
          <div 
            className="absolute top-0 left-0 w-full bg-blue-500 transition-all duration-300"
            style={{ height: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-8 relative">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(Math.floor(step.id));
            const isActive = location.pathname === step.path;
            const isClickable = isCompleted || step.id === 1 || 
              (step.id > 1 && completedSteps.includes(Math.floor(step.id - 1)));

            return (
              <button
                key={step.id}
                onClick={() => isClickable && navigate(step.path)}
                disabled={!isClickable}
                className={`
                  relative flex items-center w-full p-4 rounded-lg transition-all
                  ${isClickable ? 'hover:bg-gray-800 cursor-pointer' : 'cursor-not-allowed opacity-50'}
                  ${isActive ? 'bg-gray-800' : ''}
                `}
              >
                <div className={`
                  z-10 flex items-center justify-center w-10 h-10 rounded-full 
                  ${isCompleted ? 'bg-blue-500' : 'bg-gray-700'}
                  transition-all duration-300 bg-gray-900
                `}>
                  <span className="text-xl">{step.icon}</span>
                </div>
                <span className="ml-4 text-base font-medium">{step.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 