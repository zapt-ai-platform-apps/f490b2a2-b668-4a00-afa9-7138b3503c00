import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStream } from 'react-icons/fa';
import { useChatContext } from '../contexts/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatWindow() {
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
        <h1 className="text-lg font-medium text-white mx-auto">
          {activeConversation.title || 'New Chat'}
        </h1>
        
        <button
          onClick={() => setUseStreamingMode(!useStreamingMode)}
          className={`p-2 rounded-full ${
            useStreamingMode
              ? 'gemini-gradient text-white'
              : 'bg-gemini-surface text-gray-400'
          } cursor-pointer`}
          title={useStreamingMode ? 'Streaming mode on' : 'Streaming mode off'}
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