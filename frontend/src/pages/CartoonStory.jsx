import React from 'react';
import ChatUI from '../components/ChatUI';

export const CartoonStory = () => {
  const handleCartoonGeneration = (message) => {
    return {
      storyText: message
    };
  };

  return (
    <ChatUI 
      title="Cartoon Studio"
      apiEndpoint="/cartoon-story"
      placeholder="Describe your cartoon story theme..."
      onSendMessage={handleCartoonGeneration}
    />
  );
}