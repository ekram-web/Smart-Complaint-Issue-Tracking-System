import { useState, useRef, useEffect } from 'react';
import { X, MessageCircle, Send, Maximize2, Minimize2 } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const systemInstruction = `You are an AI assistant for the ASTU (Adama Science and Technology University) Smart Complaint System.

Your role is to help students, staff, and administrators understand and use the complaint management system effectively.

System Information:
- Categories: Dormitory, Laboratory, Internet, Classroom, Library
- User Roles: Student (submit complaints), Staff (manage complaints), Admin (full access)
- Ticket Status: OPEN, IN_PROGRESS, RESOLVED
- Priority Levels: LOW, MEDIUM, HIGH
- Features: Create tickets, track status, file attachments, notifications, remarks

Guidelines:
- Be helpful, friendly, and professional
- Keep responses concise (2-3 paragraphs max)
- Use bullet points for lists
- Focus on ASTU complaint system features
- If asked about unrelated topics, politely redirect to complaint system topics`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Resize state
  const [size, setSize] = useState({ width: 500, height: 650 });
  const position = { bottom: 20, right: 24 };
  const chatRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef<string | null>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: Date.now(),
        role: 'assistant',
        content: 'Hi! 👋 I\'m your ASTU Complaint Assistant powered by Gemini AI. I can help you with:\n\n• Understanding how to submit complaints\n• Checking complaint status\n• Finding the right category\n• General questions about the system\n\nHow can I help you today?'
      }]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Resize handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current || !chatRef.current) return;

      const direction = resizingRef.current;
      const rect = chatRef.current.getBoundingClientRect();
      
      setSize(prev => {
        let newWidth = prev.width;
        let newHeight = prev.height;

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
    if (direction === 'top-left' || direction === 'bottom-right') {
      document.body.style.cursor = 'nwse-resize';
    } else if (direction === 'top-right' || direction === 'bottom-left') {
      document.body.style.cursor = 'nesw-resize';
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { 
      id: Date.now(), 
      role: 'user', 
      content: input 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Prepare conversation history (last 10 messages)
    const historyForApi = messages.slice(-10).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Add system instruction as first message if this is the first user message
    const systemMessages = historyForApi.length === 0 ? [
      {
        role: 'user',
        parts: [{ text: systemInstruction }]
      },
      {
        role: 'model',
        parts: [{ text: 'Understood! I will help users with the ASTU Smart Complaint System following those guidelines.' }]
      }
    ] : [];

    const currentUserMessage = {
      role: 'user',
      parts: [{ text: userMessage.content }]
    };

    const requestContents = [...systemMessages, ...historyForApi, currentUserMessage];

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: requestContents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      });

      const data = await response.json();
      
      let botText = 'Sorry, I couldn\'t get a response. Please try again.';
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        botText = data.candidates[0].content.parts[0].text;
      }

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: botText 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: 'Error: Could not reach Gemini API. Please try again later.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      setSize({ width: Math.min(window.innerWidth * 0.7, 800), height: window.innerHeight * 0.8 });
    } else {
      setSize({ width: 500, height: 650 });
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

      {/* Chat Window */}
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
          {/* Resize handles - Only 4 Corners */}
          <div className="absolute top-0 left-0 w-8 h-8 cursor-nwse-resize z-20 group" onMouseDown={() => startResize('top-left')} title="Resize">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl opacity-60 group-hover:opacity-100 group-hover:border-blue-600 transition-all" />
          </div>
          <div className="absolute top-0 right-0 w-8 h-8 cursor-nesw-resize z-20 group" onMouseDown={() => startResize('top-right')} title="Resize">
            <div className="absolute top-0 right-0 w-3 h-3 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl opacity-60 group-hover:opacity-100 group-hover:border-blue-600 transition-all" />
          </div>
          <div className="absolute bottom-0 left-0 w-8 h-8 cursor-nesw-resize z-20 group" onMouseDown={() => startResize('bottom-left')} title="Resize">
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl opacity-60 group-hover:opacity-100 group-hover:border-blue-600 transition-all" />
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize z-20 group" onMouseDown={() => startResize('bottom-right')} title="Resize">
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
            <div className="flex gap-2">
              <button 
                onClick={toggleMaximize} 
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
                title={isMaximized ? "Minimize" : "Maximize"}
              >
                {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/20 p-2 rounded-full transition-colors flex-shrink-0"
                title="Close chat"
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl shadow-md whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm' 
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-600 rounded-bl-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
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
            <div ref={messagesEndRef} />
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
