import React from "react";

interface ThemeScriptProps {
  storageKey?: string;
}

// This script runs before the React app is hydrated
// It prevents the flash of incorrect theme
export function ThemeScript({
  storageKey = "cloudnow-ui-theme",
}: ThemeScriptProps) {
  const themeScript = `
    (function() {
      try {
        const storageKey = '${storageKey}';
        const savedTheme = localStorage.getItem(storageKey);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let theme = 'light';
        
        if (savedTheme === 'dark' || (savedTheme === 'system' && systemPrefersDark) || (!savedTheme && systemPrefersDark)) {
          theme = 'dark';
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        document.documentElement.style.colorScheme = theme;
      } catch (e) {
        console.error('Theme initialization failed:', e);
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}



