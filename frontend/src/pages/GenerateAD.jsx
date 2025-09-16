import React from 'react'


export const GenerateAD = () => {
  const handleAdGeneration = (message) => {
    return {
      product: message,
      targetAudience: 'general audience',
      adType: 'social media'
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
