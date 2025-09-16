import React from 'react'


export const CartoonStory = () => {
  const handleCartoonGeneration = (message) => {
    return {
      theme: message,
      characters: 'create suitable characters',
      setting: 'appropriate setting'
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