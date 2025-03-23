import React from 'react';
import { motion } from 'framer-motion';
import { FaComments, FaHistory, FaPlus } from 'react-icons/fa';
import { useChatContext } from '../contexts/ChatContext';

export default function BottomNavigation({ currentView, setCurrentView }) {
  const { createNewConversation } = useChatContext();

  const handleNewChat = () => {
    createNewConversation();
    setCurrentView('chat');
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-gemini-navy border-t border-gemini-surface flex justify-around items-center z-20 h-16"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => setCurrentView('chat')}
        className={`flex flex-col items-center justify-center w-1/4 p-2 cursor-pointer ${
          currentView === 'chat' ? 'text-gemini-purple' : 'text-gray-400'
        }`}
      >
        <FaComments size={24} />
        <span className="text-xs mt-1">Chat</span>
      </button>
      
      <div className="w-1/4 flex justify-center">
        <motion.button
          onClick={handleNewChat}
          className="w-12 h-12 rounded-full gemini-gradient flex items-center justify-center shadow-lg cursor-pointer"
          whileTap={{ scale: 0.9 }}
        >
          <FaPlus size={20} className="text-white" />
        </motion.button>
      </div>
      
      <button
        onClick={() => setCurrentView('conversations')}
        className={`flex flex-col items-center justify-center w-1/4 p-2 cursor-pointer ${
          currentView === 'conversations' ? 'text-gemini-purple' : 'text-gray-400'
        }`}
      >
        <FaHistory size={24} />
        <span className="text-xs mt-1">History</span>
      </button>
    </motion.div>
  );
}