import { useState } from 'react';

interface SidebarProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

const steps = [
  { id: 1, name: 'Budget', icon: '💰' },
  { id: 2, name: 'CPU Preference', icon: '🔧' },
  { id: 3, name: 'GPU Preference', icon: '🎮' },
  { id: 4, name: 'Review', icon: '📋' },
  { id: 5, name: 'Results', icon: '✨' }
];

export default function Sidebar({ currentStep, onStepChange }: SidebarProps) {
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
            const isCompleted = currentStep >= step.id;
            const isActive = currentStep === step.id;
            const isClickable = step.id <= currentStep + 1;

            return (
              <button
                key={step.id}
                onClick={() => isClickable && onStepChange(step.id)}
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
          onClick={() => {/* Add logout functionality */}}
        >
          Logout
        </button>
      </div>
    </div>
  );
} 