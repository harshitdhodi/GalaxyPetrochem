import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useDocumentTitle = (defaultTitle) => {
  const location = useLocation();

  useEffect(() => {
    // Logic to determine the title based on the current path
    const path = location.pathname;
    let title = defaultTitle;

    if (path.includes('product')) {
      title = 'Product Details';
    } else if (path.includes('blog')) {
      title = 'Blog';
    } else if (path.includes('contact')) {
      title = 'Contact Us';
    }
    // Add more conditions as needed

    document.title = title;
  }, [location, defaultTitle]);
};

export default useDocumentTitle;