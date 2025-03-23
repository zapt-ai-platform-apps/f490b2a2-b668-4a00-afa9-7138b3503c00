import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { FaRobot, FaUser } from 'react-icons/fa';

// Initialize highlight.js
hljs.configure({
  languages: ['javascript', 'typescript', 'python', 'html', 'css', 'json'],
});

export default function ChatMessage({ message, isStreaming = false }) {
  const { role, content, isError } = message;
  
  // Format the timestamp to a readable format
  const formattedTime = message.timestamp 
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  // Apply syntax highlighting to code blocks
  useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }, [content]);

  return (
    <div className={`flex w-full py-4 ${role === 'assistant' ? 'bg-gray-900 bg-opacity-30' : ''}`}>
      <div className="max-w-4xl mx-auto flex w-full px-4 sm:px-6 space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {role === 'assistant' ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 flex items-center justify-center text-white">
              <FaRobot />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white">
              <FaUser />
            </div>
          )}
        </div>
        
        {/* Message content */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center">
            <h4 className="font-semibold text-sm text-gray-100">
              {role === 'assistant' ? 'Astra' : 'You'}
            </h4>
            <span className="ml-2 text-xs text-gray-400">
              {formattedTime}
            </span>
          </div>
          
          <div className={`prose prose-invert max-w-none ${isError ? 'text-red-400' : ''} ${isStreaming ? 'animate-pulse' : ''}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <pre className="rounded-md bg-gray-800 p-4 overflow-x-auto">
                      <code className={`language-${match[1]}`} {...props}>
                        {String(children).replace(/\n$/, '')}
                      </code>
                    </pre>
                  ) : (
                    <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                pre({ children }) {
                  return <div className="not-prose">{children}</div>;
                },
                p({ children }) {
                  return <p className="mb-4 last:mb-0">{children}</p>;
                },
                a({ children, href }) {
                  return (
                    <a 
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
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
                    <blockquote className="border-l-4 border-gray-700 pl-4 italic my-4">
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
    </div>
  );
}