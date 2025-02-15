import React from 'react';
import { Plus } from 'lucide-react';

const options = [
  { id: 1, label: 'Home Security' },
  { id: 2, label: 'Baby Monitoring' },
  { id: 3, label: 'Elder Monitoring' },
  { id: 4, label: 'Pet Monitoring' },
];

export default function ChatOptions() {
  return (
    <div className="space-y-4">
      <p className="font-medium">
        Which of the following best describes your intended use for the security cameras? Please select the closest option or provide your own.
      </p>
      <p className="text-gray-600">
        For example, are you looking for something for Home Security or Baby Monitoring, etc.?
      </p>
      <p className="text-gray-600">
        Feel free to type in your response!
      </p>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            className="p-3 border rounded-lg hover:border-[#00FFD1] hover:bg-[#00FFD1]/5 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}