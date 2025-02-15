import React from 'react';
import { useChatStore } from '../store/chatStore';
import { useConfigStore } from '../store/configStore';
import { Star } from 'lucide-react';
import { fetchChatResponse } from '../utils/api';

interface QuickResponsesProps {
  responses: string[];
}

export default function QuickResponses({ responses }: QuickResponsesProps) {
  const { addMessage, setTyping } = useChatStore();
  const config = useConfigStore((state) => state.config);

  const handleClick = async (response: string) => {
    addMessage(response, 'user');
    
    setTyping(true);
    try {
      const data = await fetchChatResponse(response);
      
      if (data.response) {
        addMessage(data.response, 'system', {
          followUpQuestions: data.follow_up_questions,
          products: data.products
        });
      }
    } catch (error) {
      addMessage('Sorry, I encountered an error. Please try again.', 'system');
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {responses.map((response, index) => (
        <button
          key={index}
          onClick={() => handleClick(response)}
          className="flex items-start gap-2 p-3 rounded-lg border transition-colors hover:opacity-80"
          style={{ 
            borderColor: config.color_hex || '#D4A574'
          }}
        >
          <Star 
            className="w-4 h-4 flex-shrink-0 mt-1" 
            style={{ color: config.color_hex || '#D4A574' }}
          />
          <span className="text-left text-gray-700">{response}</span>
        </button>
      ))}
    </div>
  );
}