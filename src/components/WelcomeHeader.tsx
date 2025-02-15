import React from 'react';
import { useConfigStore } from '../store/configStore';

export default function WelcomeHeader() {
  const config = useConfigStore((state) => state.config);

  return (
    <div className="text-center mt-6">
      <div className="h-2" /> {/* Reduced spacer */}
    </div>
  );
}