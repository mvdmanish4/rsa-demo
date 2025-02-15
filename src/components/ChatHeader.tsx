import React from 'react';
import { MoreVertical, X } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useConfigStore } from '../store/configStore';

interface ChatHeaderProps {
  onClose: () => void;
}

export default function ChatHeader({ onClose }: ChatHeaderProps) {
  const config = useConfigStore((state) => state.config);
  
  const handleClose = () => {
    window.parent.postMessage({ type: 'collapse' }, '*');
    onClose();
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center">
        {config.logo_url ? (
          <img src={config.logo_url} alt="Logo" className="w-30 h-8 object-contain" />
        ) : (
          <div 
            className="p-2 rounded-full"
            style={{ backgroundColor: config.color_hex || '#F2E3C9' }}
          >
            <span className="text-2xl">👕</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button 
          className="p-1 rounded-full"
          style={{ 
            '&:hover': {
              backgroundColor: `${config.color_hex || '#F2E3C9'}20`
            }
          }}
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
        <button 
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full transition-colors"
          style={{ 
            '&:hover': {
              backgroundColor: `${config.color_hex || '#F2E3C9'}20`
            }
          }}
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}