import React from 'react';
import { useConfigStore } from '../store/configStore';

export default function ChatBanner() {
  const config = useConfigStore((state) => state.config);
  
  const defaultBannerImage = "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&h=300";
  
  return (
    <div className="relative">
      <img
        src={config.background_image_url || defaultBannerImage}
        alt="Banner"
        className="w-full h-[200px] object-cover"
      />
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <div className="rounded-full p-2 bg-white border-4 border-white" style={{ backgroundColor: 'rgb(223, 224, 238)' }}>
          {config.logo_url ? (
            <img src="https://tinyurl.com/4rfp4brh" alt="Logo" className="w-12 h-12 object-contain" />
          ) : (
            <span className="text-4xl">👕</span>
          )}
        </div>
      </div>
    </div>
  );
}