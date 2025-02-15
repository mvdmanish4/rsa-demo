import React, { useEffect } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatBanner from './components/ChatBanner';
import ChatContent from './components/ChatContent';
import ChatInput from './components/ChatInput';
import { useChatStore } from './store/chatStore';
import { useConfigStore } from './store/configStore';
import { fetchStoreConfig } from './utils/api';

export default function App() {
  const { isExpanded } = useChatStore();
  const setConfig = useConfigStore((state) => state.setConfig);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetchStoreConfig();
        if (response?.data) {
          setConfig(response.data);
        } else {
          console.warn('Using default store configuration');
        }
      } catch (error) {
        console.warn('Failed to load store configuration:', error);
      }
    };
    loadConfig();
  }, [setConfig]);

  const handleClose = () => {
    useChatStore.getState().setExpanded(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F8F8FF]">
      {isExpanded ? (
        <>
          <ChatHeader onClose={handleClose} />
          <div className="flex-1 overflow-y-auto bg-[#F8F8FF]">
            <ChatBanner />
            <ChatContent />
          </div>
          <div className="p-4 border-t bg-white">
            <div className="w-[80%] mx-auto">
              <ChatInput />
            </div>
          </div>
        </>
      ) : (
        <div className="h-screen w-screen flex items-center justify-center p-4 bg-[#F8F8FF]">
          <div className="w-full max-w-2xl">
            <ChatInput />
          </div>
        </div>
      )}
    </div>
  );
}