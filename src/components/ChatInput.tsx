import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useConfigStore } from '../store/configStore';
import { fetchChatResponse } from '../utils/api';
import { getLighterColor } from '../utils/colors';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const { addMessage, setTyping, isExpanded, setExpanded, processSilentStormResponses } = useChatStore();
  const config = useConfigStore((state) => state.config);
  const [isError, setIsError] = useState(false);

  const botMessageColor = getLighterColor(config.color_hex || '#FFD5CF');
  const borderColor = getLighterColor(config.color_hex || '#FFD5CF'); // Make border lighter

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsError(false);
    addMessage(input.trim(), 'user');
    setInput('');
    
    // Show typing indicator before fetching response
    setTyping(true);
    
    const response = await fetchChatResponse(input.trim());
    
    if (response.error) {
      setIsError(true);
      setTyping(false);
      return;
    }
    
    addMessage(response.response, 'system', {
      followUpQuestions: response.silentstorm_responses ? [] : response.follow_up_questions,
      products: response.products || []
    });

    // Handle SilentStorm sequential responses
    if (response.silentstorm_responses) {
      await processSilentStormResponses(response.silentstorm_responses);
    }
    
    setTyping(false);
  };

  const handleFocus = () => {
    if (!isExpanded) {
      setExpanded(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <Sparkles 
          className={`w-5 h-5 ${isError ? 'text-red-400' : ''}`}
          style={{ color: isError ? undefined : config.color_hex || '#FFD5CF' }}
        />
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={handleFocus}
        placeholder="What can I help you find?"
        className={`w-full p-4 pl-12 pr-12 rounded-full outline-none focus:outline-none focus:ring-0 ${
          isExpanded 
            ? `border-2 ${
                isError 
                  ? 'border-red-300 focus:border-red-400' 
                  : 'border-[#FFD5CF] focus:border-[#FFD5CF]'
              } bg-white`
            : 'border-2 border-[#FFD5CF] shadow-none'
        }`}
        style={{
          '--tw-ring-color': config.color_hex || '#FFD5CF',
          backgroundColor: isExpanded ? 'white' : botMessageColor,
          borderColor: borderColor
        } as React.CSSProperties}
      />
      <button 
        type="submit"
        className={`absolute right-4 top-1/2 -translate-y-1/2`}
        style={{ 
          color: isExpanded
            ? isError ? undefined : config.color_hex || '#FFD5CF'
            : config.color_hex || '#FFD5CF'
        }}
      >
        →
      </button>
    </form>
  );
}