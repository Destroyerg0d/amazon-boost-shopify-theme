import { useState, useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: any;
  }
}

interface TawkToChatProps {
  isVisible: boolean;
  onClose?: () => void;
}

export const TawkToChat = ({ isVisible, onClose }: TawkToChatProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isVisible && !isLoaded) {
      // Load Tawk.to script only when needed
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://embed.tawk.to/686fb567ac7f85190afa5c45/1ivq5p7u5';
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      
      script.onload = () => {
        setIsLoaded(true);
        
        // Initialize Tawk API with a slight delay to prevent blocking
        setTimeout(() => {
          window.Tawk_API = window.Tawk_API || {};
          window.Tawk_LoadStart = new Date();
          
          // Show the chat when loaded
          if (window.Tawk_API) {
            window.Tawk_API.onLoad = function() {
              window.Tawk_API.showWidget();
              window.Tawk_API.maximize();
            };
            
            // Handle chat close
            window.Tawk_API.onChatEnded = function() {
              if (onClose) {
                onClose();
              }
            };
            
            // Hide widget when minimized to prevent background interference
            window.Tawk_API.onChatMinimized = function() {
              window.Tawk_API.hideWidget();
              if (onClose) {
                onClose();
              }
            };
          }
        }, 100);
      };
      
      // Add script to head with requestIdleCallback for better performance
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          const firstScript = document.getElementsByTagName('script')[0];
          if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(script, firstScript);
          }
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          const firstScript = document.getElementsByTagName('script')[0];
          if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(script, firstScript);
          }
        }, 100);
      }
    } else if (!isVisible && isLoaded && window.Tawk_API) {
      // Hide the chat widget when not visible
      window.Tawk_API.hideWidget();
    } else if (isVisible && isLoaded && window.Tawk_API) {
      // Show the chat widget when visible
      window.Tawk_API.showWidget();
      window.Tawk_API.maximize();
    }
  }, [isVisible, isLoaded, onClose]);

  // This component doesn't render anything visible
  return null;
};