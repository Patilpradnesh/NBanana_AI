import React from 'react';
import ChatUI from '../components/ChatUI';

export const GenerateAnimation = () => {
  const handleAnimationGeneration = (message) => {
    return {
      description: message,
      duration: '5 seconds',
      style: 'smooth'
    };
  };

  return (
    <ChatUI 
      title="Animation Maker"
      apiEndpoint="/generate-animation"
      placeholder="Describe the animation you want to create..."
      onSendMessage={handleAnimationGeneration}
    />
  );
};
