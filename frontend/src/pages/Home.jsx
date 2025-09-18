import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const features = [
  {
    icon: '🎨',
    title: 'Cartoon Studio',
    desc: 'Transform your stories into beautiful comic strips with AI-powered illustration.',
    link: '/cartoon-studio'
  },
  {
    icon: '📢',
    title: 'Ad Maker AI',
    desc: 'Generate stunning advertisements from your brand description in seconds.',
    link: '/ad-maker'
  },
  {
    icon: '📷',
    title: 'Time Travel Camera',
    desc: 'Give your photos a new life by transforming them into different art styles.',
    link: '/time-travel'
  }
];

export const Home = () => {
  const [messages, setMessages] = useState([
    { from: 'nano', text: 'Hi! I am NanoBanana. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);
  const chatContainerRef = useRef(null);

  // ChatGPT-style scroll - only scroll the chat container
  const scrollToBottom = () => {
    if (shouldScroll && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      setShouldScroll(false);
    }
  };

  // Only scroll the chat container when shouldScroll is true
  useEffect(() => {
    scrollToBottom();
  }, [shouldScroll]);

  // Prevent whole page scroll on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: input }]);
    setShouldScroll(true); // Enable scroll for user message
    setLoading(true);

    try {
      const res = await axios.post('/api/chat', { message: input });
      setMessages(prev => [
        ...prev,
        { from: 'nano', text: res.data && res.data.response ? res.data.response : "No response from NanoBanana." }
      ]);
      setShouldScroll(true); // Enable scroll for bot response
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { from: 'nano', text: "Sorry, I couldn't get a response. Please try again." }
      ]);
      setShouldScroll(true); // Enable scroll for error message
    }
    setInput('');
    setLoading(false);
  };

  return (
    <main className="page-content">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
          Welcome to Nano Banana AI
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Unleash your creativity with AI-powered tools for cartoons, ads, and photo transformations.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f) => (
          <a
            key={f.title}
            href={f.link}
            className="card hover:scale-105 transition-transform duration-200 flex flex-col items-center text-center p-8 rounded-2xl shadow-lg bg-white group"
          >
            <div className="text-5xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-blue-700 group-hover:text-blue-900">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </a>
        ))}
      </div>

      {/* ChatGPT-Style Chat Section */}
      <div className="max-w-4xl mx-auto mt-16 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col" style={{ height: '500px' }}>
        {/* Fixed Chat Header */}
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-blue-700 flex items-center">
            <span className="mr-3">🤖</span>
            Chat with NanoBanana
          </h2>
          <p className="text-sm text-blue-600 mt-1">Powered by Google Gemini AI</p>
        </div>

        {/* Scrollable Messages Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          style={{ maxHeight: '350px' }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm
                ${msg.from === 'user'
                  ? 'bg-blue-500 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                }`}
              >
                <div className="text-sm leading-relaxed">{msg.text}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">NanoBanana is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
          <form onSubmit={sendMessage} className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Ask NanoBanana anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(e);
                  }
                }}
                disabled={loading}
                rows="1"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-3 rounded-2xl transition-colors duration-200 disabled:cursor-not-allowed"
              disabled={loading || !input.trim()}
            >
              ➤
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Home;


