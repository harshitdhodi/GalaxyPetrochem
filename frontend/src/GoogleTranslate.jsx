import React, { useEffect } from 'react';
import google from "./assets/google.png"; // Adjust the path as necessary

const GoogleTranslate = () => {
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (!document.querySelector('script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]')) {
        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);

        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,fr,de,es,hi,zh-CN',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false, // This will prevent the top navbar from showing
            },
            'google_translate_element'
          );
        };
      }
    };

    addGoogleTranslateScript();
  }, []);

  return (
    <div className="flex items-center border space-x-2">
      {/* Image first */}
      {/* <img src={google} alt="Translate Icon" className="w-6 h-6" /> */}
      
      {/* Google Translate Dropdown */}
      <div id="google_translate_element"></div>
    </div>
  );
};

export default GoogleTranslate;
