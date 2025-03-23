import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConversationSidebar from './ConversationSidebar';
import ChatWindow from './ChatWindow';

export default function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full overflow-hidden bg-gemini-background text-white">
      {/* Sidebar backdrop for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar with animation */}
      <ConversationSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full">
        <ChatWindow onOpenSidebar={() => setSidebarOpen(true)} />
      </div>
    </div>
  );
}