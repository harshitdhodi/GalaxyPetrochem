// src/components/CriticalStyles.jsx
import React from 'react';
import { useEffect } from 'react';

// This component helps manage non-critical CSS loading
const CriticalStyles = () => {
  useEffect(() => {
    // Function to load non-critical CSS
    const loadNonCriticalCSS = () => {
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = '/assets/main-CWvWm5OF.css'; // Update with your CSS filename
      linkElement.media = 'all';
      document.head.appendChild(linkElement);
    };

    // Option 1: Load CSS after initial paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        loadNonCriticalCSS();
      });
    });

    // Option 2: Load CSS when page becomes idle
    // if ('requestIdleCallback' in window) {
    //   window.requestIdleCallback(loadNonCriticalCSS);
    // } else {
    //   setTimeout(loadNonCriticalCSS, 1000);
    // }
  }, []);

  return null;
};

export default CriticalStyles;

// Then add this component to your App.jsx
// import CriticalStyles from './components/CriticalStyles';
// <CriticalStyles />