import React from 'react';

export const SimpleDebug: React.FC = () => {
  React.useEffect(() => {
    console.log('=== DEBUG INFO ===');
    console.log('CSS Variables:');
    const root = document.documentElement;
    console.log('--background:', getComputedStyle(root).getPropertyValue('--background'));
    console.log('--foreground:', getComputedStyle(root).getPropertyValue('--foreground'));
    console.log('Body styles:', window.getComputedStyle(document.body));
    console.log('Body classes:', document.body.className);
    console.log('=================');
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'red', 
      color: 'white', 
      padding: '5px',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      DEBUG ACTIVE
    </div>
  );
};