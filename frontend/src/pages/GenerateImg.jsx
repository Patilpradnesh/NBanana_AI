import React from 'react'
import ChatUI from '../components/ChatUI';

export const GenerateImg = () => {
  const handleImageGeneration = (message) => {
    return {
      prompt: message
    };
  };

  return (
    <ChatUI 
      title="AI Image Generator"
      apiEndpoint="/generate-image"
      placeholder="Describe the image you want to generate..."
      onSendMessage={handleImageGeneration}
    />
  );
}