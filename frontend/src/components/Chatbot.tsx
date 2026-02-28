import { useState, useRef, useEffect } from 'react';
import { X, MessageCircle, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your ASTU Complaint Assistant. I can help you with:\n\n• Understanding how to submit complaints\n• Checking complaint status\n• Finding the right category\n• General questions about the system\n\nHow can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Resize state
  const [size, setSize] = useState({ width: 500, height: 650 });
  const position = { bottom: 20, right: 24 };
  const chatRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://smart-complaint-issue-tracking-system.onrender.com/api'}/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.data.response }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again or contact support.' 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I\'m having trouble connecting. Please try again later.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Resize handlers - Only corners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current || !chatRef.current) return;

      const direction = resizingRef.current;
      const rect = chatRef.current.getBoundingClientRect();
      
      setSize(prev => {
        let newWidth = prev.width;
        let newHeight = prev.height;

        // Handle corner resizing (both width and height)
        if (direction === 'top-left') {
          newWidth = Math.max(350, Math.min(800, rect.right - e.clientX));
          newHeight = Math.max(400, Math.min(900, rect.bottom - e.clientY));
        } else if (direction === 'top-right') {
          newWidth = Math.max(350, Math.min(800, e.clientX - rect.left));
          newHeight = Math.max(400, Math.min(900, rect.bottom - e.clientY));
        } else if (direction === 'bottom-left') {
          newWidth = Math.max(350, Math.min(800, rect.right - e.clientX));
          newHeight = Math.max(400, Math.min(900, e.clientY - rect.top));
        } else if (direction === 'bottom-right') {
          newWidth = Math.max(350, Math.min(800, e.clientX - rect.left));
          newHeight = Math.max(400, Math.min(900, e.clientY - rect.top));
        }

        return { width: newWidth, height: newHeight };
      });
    };

    const handleMouseUp = () => {
      resizingRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startResize = (direction: string) => {
    resizingRef.current = direction;
    document.body.style.userSelect = 'none';
    // Set cursor based on corner direction
    if (direction === 'top-left' || direction === 'bottom-right') {
      document.body.style.cursor = 'nwse-resize';
    } else if (direction === 'top-right' || direction === 'bottom-left') {
      document.body.style.cursor = 'nesw-resize';
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 z-50"
          title="Chat with AI Assistant"
        >
          <MessageCircle size={28} strokeWidth={2.5} />
        </button>
      )}

      {/* Chat Window - Resizable on all corners and edges */}
      {isOpen && (
        <div 
          ref={chatRef}
          className="fixed bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-blue-500/20"
          style={{
            bottom: `${position.bottom}px`,
            right: `${position.right}px`,
            width: `${size.width}px`,
            height: `${size.height}px`,
            maxHeight: 'calc(100vh - 120px)'
          }}
        >
          {/* Resize handles - Only 4 Corners (visible on border) */}
          <div 
            className="absolute top-0 left-0 w-8 h-8 cursor-nwse-resize z-20 group"
            onMouseDown={() => startResize('top-left')}
            title="Resize"
          >
            <div className="absolute top-0 left-0 w-3 h-3 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl opacity-60 group-hover:opacity-100 group-hover:border-blue-600 transition-all" />
          </div>
          <div 
            className="absolute top-0 right-0 w-8 h-8 cursor-nesw-resize z-20 group"
            onMouseDown={() => startResize('top-right')}
            title="Resize"
          >
            <div className="absolute top-0 right-0 w-3 h-3 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl opacity-60 group-hover:opacity-100 group-hover:border-blue-600 transition-all" />
          </div>
          <div 
            className="absolute bottom-0 left-0 w-8 h-8 cursor-nesw-resize z-20 group"
            onMouseDown={() => startResize('bottom-left')}
            title="Resize"
          >
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl opacity-60 group-hover:opacity-100 group-hover:border-blue-600 transition-all" />
          </div>
          <div 
            className="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize z-20 group"
            onMouseDown={() => startResize('bottom-right')}
            title="Resize"
          >
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-4 border-r-4 border-blue-500 rounded-br-2xl opacity-60 group-hover:opacity-100 group-hover:border-blue-600 transition-all" />
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <MessageCircle size={20} />
              </div>
              <div>
                <span className="font-bold block">ASTU AI Assistant</span>
                <span className="text-xs text-white/90">Powered by Gemini AI</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-white/20 p-2 rounded-full transition-colors flex-shrink-0"
              title="Close chat"
            >
              <X size={22} strokeWidth={2.5} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm' 
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-600 rounded-bl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl rounded-bl-sm border-2 border-gray-200 dark:border-gray-600 shadow-md">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && input.trim() && sendMessage()}
                placeholder="Ask me anything about ASTU..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all placeholder-gray-400"
                disabled={loading}
              />
              <button
                onClick={sendMessage} 
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-5 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
