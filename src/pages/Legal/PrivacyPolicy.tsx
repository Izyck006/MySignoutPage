import { Link } from 'react-router-dom';
import { PenTool, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            <Link to="/" className="text-gray-500 hover:text-primary mr-6">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
              <PenTool className="h-6 w-6 text-primary" />
              <span>MySignout</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 prose prose-primary max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: September 2026</p>
          
          <p>
            This Privacy Policy explains how MySignout ("we", "us", or "our") collects, uses, discloses, and protects your personal data. 
            We are committed to ensuring your privacy is protected and strictly comply with the <strong>Nigeria Data Protection Act (NDPA)</strong>, 
            the <strong>General Data Protection Regulation (GDPR)</strong>, and other applicable international data protection laws.
          </p>

          <h2>1. Data Controller</h2>
          <p>MySignout acts as the Data Controller. For any privacy-related inquiries or to exercise your rights, you can contact our Data Protection Officer at: <strong>ehimenaudu56@gmail.com</strong>.</p>

          <h2>2. Information We Collect and Lawful Basis</h2>
          <p>We collect data under the lawful bases of <strong>Consent</strong> and <strong>Legitimate Interest</strong>:</p>
          <ul>
            <li><strong>Account Information (Consent & Contract):</strong> Name and email address when you register.</li>
            <li><strong>User-Generated Content (Consent):</strong> Messages, signatures, and images uploaded to your sign-out page.</li>
            <li><strong>Technical Data (Legitimate Interest):</strong> IP addresses, browser types, and usage statistics to maintain platform security and performance.</li>
          </ul>

          <h2>3. Data Sharing and International Transfers</h2>
          <p>We do not sell your personal data. We may share data with trusted third-party processors (such as cloud hosting providers) strictly for the purpose of operating our Service. Where data is transferred outside of Nigeria or the EEA, we ensure appropriate safeguards (such as Standard Contractual Clauses) are in place as required by the NDPA and GDPR.</p>

          <h2>4. Data Retention</h2>
          <p>We retain your personal data only for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. You may request the deletion of your account and associated data at any time.</p>

          <h2>5. Your Data Protection Rights</h2>
          <p>Under the NDPA, GDPR, and other international laws, you possess the following rights:</p>
          <ul>
            <li><strong>Right to Access:</strong> Request copies of your personal data.</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
            <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request deletion of your personal data.</li>
            <li><strong>Right to Restrict Processing:</strong> Request a pause in the processing of your data.</li>
            <li><strong>Right to Data Portability:</strong> Request the transfer of your data to another organization.</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent at any time where we relied on it to process your data.</li>
          </ul>
          <p>To exercise any of these rights, please contact us at ehimenaudu56@gmail.com. We have 30 days to respond to your request.</p>

          <h2>6. Data Security & Breach Notification</h2>
          <p>We implement robust technical and organizational measures to secure your data against unauthorized access, alteration, disclosure, or destruction. In the unlikely event of a data breach that poses a high risk to your rights and freedoms, we will notify you and the relevant supervisory authority (such as the NDPC) within 72 hours, in compliance with statutory requirements.</p>
        </div>
      </main>
    </div>
  );
}
