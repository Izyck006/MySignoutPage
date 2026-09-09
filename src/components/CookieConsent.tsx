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
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 p-4 transform transition-transform duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-3">
          <Cookie className="text-primary shrink-0 mt-1 md:mt-0" size={24} />
          <p className="text-sm text-gray-700">
            We use cookies to improve your experience and for analytics. By continuing to use this site, you agree to our{' '}
            <Link to="/cookies" className="text-primary hover:underline font-medium">Cookie Policy</Link>.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
          <button 
            onClick={rejectCookies}
            className="flex-1 md:flex-none bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors font-medium text-sm whitespace-nowrap"
          >
            Reject All
          </button>
          <button 
            onClick={acceptCookies}
            className="flex-1 md:flex-none bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium text-sm whitespace-nowrap"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
