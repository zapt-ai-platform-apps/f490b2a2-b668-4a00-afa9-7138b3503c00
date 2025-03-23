import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaEllipsisV, FaEdit, FaCheck, FaTimes, FaHistory } from 'react-icons/fa';
import { useChatContext } from '../contexts/ChatContext';

export default function ConversationSidebar({ isOpen, onClose }) {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
    createNewConversation, 
    deleteConversation,
    updateConversationTitle,
    clearConversation
  } = useChatContext();

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartEdit = (id, currentTitle) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveEdit = (id) => {
    if (editTitle.trim()) {
      updateConversationTitle(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Sort conversations by updatedAt timestamp (most recent first)
  const sortedConversations = Object.entries(conversations)
    .sort(([, a], [, b]) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <motion.aside 
      className={`fixed inset-y-0 left-0 z-30 w-80 bg-gemini-navy transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 overflow-hidden flex flex-col`}
      initial={{ x: -320 }}
      animate={{ x: isOpen ? 0 : -320 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="p-4 border-b border-gemini-surface">
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-lg font-medium text-white">Astra Chats</h2>
        </div>
        
        {/* New Chat Button */}
        <motion.button
          onClick={createNewConversation}
          className="flex items-center justify-center w-full px-4 py-3 rounded-full gemini-gradient text-white font-medium cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaPlus className="mr-2" />
          New Chat
        </motion.button>
        
        {/* Mobile close button */}
        <button 
          className="md:hidden mt-4 px-4 py-2 text-gray-400 hover:text-white w-full text-center cursor-pointer"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          Close
        </button>
      </div>
      
      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="space-y-1 px-2">
          {sortedConversations.map(([id, conversation]) => (
            <div 
              key={id}
              className={`relative group rounded-xl overflow-hidden ${
                id === activeConversationId
                  ? 'bg-gemini-surface'
                  : 'hover:bg-gemini-surface/50 bg-transparent'
              }`}
            >
              {editingId === id ? (
                <div className="flex items-center p-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 bg-gemini-navy text-white px-3 py-2 rounded-lg border border-gemini-surface focus:outline-none focus:ring-1 focus:border-gemini-blue box-border"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(id);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <button 
                    onClick={() => handleSaveEdit(id)}
                    className="ml-1 p-2 text-green-400 hover:text-green-300 cursor-pointer"
                    aria-label="Save title"
                  >
                    <FaCheck size={14} />
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    className="ml-1 p-2 text-red-400 hover:text-red-300 cursor-pointer"
                    aria-label="Cancel editing"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setActiveConversationId(id);
                      onClose(); // Close sidebar on mobile after selection
                    }}
                    className="w-full text-left px-4 py-3 text-gray-300 flex items-center cursor-pointer"
                  >
                    <FaHistory className="text-gray-400 mr-3" />
                    <span className="truncate">{conversation.title}</span>
                  </button>
                  
                  {/* Action buttons */}
                  <div className={`absolute right-1 top-1/2 -translate-y-1/2 flex space-x-1 ${id === activeConversationId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(id, conversation.title);
                      }}
                      className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gemini-surface cursor-pointer"
                      aria-label="Edit conversation title"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to clear this conversation?')) {
                          clearConversation(id);
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-yellow-400 rounded-full hover:bg-gemini-surface cursor-pointer"
                      aria-label="Clear conversation"
                    >
                      <FaEllipsisV size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this conversation?')) {
                          deleteConversation(id);
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-400 rounded-full hover:bg-gemini-surface cursor-pointer"
                      aria-label="Delete conversation"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer with branding */}
      <div className="p-4 border-t border-gemini-surface mt-auto">
        <div className="text-xs text-center text-gray-400">
          <p>Made on <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-gemini-purple hover:text-gemini-blue">ZAPT</a></p>
        </div>
      </div>
    </motion.aside>
  );
}