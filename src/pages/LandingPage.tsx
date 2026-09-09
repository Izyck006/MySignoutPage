import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, PenTool, Globe, Shield, ChevronDown } from 'lucide-react';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
                <span>MySignout</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-600 hover:text-primary font-medium transition-colors">About</a>
              <a href="#features" className="text-gray-600 hover:text-primary font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary font-medium transition-colors">How it works</a>
              <a href="#faq" className="text-gray-600 hover:text-primary font-medium transition-colors">FAQ</a>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-primary font-medium hover:text-primary/80 transition-colors">
                Log in
              </Link>
              <Link 
                to="/register" 
                className="bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-sm"
              >
                Create page
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <button 
                onClick={toggleMenu}
                className="text-gray-600 hover:text-primary focus:outline-none p-2"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200">
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              <a href="#about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md" onClick={toggleMenu}>About</a>
              <a href="#features" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md" onClick={toggleMenu}>Features</a>
              <a href="#how-it-works" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md" onClick={toggleMenu}>How it works</a>
              <a href="#faq" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md" onClick={toggleMenu}>FAQ</a>
              
              <div className="pt-4 flex flex-col gap-3 px-3">
                <Link to="/login" className="text-center w-full py-2.5 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50">Log in</Link>
                <Link to="/register" className="text-center w-full py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary/90">Create page</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-white pt-20 pb-32 overflow-hidden" id="about">
          <div className="absolute inset-0 bg-secondary/10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-extrabold text-primary tracking-tight mb-6">
                The Ultimate Sign-Out.<br/>
                <span className="text-primary">Your Final Year.</span><br/>
                <span className="text-primary/80">Your Digital White Shirt.</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed mb-10">
                Take the legendary Nigerian university sign-out tradition to the cloud. Get your interactive 3D white shirt, share your link, and collect permanent digital signatures from your coursemates and friends!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register" className="bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Start your page
                </Link>
                <a href="#how-it-works" className="bg-white text-primary border border-gray-200 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                  See how it works
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-primary sm:text-4xl">The Ultimate Digital Sign-Out Experience</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                Keep your white shirt pristine forever. Transition the legendary sign-out day to a permanent digital archive.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-secondary/30 rounded-xl flex items-center justify-center mb-6">
                  <PenTool className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Digital White Shirt</h3>
                <p className="text-gray-600 leading-relaxed">
                  Share your link and let your coursemates "sign your shirt" virtually with different marker colors, leaving permanent memories.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-secondary/30 rounded-xl flex items-center justify-center mb-6">
                  <Globe className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sign from Anywhere</h3>
                <p className="text-gray-600 leading-relaxed">
                  Friends missed your sign-out day? No problem. Share your unique link and let anyone sign your shirt from anywhere in the country.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-secondary/30 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Never Fade, Never Wash</h3>
                <p className="text-gray-600 leading-relaxed">
                  Physical markers fade, and shirts get old. Your digital sign-out shirt is securely stored in the cloud, so you can revisit those memories years after graduation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-white" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-primary sm:text-4xl">How to Sign Out Digitally</h2>
              <p className="mt-4 text-xl text-gray-600">Get your virtual white shirt ready in three simple steps.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="relative">
                <div className="w-16 h-16 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 z-10 relative shadow-lg">1</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your Shirt</h3>
                <p className="text-gray-600">Register in seconds to generate your very own interactive 3D white shirt and custom sign-out link.</p>
              </div>
              <div className="relative">
                <div className="w-16 h-16 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 z-10 relative shadow-lg">2</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Share Your Link</h3>
                <p className="text-gray-600">Drop your link in your departmental WhatsApp groups or share it directly with your favorite coursemates.</p>
              </div>
              <div className="relative">
                <div className="w-16 h-16 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 z-10 relative shadow-lg">3</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Collect Signatures</h3>
                <p className="text-gray-600">Watch your 3D shirt fill up with colorful signatures, well wishes, and memories from your friends.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-gray-50" id="faq">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary sm:text-4xl">Platform Information</h2>
            </div>
            <div className="space-y-6">
              {[
                {
                  q: "Is it free to use MySignout?",
                  a: "Yes! Creating your digital white shirt and collecting signatures from your friends is completely free."
                },
                {
                  q: "Who can sign my shirt?",
                  a: "Anyone with your unique link can sign your shirt! They don't even need to create an account, making it super easy for your coursemates."
                },
                {
                  q: "Will my signatures disappear after a while?",
                  a: "Never! Your digital white shirt and all the signatures on it are permanently saved in the cloud. You can revisit them years after graduation."
                }
              ].map((faq, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-start">
                    <ChevronDown className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                    {faq.q}
                  </h4>
                  <p className="text-gray-600 ml-7">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <PenTool className="h-6 w-6 text-secondary" />
                <span className="text-xl font-bold text-white">MySignout</span>
              </div>
              <p className="text-primary-100 text-sm opacity-80 max-w-xs">
                Taking the legendary Nigerian university sign-out tradition to the cloud. Preserve your graduation memories forever.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-secondary">Platform</h4>
              <ul className="space-y-2 opacity-80 text-sm">
                <li><a href="#features" className="hover:text-white hover:opacity-100 transition-opacity">Core Infrastructure</a></li>
                <li><a href="#how-it-works" className="hover:text-white hover:opacity-100 transition-opacity">Workflow</a></li>
                <li><a href="#faq" className="hover:text-white hover:opacity-100 transition-opacity">Information</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-secondary">Legal</h4>
              <ul className="space-y-2 opacity-80 text-sm">
                <li><Link to="/terms" className="hover:text-white hover:opacity-100 transition-opacity">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="hover:text-white hover:opacity-100 transition-opacity">Cookie Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-secondary">Connect</h4>
              <ul className="space-y-2 opacity-80 text-sm">
                <li><a href="mailto:ehimenaudu56@gmail.com" className="hover:text-white hover:opacity-100 transition-opacity">Email: ehimenaudu56@gmail.com</a></li>
                <li><a href="https://wa.me/2347071316989" className="hover:text-white hover:opacity-100 transition-opacity">WhatsApp: +2347071316989</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-80">
            <p>&copy; {new Date().getFullYear()} MySignout. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
