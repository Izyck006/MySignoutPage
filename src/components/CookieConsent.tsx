import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4 transform transition-transform duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <Cookie className="text-primary shrink-0 mt-1 sm:mt-0" size={24} />
          <p className="text-sm text-gray-700">
            We use cookies to improve your experience and for analytics. By continuing to use this site, you agree to our{' '}
            <Link to="/cookies" className="text-primary hover:underline font-medium">Cookie Policy</Link>.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button 
            onClick={acceptCookies}
            className="flex-1 sm:flex-none bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium text-sm whitespace-nowrap"
          >
            Accept
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
