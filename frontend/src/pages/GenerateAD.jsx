import React from 'react';
import ChatUI from '../components/ChatUI';

export const GenerateAD = () => {
  const handleAdGeneration = (message) => {
    return {
      product: message,
      brand: 'Your Brand'
    };
  };

  return (
    <ChatUI 
      title="Ad Maker AI"
      apiEndpoint="/generate-ad"
      placeholder="Describe your product or service for ad creation..."
      onSendMessage={handleAdGeneration}
    />
  );
}
