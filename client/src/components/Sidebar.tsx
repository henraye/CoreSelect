import { useNavigate, useLocation } from 'react-router';
import { usePCStore } from '../store';

interface SidebarProps {
  onLogout?: () => void;
}

const steps = [
  { id: 1, name: 'Budget', icon: '💰', path: '/' },
  { id: 2, name: 'Priorities', icon: '🎯', path: '/priorities' },
  { id: 3, name: 'Review', icon: '📋', path: '/review' },
  { id: 4, name: 'Results', icon: '✨', path: '/results' }
];

export default function Sidebar({ onLogout }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { completedSteps } = usePCStore();
  
  const currentStep = steps.findIndex(step => step.path === location.pathname) + 1;

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
      <div className="flex items-center gap-2 mb-8 p-2">
        <span className="text-2xl">🖥️</span>
        <h1 className="text-xl font-bold">CoreSelect</h1>
      </div>

      <div className="relative">
        {/* Vertical progress line */}
        <div className="absolute left-[1.6rem] top-0 h-full w-0.5 bg-gray-700">
          <div 
            className="absolute top-0 left-0 w-full bg-blue-500 transition-all duration-300"
            style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isActive = location.pathname === step.path;
            const isClickable = isCompleted || step.id === 1 || 
              (step.id > 1 && completedSteps.includes(step.id - 1));

            return (
              <button
                key={step.id}
                onClick={() => isClickable && navigate(step.path)}
                disabled={!isClickable}
                className={`
                  relative flex items-center w-full p-3 rounded-lg transition-all
                  ${isClickable ? 'hover:bg-gray-800 cursor-pointer' : 'cursor-not-allowed opacity-50'}
                  ${isActive ? 'bg-gray-800' : ''}
                `}
              >
                <div className={`
                  z-10 flex items-center justify-center w-8 h-8 rounded-full 
                  ${isCompleted ? 'bg-blue-500' : 'bg-gray-700'}
                  transition-all duration-300
                `}>
                  <span className="text-lg">{step.icon}</span>
                </div>
                <span className="ml-3 text-sm font-medium">{step.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 w-64 p-4 bg-gray-900">
        <button 
          className="w-full p-2 text-sm text-gray-400 hover:bg-gray-800 rounded-lg transition-all"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
} 