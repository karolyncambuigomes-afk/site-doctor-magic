import { Plugin } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

interface CriticalCSSOptions {
  criticalCSS: string;
  outputPath?: string;
}

export function criticalCSSPlugin(options: CriticalCSSOptions): Plugin {
  return {
    name: 'critical-css',
    generateBundle(outputOptions, bundle) {
      // Find the main CSS file
      const cssFiles = Object.keys(bundle).filter(fileName => 
        fileName.endsWith('.css') && bundle[fileName].type === 'asset'
      );

      if (cssFiles.length > 0) {
        const mainCSSFile = cssFiles[0];
        const cssAsset = bundle[mainCSSFile] as any;
        
        // Remove critical CSS from the main bundle
        if (cssAsset && typeof cssAsset.source === 'string') {
          // This is a simplified approach - in production you'd want more sophisticated parsing
          try {
            const criticalCSS = readFileSync(resolve(options.criticalCSS), 'utf-8');
            // Store critical CSS for HTML injection
            (this as any).criticalCSS = criticalCSS;
          } catch (error) {
            console.warn('Could not read critical CSS file:', error);
          }
        }
      }
    },
    transformIndexHtml(html, context) {
      if ((this as any).criticalCSS) {
        const criticalCSS = (this as any).criticalCSS;
        
        // Inject critical CSS inline
        const inlineCSSTag = `<style>${criticalCSS}</style>`;
        
        // Insert before closing </head> tag
        html = html.replace('</head>', `${inlineCSSTag}\n</head>`);
        
        // Add preload for non-critical CSS
        const preloadTags = `
          <link rel="preload" href="/src/styles/components.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
          <link rel="preload" href="/src/styles/utilities.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
          <noscript>
            <link rel="stylesheet" href="/src/styles/components.css">
            <link rel="stylesheet" href="/src/styles/utilities.css">
          </noscript>
        `;
        
        html = html.replace('</head>', `${preloadTags}\n</head>`);
      }
      
      return html;
    }
  };
}