import React from 'react';

export const DebugRenderer: React.FC = () => {
  React.useEffect(() => {
    console.log('DebugRenderer mounted - CSS variables check:');
    console.log('Background:', getComputedStyle(document.documentElement).getPropertyValue('--background'));
    console.log('Foreground:', getComputedStyle(document.documentElement).getPropertyValue('--foreground'));
    console.log('Primary:', getComputedStyle(document.documentElement).getPropertyValue('--primary'));
    console.log('Document body classes:', document.body.className);
    console.log('Document body computed styles:', window.getComputedStyle(document.body));
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      zIndex: 9999, 
      background: 'red', 
      color: 'white', 
      padding: '10px',
      fontSize: '12px'
    }}>
      Debug: Renderer Active - Check Console
    </div>
  );
};