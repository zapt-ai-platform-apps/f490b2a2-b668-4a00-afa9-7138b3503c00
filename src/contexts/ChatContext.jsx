import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/browser';

// Define initial message from Astra
const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi, I'm Astra! I'm an AI assistant here to help answer your questions and have conversations. What would you like to talk about today?",
  timestamp: new Date().toISOString(),
};

const ChatContext = createContext();

export function useChatContext() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState(() => {
    try {
      const savedConversations = localStorage.getItem('astra-conversations');
      if (savedConversations) {
        return JSON.parse(savedConversations);
      }
      // Create a default conversation if none exists
      return {
        [uuidv4()]: {
          title: 'New Chat',
          messages: [WELCOME_MESSAGE],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      };
    } catch (error) {
      Sentry.captureException(error);
      console.error('Failed to load conversations from localStorage:', error);
      return {};
    }
  });

  const [activeConversationId, setActiveConversationId] = useState(() => {
    try {
      const savedId = localStorage.getItem('astra-active-conversation');
      if (savedId && conversations[savedId]) {
        return savedId;
      }
      return Object.keys(conversations)[0];
    } catch (error) {
      Sentry.captureException(error);
      console.error('Failed to load active conversation ID from localStorage:', error);
      return Object.keys(conversations)[0];
    }
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState(null);
  const [useStreamingMode, setUseStreamingMode] = useState(() => {
    try {
      const savedMode = localStorage.getItem('astra-use-streaming');
      return savedMode ? JSON.parse(savedMode) : true;
    } catch (error) {
      Sentry.captureException(error);
      console.error('Failed to load streaming mode setting from localStorage:', error);
      return true;
    }
  });

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('astra-conversations', JSON.stringify(conversations));
    } catch (error) {
      Sentry.captureException(error);
      console.error('Failed to save conversations to localStorage:', error);
    }
  }, [conversations]);

  // Save active conversation ID to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('astra-active-conversation', activeConversationId);
    } catch (error) {
      Sentry.captureException(error);
      console.error('Failed to save active conversation ID to localStorage:', error);
    }
  }, [activeConversationId]);

  // Save streaming mode preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('astra-use-streaming', JSON.stringify(useStreamingMode));
    } catch (error) {
      Sentry.captureException(error);
      console.error('Failed to save streaming mode to localStorage:', error);
    }
  }, [useStreamingMode]);

  const activeConversation = conversations[activeConversationId] || { messages: [] };

  const createNewConversation = useCallback(() => {
    try {
      const newId = uuidv4();
      const newConversation = {
        title: 'New Chat',
        messages: [WELCOME_MESSAGE],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setConversations(prev => ({
        ...prev,
        [newId]: newConversation
      }));
      setActiveConversationId(newId);
      return newId;
    } catch (error) {
      Sentry.captureException(error);
      console.error('Failed to create new conversation:', error);
    }
  }, []);

  const deleteConversation = useCallback((conversationId) => {
    try {
      setConversations(prev => {
        const newConversations = { ...prev };
        delete newConversations[conversationId];
        
        // If we're deleting the active conversation, switch to another one
        // or create a new one if there are none left
        if (conversationId === activeConversationId) {
          const remainingIds = Object.keys(newConversations);
          if (remainingIds.length > 0) {
            setActiveConversationId(remainingIds[0]);
          } else {
            // Create a new conversation if we deleted the last one
            const newId = uuidv4();
            newConversations[newId] = {
              title: 'New Chat',
              messages: [WELCOME_MESSAGE],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setActiveConversationId(newId);
          }
        }
        
        return newConversations;
      });
    } catch (error) {
      Sentry.captureException(error);
      console.error('Failed to delete conversation:', error);
    }
  }, [activeConversationId]);

  const updateConversationTitle = useCallback((conversationId, title) => {
    try {
      setConversations(prev => ({
        ...prev,
        [conversationId]: {
          ...prev[conversationId],
          title,
          updatedAt: new Date().toISOString(),
        }
      }));
    } catch (error) {
      Sentry.captureException(error);
      console.error('Failed to update conversation title:', error);
    }
  }, []);

  const addMessageToConversation = useCallback((conversationId, message) => {
    try {
      setConversations(prev => ({
        ...prev,
        [conversationId]: {
          ...prev[conversationId],
          messages: [...(prev[conversationId]?.messages || []), message],
          updatedAt: new Date().toISOString(),
        }
      }));
    } catch (error) {
      Sentry.captureException(error);
      console.error('Failed to add message to conversation:', error);
    }
  }, []);

  const sendMessage = useCallback(async (content) => {
    try {
      if (!content.trim() || isProcessing) return;

      const messageId = uuidv4();
      const userMessage = {
        id: messageId,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      setIsProcessing(true);
      addMessageToConversation(activeConversationId, userMessage);

      // Prepare the messages for the API in the format it expects
      const apiMessages = activeConversation.messages
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      // Add the new user message
      apiMessages.push({
        role: 'user',
        content
      });

      if (useStreamingMode) {
        // Handle streaming response
        try {
          console.log('Sending streaming request to API with messages:', apiMessages);
          const response = await fetch('/api/astra', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: apiMessages,
              stream: true,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let streamedContent = '';
          const streamId = uuidv4();

          // Create an initial empty assistant message for streaming
          setStreamingMessage({
            id: streamId,
            role: 'assistant',
            content: '',
            timestamp: new Date().toISOString(),
            isStreaming: true,
          });

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim() !== '');
            
            for (const line of lines) {
              if (line === 'data: [DONE]') {
                // Streaming is complete
                break;
              }
              
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.choices && data.choices[0].delta.content) {
                    streamedContent += data.choices[0].delta.content;
                    setStreamingMessage(prev => ({
                      ...prev,
                      content: streamedContent,
                    }));
                  }
                } catch (err) {
                  console.error('Error parsing streaming data:', err);
                }
              }
            }
          }

          // Add the final complete message to the conversation
          const finalMessage = {
            id: streamId,
            role: 'assistant',
            content: streamedContent || "I'm sorry, I couldn't generate a response. Please try again.",
            timestamp: new Date().toISOString(),
          };

          addMessageToConversation(activeConversationId, finalMessage);
          setStreamingMessage(null);
        } catch (error) {
          Sentry.captureException(error);
          console.error('Error in streaming chat response:', error);
          
          // Add an error message if the streaming failed
          addMessageToConversation(activeConversationId, {
            id: uuidv4(),
            role: 'assistant',
            content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
            timestamp: new Date().toISOString(),
            isError: true,
          });
        }
      } else {
        // Handle non-streaming response
        try {
          console.log('Sending non-streaming request to API with messages:', apiMessages);
          const response = await fetch('/api/astra', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: apiMessages,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log('Received response from API:', data);
          
          const assistantMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: data.message.content,
            timestamp: new Date().toISOString(),
          };

          addMessageToConversation(activeConversationId, assistantMessage);
        } catch (error) {
          Sentry.captureException(error);
          console.error('Error in chat response:', error);
          
          // Add an error message if the request failed
          addMessageToConversation(activeConversationId, {
            id: uuidv4(),
            role: 'assistant',
            content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
            timestamp: new Date().toISOString(),
            isError: true,
          });
        }
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error('Error in sendMessage:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [activeConversationId, activeConversation, isProcessing, addMessageToConversation, useStreamingMode]);

  const clearConversation = useCallback((conversationId) => {
    try {
      setConversations(prev => ({
        ...prev,
        [conversationId]: {
          ...prev[conversationId],
          messages: [WELCOME_MESSAGE],
          updatedAt: new Date().toISOString(),
        }
      }));
    } catch (error) {
      Sentry.captureException(error);
      console.error('Failed to clear conversation:', error);
    }
  }, []);

  const value = {
    conversations,
    activeConversationId,
    activeConversation,
    isProcessing,
    streamingMessage,
    useStreamingMode,
    setUseStreamingMode,
    setActiveConversationId,
    createNewConversation,
    deleteConversation,
    updateConversationTitle,
    sendMessage,
    clearConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}