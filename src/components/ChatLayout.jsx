import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavigation from './BottomNavigation';
import ChatWindow from './ChatWindow';
import ConversationList from './ConversationList';

export default function ChatLayout() {
  const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'conversations'

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gemini-background text-white">
      <AnimatePresence mode="wait">
        {currentView === 'chat' ? (
          <motion.div
            key="chat"
            className="flex-1 flex flex-col h-full"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
          >
            <ChatWindow />
          </motion.div>
        ) : (
          <motion.div
            key="conversations"
            className="flex-1 flex flex-col h-full"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.2 }}
          >
            <ConversationList onSelectConversation={() => setCurrentView('chat')} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <BottomNavigation currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
}