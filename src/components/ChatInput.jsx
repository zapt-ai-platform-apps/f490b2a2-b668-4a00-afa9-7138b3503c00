import React, { useState, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { FaPaperPlane, FaMicrophone } from 'react-icons/fa';
import { motion } from 'framer-motion';
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
    <motion.div 
      className="fixed bottom-0 w-full px-4 py-3 bg-gemini-navy border-t border-gemini-surface z-10"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form 
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto"
      >
        <div className="relative flex items-center">
          {/* Microphone button (non-functional, just for UI) */}
          <button
            type="button"
            className="absolute left-3 p-2 text-gray-400 hover:text-gemini-blue bg-transparent rounded-full focus:outline-none cursor-pointer"
            aria-label="Voice input"
          >
            <FaMicrophone size={18} />
          </button>
          
          <TextareaAutosize
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Astra..."
            className="w-full py-3 pl-12 pr-12 bg-gemini-surface border-none rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gemini-blue input-focus-animation box-border resize-none"
            maxRows={3}
            disabled={isProcessing}
          />
          
          <motion.button
            type="submit"
            whileTap={{ scale: 0.9 }}
            className={`absolute right-3 p-2 rounded-full ${
              input.trim() && !isProcessing
                ? 'gemini-gradient text-white cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!input.trim() || isProcessing}
            aria-label="Send message"
          >
            <FaPaperPlane size={16} />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}