import React, { useState } from 'react';
import ConversationSidebar from './ConversationSidebar';
import ChatWindow from './ChatWindow';

export default function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full overflow-hidden bg-gray-900 text-white">
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-5 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <ConversationSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col md:pl-72">
        <ChatWindow onOpenSidebar={() => setSidebarOpen(true)} />
      </div>
    </div>
  );
}