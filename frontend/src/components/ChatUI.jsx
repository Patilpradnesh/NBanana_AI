import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatUI = ({ title, apiEndpoint, placeholder, onSendMessage, supportsFileUpload = false }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Welcome to ${title}! How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    if (hasNewMessage && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setHasNewMessage(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [hasNewMessage]);

  // Scroll to top on component mount and reset scroll
  useEffect(() => {
    window.scrollTo(0, 0);
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedFile) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage || 'Uploaded an image',
      timestamp: new Date(),
      hasImage: !!selectedFile,
      imageUrl: previewUrl
    };

    setMessages(prev => [...prev, userMessage]);
    setHasNewMessage(true); // Trigger scroll for user message
    const currentInput = inputMessage;
    const currentFile = selectedFile;
    setInputMessage('');
    removeSelectedFile();
    setIsLoading(true);

    try {
      // Prepare FormData for file upload if needed
      let requestData;
      if (currentFile && supportsFileUpload) {
        const formData = new FormData();
        formData.append('image', currentFile);
        formData.append('description', currentInput);
        // Add other data from onSendMessage handler
        const apiData = onSendMessage(currentInput);
        Object.keys(apiData).forEach(key => {
          if (key !== 'description') {
            formData.append(key, apiData[key]);
          }
        });
        requestData = formData;
      } else {
        // Regular JSON request
        requestData = onSendMessage(currentInput);
      }
      
      // Call the API
      const config = currentFile && supportsFileUpload ? 
        { headers: { 'Content-Type': 'multipart/form-data' } } : 
        { headers: { 'Content-Type': 'application/json' } };
        
      const response = await axios.post(`/api${apiEndpoint}`, requestData, config);
      
      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.data || response.data.body || response.data.response || 'Generated successfully!',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setHasNewMessage(true); // Trigger scroll for bot message
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Sorry, I encountered an error: ${error.response?.data?.details || error.message}`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setHasNewMessage(true); // Trigger scroll for error message
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            🤖
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI-powered assistance
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex space-x-3 max-w-4xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-blue-500' 
                  : message.isError 
                    ? 'bg-red-500' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}>
                {message.type === 'user' ? '👤' : '🤖'}
              </div>

              {/* Message Content */}
              <div className={`rounded-2xl px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.isError
                    ? 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
                    : 'bg-white border border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              }`}>
                {/* Image preview for user messages */}
                {message.hasImage && message.imageUrl && (
                  <div className="mb-3">
                    <img 
                      src={message.imageUrl} 
                      alt="Uploaded" 
                      className="max-w-xs max-h-48 rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                <div className={`text-xs mt-2 opacity-70 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-4xl">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                🤖
              </div>
              <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        {/* File Preview */}
        {selectedFile && previewUrl && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Image:</span>
              <button
                onClick={removeSelectedFile}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕ Remove
              </button>
            </div>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-32 max-h-32 rounded object-cover"
            />
          </div>
        )}
        
        <div className="flex items-end space-x-3">
          {/* File Upload Button (only show if supportsFileUpload) */}
          {supportsFileUpload && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-2xl p-3 transition-colors duration-200"
                disabled={isLoading}
              >
                📎
              </button>
            </div>
          )}
          
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              rows="1"
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={isLoading || (!inputMessage.trim() && !selectedFile)}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl p-3 transition-colors duration-200"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;