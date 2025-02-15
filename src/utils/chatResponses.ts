export const generateResponse = (message: string): string | JSX.Element => {
  const lowercaseMessage = message.toLowerCase();
  
  if (lowercaseMessage.includes('show all products')) {
    return 'Great choice! We\'ve displayed some top-notch shirts on your screen that are perfect for outdoor events\n<product-grid>';
  }
  
  return `You said: ${message}`;
};