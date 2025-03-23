import React, { useRef, useEffect } from 'react';
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
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 py-3 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onOpenSidebar}
            className="md:hidden mr-4 p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer"
            aria-label="Open sidebar"
          >
            <FaBars size={20} />
          </button>
          <h1 className="text-lg font-semibold text-white">
            {activeConversation.title || 'New Chat'}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400 mr-2">Streaming:</span>
          <button
            onClick={() => setUseStreamingMode(!useStreamingMode)}
            className={`p-1.5 rounded-md cursor-pointer ${
              useStreamingMode
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                : 'bg-gray-700 text-gray-400'
            }`}
            title={useStreamingMode ? 'Streaming mode on' : 'Streaming mode off'}
            aria-label={useStreamingMode ? 'Turn streaming mode off' : 'Turn streaming mode on'}
          >
            <FaStream size={16} />
          </button>
        </div>
      </header>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="pb-10">
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
      
      {/* Input area */}
      <ChatInput />
    </div>
  );
}