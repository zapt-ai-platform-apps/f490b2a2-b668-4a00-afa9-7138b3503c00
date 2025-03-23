import React, { useState, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { FaPaperPlane } from 'react-icons/fa';
import { useChatContext } from '../contexts/ChatContext';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const { sendMessage, isProcessing } = useChatContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    await sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="border-t border-gray-700 bg-gray-800 py-4">
      <form 
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto px-4 sm:px-6"
      >
        <div className="relative flex items-center">
          <TextareaAutosize
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Astra something..."
            className="w-full py-3 px-4 pr-12 bg-gray-700 border border-gray-600 rounded-lg resize-none text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent box-border"
            maxRows={5}
            disabled={isProcessing}
          />
          <button
            type="submit"
            className={`absolute right-3 p-2 rounded-md ${
              input.trim() && !isProcessing
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!input.trim() || isProcessing}
            aria-label="Send message"
          >
            <FaPaperPlane size={16} />
          </button>
        </div>
        <div className="mt-2 text-center text-xs text-gray-400">
          {isProcessing ? 'Astra is thinking...' : 'Press Enter to send, Shift+Enter for new line'}
        </div>
      </form>
    </div>
  );
}