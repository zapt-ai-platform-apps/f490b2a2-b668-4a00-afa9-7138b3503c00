import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaEllipsisV, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { useChatContext } from '../contexts/ChatContext';

export default function ConversationList({ onSelectConversation }) {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
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

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    onSelectConversation();
  };

  // Sort conversations by updatedAt timestamp (most recent first)
  const sortedConversations = Object.entries(conversations)
    .sort(([, a], [, b]) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <div className="flex flex-col h-full bg-gemini-background">
      <motion.header 
        className="flex items-center py-3 px-4 bg-gemini-navy z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-lg font-medium text-white mx-auto">
          Conversation History
        </h1>
      </motion.header>
      
      <div className="flex-1 overflow-y-auto py-4 px-4">
        <div className="space-y-3">
          {sortedConversations.map(([id, conversation]) => (
            <motion.div 
              key={id}
              className={`relative group rounded-xl overflow-hidden ${
                id === activeConversationId
                  ? 'bg-gemini-surface'
                  : 'bg-gemini-navy'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {editingId === id ? (
                <div className="flex items-center p-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 bg-gemini-background text-white px-3 py-2 rounded-lg border border-gemini-surface focus:outline-none focus:ring-1 focus:border-gemini-blue box-border"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(id);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <button 
                    onClick={() => handleSaveEdit(id)}
                    className="ml-1 p-2 text-green-400 hover:text-green-300 cursor-pointer"
                  >
                    <FaCheck size={14} />
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    className="ml-1 p-2 text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center p-3">
                  <button
                    onClick={() => handleSelectConversation(id)}
                    className="flex-1 text-left py-2 text-white truncate cursor-pointer"
                  >
                    {conversation.title}
                  </button>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleStartEdit(id, conversation.title)}
                      className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gemini-surface cursor-pointer"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to clear this conversation?')) {
                          clearConversation(id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-yellow-400 rounded-full hover:bg-gemini-surface cursor-pointer"
                    >
                      <FaEllipsisV size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this conversation?')) {
                          deleteConversation(id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-400 rounded-full hover:bg-gemini-surface cursor-pointer"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="p-4 mt-auto">
        <div className="text-xs text-center text-gray-400 pb-16">
          <p>Made on <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-gemini-purple hover:text-gemini-blue">ZAPT</a></p>
        </div>
      </div>
    </div>
  );
}