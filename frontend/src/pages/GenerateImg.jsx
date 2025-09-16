import React from 'react'


export const GenerateImg = () => {
  const handleImageGeneration = (message) => {
    return {
      prompt: message,
      style: 'realistic',
      aspectRatio: '1:1'
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