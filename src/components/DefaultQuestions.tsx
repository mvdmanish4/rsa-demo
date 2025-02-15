import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useConfigStore } from '../store/configStore';
import { useChatStore } from '../store/chatStore';
import { fetchChatResponse } from '../utils/api';
import { getLighterColor } from '../utils/colors';

const DEFAULT_QUESTIONS = [
  "Which container images have critical vulnerabilities that aer actively being exploited?",
  "Show attack chains on test-app-pod",
  "What are my top misconfigurations to fix first?"
];

export default function DefaultQuestions() {
  const config = useConfigStore((state) => state.config);
  const { addMessage, setTyping } = useChatStore();
  const backgroundColor = getLighterColor(config.color_hex || '#FFD5CF');

  const handleQuestionClick = async (question: string) => {
    addMessage(question, 'user');
    setTyping(true);
    
    try {
      const data = await fetchChatResponse(question);
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
    <div className="w-[80%] mx-auto mt-2">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold mb-2">Welcome! How can I assist you today?</h3>
        <p className="text-gray-600">Here are some questions to get you started:</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {DEFAULT_QUESTIONS.map((question, index) => (
          <button
            key={index}
            onClick={() => handleQuestionClick(question)}
            className="flex items-start gap-3 p-4 rounded-lg transition-colors text-left hover:opacity-90 w-full"
            style={{ 
              backgroundColor,
              borderColor: config.color_hex || '#FFD5CF',
              borderWidth: '1px'
            }}
          >
            <MessageSquare 
              className="w-5 h-5 flex-shrink-0 mt-0.5" 
              style={{ color: config.color_hex || '#FFD5CF' }}
            />
            <span>{question}</span>
          </button>
        ))}
      </div>
    </div>
  );
}