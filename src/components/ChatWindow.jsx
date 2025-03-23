import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaStream } from 'react-icons/fa';
import { useChatContext } from '../contexts/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatWindow({ onOpenSidebar }) {
  const { 
    activeConversation, 
    streamingMessage, 
    useStreamingMode, 
    setUseStreamingMode 
  } = useChatContext();
  
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation.messages, streamingMessage]);

  return (
    <div className="flex flex-col h-full">
      {/* Header - Gemini style */}
      <motion.header 
        className="flex items-center justify-between py-3 px-4 bg-gemini-navy z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-full text-white hover:bg-gemini-surface cursor-pointer"
            aria-label="Open sidebar"
          >
            <FaBars size={20} />
          </button>
          <h1 className="ml-3 text-lg font-medium text-white">
            {activeConversation.title || 'New Chat'}
          </h1>
        </div>
        
        <button
          onClick={() => setUseStreamingMode(!useStreamingMode)}
          className={`p-2 rounded-full ${
            useStreamingMode
              ? 'gemini-gradient text-white'
              : 'bg-gemini-surface text-gray-400'
          } cursor-pointer`}
          title={useStreamingMode ? 'Streaming mode on' : 'Streaming mode off'}
          aria-label={useStreamingMode ? 'Turn streaming mode off' : 'Turn streaming mode on'}
        >
          <FaStream size={16} />
        </button>
      </motion.header>
      
      {/* Chat messages with padding for input */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="pt-2 pb-4">
          {activeConversation.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {/* Streaming message */}
          {streamingMessage && (
            <ChatMessage message={streamingMessage} isStreaming={true} />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area - Handled by ChatInput component with fixed positioning */}
      <ChatInput />
    </div>
  );
}