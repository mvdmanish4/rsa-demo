import { create } from 'zustand';
import { Message, ChatState, MessageMetadata } from '../types/chat';

const STORAGE_KEY = 'chat_messages';
const EXPANDED_KEY = 'chat_expanded';
const TYPING_DELAY = 4000; // 4 seconds delay

// Initialize BroadcastChannel for cross-tab communication
const broadcastChannel = new BroadcastChannel('chat_sync');

// Get initial messages from localStorage
const getStoredMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Error reading stored messages:', error);
    return [];
  }
};

// Always start with collapsed state
const getInitialExpandedState = (): boolean => {
  return false;
};

interface ChatStore extends ChatState {
  addMessage: (content: string, type: 'user' | 'system', metadata?: MessageMetadata) => void;
  setTyping: (isTyping: boolean) => void;
  isExpanded: boolean;
  setExpanded: (expanded: boolean) => void;
  processSilentStormResponses: (responses: any[]) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: getStoredMessages(),
  isTyping: false,
  isExpanded: getInitialExpandedState(),
  addMessage: (content, type, metadata) => {
    set((state) => {
      const newMessage = {
        id: Date.now().toString(),
        content,
        type,
        metadata,
        timestamp: new Date()
      };
      
      const newMessages = [...state.messages, newMessage];
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
      
      // Broadcast to other tabs
      broadcastChannel.postMessage({
        type: 'NEW_MESSAGE',
        messages: newMessages
      });

      if (!state.isExpanded) {
        window.parent.postMessage({ type: 'expand' }, '*');
      }

      return {
        messages: newMessages,
        isExpanded: true
      };
    });
  },
  setTyping: (isTyping) => set({ isTyping }),
  setExpanded: (expanded) => {
    window.parent.postMessage({ type: expanded ? 'expand' : 'collapse' }, '*');
    
    // Save expanded state to localStorage
    localStorage.setItem(EXPANDED_KEY, String(expanded));
    
    // Broadcast expanded state change
    broadcastChannel.postMessage({
      type: 'EXPANDED_STATE',
      expanded
    });
    
    set({ isExpanded: expanded });
  },
  processSilentStormResponses: async (responses: any[]) => {
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      const isLastMessage = i === responses.length - 1;
      
      // Show typing indicator before each message
      set({ isTyping: true });
      await new Promise(resolve => setTimeout(resolve, TYPING_DELAY));
      
      if (typeof response === 'string') {
        useChatStore.getState().addMessage(response, 'system', {
          followUpQuestions: isLastMessage ? [
            "Apply mitigation for this vulnerability",
            "Are there active proof-of-concept (PoC) exploits available?"
          ] : []
        });
      } else if (response.type === 'combined') {
        useChatStore.getState().addMessage(response.content, 'system', {
          table: response.table.data,
          followUpQuestions: isLastMessage ? [
            "Apply mitigation for this vulnerability",
            "Are there active proof-of-concept (PoC) exploits available?"
          ] : []
        });
      }
      
      // Hide typing indicator after each message
      set({ isTyping: false });
      
      // Add delay between messages if not the last one
      if (!isLastMessage) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }
}));