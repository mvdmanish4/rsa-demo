export type MessageType = 'user' | 'system';

export interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  description: string;
}

export interface TableRow {
  unit: string;
  count: number;
  link: string;
}

export interface MessageMetadata {
  followUpQuestions?: string[];
  products?: Product[];
  image?: string;
  table?: TableRow[];
}

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
}

export interface ChatResponse {
  conversation_id: string;
  response: string;
  follow_up_questions?: string[];
  products?: Product[];
}