import React from 'react';
import { useConfigStore } from '../store/configStore';
import { getLighterColor } from '../utils/colors';

export default function TypingIndicator() {
  const config = useConfigStore((state) => state.config);
  const backgroundColor = getLighterColor(config.color_hex || '#F2E3C9');

  return (
    <div className="flex justify-start mb-4">
      <div className="p-4 rounded-lg" style={{ backgroundColor }}>
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}