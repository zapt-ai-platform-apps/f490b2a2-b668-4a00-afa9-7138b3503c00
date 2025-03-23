import React from 'react';
import { ChatProvider } from './contexts/ChatContext';
import ChatLayout from './components/ChatLayout';

export default function App() {
  return (
    <div className="h-full bg-gemini-background">
      <ChatProvider>
        <ChatLayout />
      </ChatProvider>
      <div className="fixed bottom-20 left-4 text-xs text-gray-400 z-10">
        <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="hover:text-gemini-purple transition-colors">
          Made on ZAPT
        </a>
      </div>
    </div>
  );
}