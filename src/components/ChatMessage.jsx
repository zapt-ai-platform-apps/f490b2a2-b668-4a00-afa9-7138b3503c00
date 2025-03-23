import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { motion } from 'framer-motion';
import { FaRobot } from 'react-icons/fa';

// Initialize highlight.js
hljs.configure({
  languages: ['javascript', 'typescript', 'python', 'html', 'css', 'json'],
});

export default function ChatMessage({ message, isStreaming = false }) {
  const { role, content, isError } = message;
  
  // Apply syntax highlighting to code blocks
  useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }, [content]);

  // User message in a right-aligned bubble
  if (role === 'user') {
    return (
      <motion.div 
        className="flex justify-end px-4 py-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-[85%] sm:max-w-[75%] bg-gemini-user-bubble rounded-2xl rounded-tr-sm px-4 py-3 shadow-gemini">
          <p className="text-white break-words">{content}</p>
        </div>
      </motion.div>
    );
  }

  // AI message in a left-aligned bubble with icon
  return (
    <motion.div 
      className="flex px-4 py-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start space-x-3 max-w-[85%] sm:max-w-[75%]">
        <div className="flex-shrink-0 w-8 h-8 rounded-full gemini-gradient flex items-center justify-center mt-1">
          <FaRobot className="text-white" size={16} />
        </div>
        
        <div className={`bg-gemini-ai-bubble rounded-2xl rounded-tl-sm px-4 py-3 shadow-gemini ${isStreaming ? 'typing-dots' : ''} ${isError ? 'border border-red-500' : ''}`}>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <pre className="rounded-lg bg-black bg-opacity-50 p-4 overflow-x-auto">
                      <code className={`language-${match[1]}`} {...props}>
                        {String(children).replace(/\n$/, '')}
                      </code>
                    </pre>
                  ) : (
                    <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                pre({ children }) {
                  return <div className="not-prose">{children}</div>;
                },
                p({ children }) {
                  return <p className="mb-4 last:mb-0 text-white">{children}</p>;
                },
                a({ children, href }) {
                  return (
                    <a 
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gemini-blue hover:underline"
                    >
                      {children}
                    </a>
                  );
                },
                ul({ children }) {
                  return <ul className="list-disc pl-6 mb-4 last:mb-0">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-6 mb-4 last:mb-0">{children}</ol>;
                },
                li({ children }) {
                  return <li className="mb-1 last:mb-0">{children}</li>;
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-4 border-gemini-blue pl-4 italic my-4">
                      {children}
                    </blockquote>
                  );
                },
                h1({ children }) {
                  return <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-xl font-bold mt-6 mb-3">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-lg font-bold mt-5 mb-2">{children}</h3>;
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}