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
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: input }]);
    setLoading(true);

    try {
      const res = await axios.post('/api/chat', { message: input });
      setMessages(prev => [
        ...prev,
        { from: 'nano', text: res.data && res.data.response ? res.data.response : "No response from NanoBanana." }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { from: 'nano', text: "Sorry, I couldn't get a response. Please try again." }
      ]);
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

      {/* Direct Chat Section */}
      <div className="max-w-xl mx-auto mt-16 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Chat with NanoBanana</h2>
        <div className="h-64 overflow-y-auto flex flex-col gap-2 mb-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`px-4 py-2 rounded-2xl max-w-xs text-sm
                ${msg.from === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-2xl max-w-xs text-sm bg-gray-200 text-gray-400 rounded-bl-none animate-pulse">
                NanoBanana is typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn-primary px-6 py-2 rounded-full"
            disabled={loading}
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
};

export default Home;


