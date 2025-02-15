import React, { useRef, useEffect } from 'react';
import Message from './Message';
import { useChatStore } from '../store/chatStore';
import WelcomeHeader from './WelcomeHeader';
import TypingIndicator from './TypingIndicator';
import DefaultQuestions from './DefaultQuestions';

export default function ChatContent() {
  const messages = useChatStore((state) => state.messages);
  const isTyping = useChatStore((state) => state.isTyping);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="w-[80%] mx-auto flex flex-col gap-4">
      <WelcomeHeader />
      <div className="flex flex-col space-y-4">
        {messages.length === 0 ? (
          <DefaultQuestions />
        ) : (
          <>
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="h-4" />
    </div>
  );
}