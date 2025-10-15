import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatUI = ({ title, apiEndpoint, placeholder, onSendMessage, supportsFileUpload = false }) => {
  // Define context-specific instructions for each feature
  const getContextualInstructions = () => {
    const instructions = {
      '/chat': {
        welcome: `Welcome to ${title}! I'm your AI assistant powered by Google Gemini. I can help you with general questions, creative writing, problem-solving, and much more. Just ask me anything!`,
        guidance: `💡 How to use this chat:\n• Ask me any question in natural language\n• I can help with coding, writing, math, explanations, and creative tasks\n• Feel free to have a normal conversation - I remember our chat history\n• Type your message and press Enter to send`
      },
      '/generate-image': {
        welcome: `Welcome to ${title}! I provide detailed creative visualizations and image concepts.`,
        guidance: `🎨 How to use Image Generator:\n• Describe the image you want in detail (e.g., "a sunset over mountains with purple clouds")\n• Be specific about style, colors, mood, and elements\n• You can ask for different art styles like "photorealistic", "cartoon", "oil painting", etc.\n• I'll provide vivid, detailed descriptions that paint a picture with words\n• Note: Currently providing creative visualizations (actual image generation requires paid AI services)`
      },
      '/generate-animation': {
        welcome: `Welcome to ${title}! I create detailed animation concepts and descriptions for you.`,
        guidance: `🎬 How to use Animation Generator:\n• Describe the animation or video concept you want\n• Include details about characters, scenes, movements, and duration\n• Specify animation style (2D, 3D, cartoon, realistic, etc.)\n• I'll provide detailed animation concepts and scene descriptions\n• You can build upon previous ideas in our conversation`
      },
      '/cartoon-story': {
        welcome: `Welcome to ${title}! I'm your creative storyteller for cartoon and animated stories.`,
        guidance: `📚 How to use Cartoon Story Creator:\n• Tell me what kind of story you want (adventure, comedy, educational, etc.)\n• Mention target audience (kids, teens, adults)\n• Describe main characters or let me create them\n• I'll craft engaging stories with dialogue and scenes\n• We can develop stories together through our conversation`
      },
      '/generate-ad': {
        welcome: `Welcome to ${title}! I'm your marketing assistant for creating compelling advertisements.`,
        guidance: `📢 How to use Ad Maker:\n• Describe your product, service, or brand\n• Mention your target audience and goals\n• Specify ad type (social media, print, video script, etc.)\n• I'll create persuasive ad copy and marketing concepts\n• We can refine and adapt ads through our conversation`
      },
      '/transform-photo': {
        welcome: `Welcome to ${title}! I provide professional photo transformation analysis and guides.`,
        guidance: `📸 How to use Time Travel Camera:\n• Upload an image using the 📎 button\n• Describe the era you want (Victorian, Medieval, 1920s, etc.)\n• Specify the style (vintage, sepia, artistic, etc.)\n• I'll provide detailed transformation analysis and step-by-step guides\n• Note: Currently providing expert transformation analysis (actual photo editing requires image editing software or paid AI services)`
      }
    };
    
    return instructions[apiEndpoint] || instructions['/chat'];
  };

  const contextInfo = getContextualInstructions();
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: contextInfo.welcome,
      timestamp: new Date()
    },
    {
      id: 2,
      type: 'bot',
      content: contextInfo.guidance,
      timestamp: new Date(),
      isInstructions: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  // ChatGPT-style scroll - only scroll the messages container
  const scrollToBottom = () => {
    if (shouldScroll && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      setShouldScroll(false);
    }
  };

  // Only scroll the chat container when shouldScroll is true
  useEffect(() => {
    scrollToBottom();
  }, [shouldScroll]);

  // Prevent whole page scroll, only reset chat container
  useEffect(() => {
    // Keep page at top but don't affect chat container
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
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
    setShouldScroll(true); // Enable scroll for new user message
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
        
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api${apiEndpoint}`, requestData, config);
      
      // Handle different response types (text or image)
      let botMessage;
      if (response.data.type === 'image' && response.data.data.startsWith('data:')) {
        // Actual image was generated
        botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.data.message || 'Here\'s your generated image!',
          timestamp: new Date(),
          hasGeneratedImage: true,
          generatedImageUrl: response.data.data,
          model: response.data.model || 'Unknown'
        };
      } else {
        // Text response (description or other content)
        const content = response.data.data || response.data.body || response.data.response || 'Generated successfully!';
        const noteMsg = response.data.note ? `\n\n📝 Note: ${response.data.note}` : '';
        
        botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: content + noteMsg,
          timestamp: new Date(),
          isTextFallback: response.data.type === 'text' && response.data.note
        };
      }

      setMessages(prev => [...prev, botMessage]);
      setShouldScroll(true); // Enable scroll for bot response
    } catch (error) {
      console.error('API Error:', error);
      
      // Get error message from response
      let errorMsg = 'Sorry, something went wrong. Please try again.';
      
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.details) {
        errorMsg = error.response.data.details;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      // Special handling for common errors
      if (errorMsg.includes('overloaded') || errorMsg.includes('503')) {
        errorMsg = '🤖 AI service is temporarily overloaded. I\'m automatically retrying... Please wait a moment and try again.';
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: errorMsg,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setShouldScroll(true); // Enable scroll for error message
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
      {/* Fixed Header - Like ChatGPT */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-5 shadow-sm flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
            🤖
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by Google Gemini AI
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Messages Area - ChatGPT Style */}
      <div 
        ref={messagesContainerRef} 
        className="flex-1 overflow-y-auto px-6 py-4 space-y-6 min-h-0"
        style={{ 
          maxHeight: 'calc(100vh - 180px)',
          scrollBehavior: 'smooth'
        }}
      >
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
                    : message.isInstructions
                      ? 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 text-gray-800 dark:bg-gradient-to-r dark:from-green-900/20 dark:to-blue-900/20 dark:border-green-700 dark:text-gray-200'
                      : message.isTextFallback
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 text-gray-800 dark:bg-gradient-to-r dark:from-yellow-900/20 dark:to-orange-900/20 dark:border-yellow-700 dark:text-gray-200'
                        : 'bg-white border border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              }`}>
                {/* Special styling for instruction messages */}
                {message.isInstructions && (
                  <div className="flex items-center mb-3 space-x-2">
                    <span className="text-xl">📋</span>
                    <span className="font-semibold text-green-700 dark:text-green-300">Instructions</span>
                  </div>
                )}
                
                {/* Special styling for text fallback messages */}
                {message.isTextFallback && (
                  <div className="flex items-center mb-3 space-x-2">
                    <span className="text-xl">📝</span>
                    <span className="font-semibold text-yellow-700 dark:text-yellow-300">Image Description</span>
                  </div>
                )}
                
                {/* Special styling for successful image generation */}
                {message.hasGeneratedImage && message.model && (
                  <div className="flex items-center mb-3 space-x-2">
                    <span className="text-xl">🎨</span>
                    <span className="font-semibold text-purple-700 dark:text-purple-300">Generated with {message.model}</span>
                  </div>
                )}
                
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
                
                {/* Generated image for bot messages */}
                {message.hasGeneratedImage && message.generatedImageUrl && (
                  <div className="mb-3">
                    <img 
                      src={message.generatedImageUrl} 
                      alt="Generated Image" 
                      className="max-w-lg max-h-96 rounded-lg object-contain shadow-lg"
                    />
                  </div>
                )}
                
                <div className={`${message.isInstructions ? 'text-sm leading-relaxed' : 'whitespace-pre-wrap text-sm leading-relaxed'}`}>
                  {message.content}
                </div>
                <div className={`text-xs mt-3 opacity-75 ${
                  message.type === 'user' 
                    ? 'text-blue-100' 
                    : message.isInstructions 
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
              <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Input Area - Like ChatGPT */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-5 shadow-sm flex-shrink-0">
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
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-2xl p-3 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 disabled:hover:scale-100"
            title="Send message"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;