export const scrollToMessage = (messageId: string) => {
  setTimeout(() => {
    const element = document.getElementById(messageId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  }, 100); // Small delay to ensure DOM is updated
};