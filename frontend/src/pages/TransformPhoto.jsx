import React from 'react'
import ChatUI from '../components/ChatUI';

export const TransformPhoto = () => {
  const handlePhotoTransform = (message) => {
    return {
      description: message,
      era: 'Victorian era',
      style: 'vintage'
    };
  };

  return (
    <ChatUI 
      title="Time Travel Camera"
      apiEndpoint="/transform-photo"
      placeholder="Describe how you want to transform your photo through time... (Upload an image first)"
      onSendMessage={handlePhotoTransform}
      supportsFileUpload={true}
    />
  );
}