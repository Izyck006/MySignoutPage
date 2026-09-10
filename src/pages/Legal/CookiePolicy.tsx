import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            <Link to="/" className="text-gray-500 hover:text-primary mr-6">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <Link to="/" className="text-2xl font-bold">
              <span className="text-xl font-bold text-primary">MySignout</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 prose prose-primary max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: September 2026</p>
          <p>In accordance with the <strong>NDPA</strong> and the <strong>GDPR ePrivacy Directive</strong>, this policy explains how MySignout uses cookies and similar technologies to recognize you when you visit our website.</p>
          <h2>1. What Are Cookies?</h2>
          <p>Cookies are small text files placed on your device to collect standard internet log information and visitor behavior information. When you visit our Service, we may collect information from you automatically through cookies or similar technology.</p>
          <h2>2. Types of Cookies We Use</h2>
          <p>We classify cookies into the following categories:</p>
          <ul>
            <li><strong>Strictly Necessary Cookies (No Consent Required):</strong> These cookies are essential for you to browse the website and use its features, such as accessing secure areas (e.g., Firebase Authentication sessions). The Service cannot function properly without these cookies.</li>
            <li><strong>Analytical & Performance Cookies (Consent Required):</strong> These cookies collect information about how you use a website, like which pages you visited and which links you clicked on. None of this information can be used to identify you. It is all aggregated and, therefore, anonymized.</li>
          </ul>
          <h2>3. Your Consent and Withdrawal</h2>
          <p>By law, we can store cookies on your device if they are strictly necessary for the operation of this site. For all other types of cookies, we need your explicit, informed consent.</p>
          <p>You have the right to withdraw your consent at any time. You can manage your cookie preferences or clear cookies directly through your web browser settings. Please note that disabling Strictly Necessary Cookies will prevent you from logging in and managing your sign-out page.</p>
          <h2>4. How to Manage Cookies</h2>
          <p>Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser, and from version to version. You can obtain up-to-date information about blocking and deleting cookies via your browser's official support documentation.</p>
        </div>
      </main>
    </div>
  );
}
