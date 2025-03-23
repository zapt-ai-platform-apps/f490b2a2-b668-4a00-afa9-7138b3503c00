import React, { useState } from 'react';
import { FaPlus, FaTrash, FaEllipsisV, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
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

  return (
    <aside className={`fixed inset-y-0 left-0 z-10 w-72 bg-gray-900 border-r border-gray-800 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-800">
          <button
            onClick={createNewConversation}
            className="flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg text-white font-medium transition-colors cursor-pointer"
          >
            <FaPlus className="mr-2" />
            New Chat
          </button>
          <button 
            className="md:hidden mt-4 text-gray-400 hover:text-white cursor-pointer"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            Close
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
          <div className="space-y-1 px-2">
            {Object.entries(conversations).map(([id, conversation]) => (
              <div 
                key={id}
                className={`relative group rounded-lg ${
                  id === activeConversationId
                    ? 'bg-gray-800'
                    : 'hover:bg-gray-800 bg-transparent'
                }`}
              >
                {editingId === id ? (
                  <div className="flex items-center p-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 box-border"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <button 
                      onClick={() => handleSaveEdit(id)}
                      className="ml-1 p-1 text-green-400 hover:text-green-300 cursor-pointer"
                      aria-label="Save title"
                    >
                      <FaCheck size={14} />
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="ml-1 p-1 text-red-400 hover:text-red-300 cursor-pointer"
                      aria-label="Cancel editing"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveConversationId(id)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{conversation.title}</span>
                    </button>
                    <div className={`absolute right-2 top-2 flex space-x-1 ${id === activeConversationId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(id, conversation.title);
                        }}
                        className="p-1 text-gray-400 hover:text-white rounded cursor-pointer"
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
                        className="p-1 text-gray-400 hover:text-yellow-400 rounded cursor-pointer"
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
                        className="p-1 text-gray-400 hover:text-red-400 rounded cursor-pointer"
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
        
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-400">
            <p>Made on <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">ZAPT</a></p>
          </div>
        </div>
      </div>
    </aside>
  );
}