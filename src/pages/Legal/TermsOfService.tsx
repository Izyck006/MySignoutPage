import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: September 2026</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing, registering for, and using MySignout ("the Service"), you enter into a legally binding agreement and accept these Terms of Service in full. If you disagree with any part of these terms, you must not use our Service.</p>

          <h2>2. Description of Service</h2>
          <p>MySignout provides a digital platform for students to create sign-out pages and collect messages. We act solely as a hosting platform for user-generated content.</p>

          <h2>3. User-Generated Content & Liability</h2>
          <p>You retain ownership of any content you upload, but you grant us a license to host and display it. You are strictly and solely liable for the content published on your page.</p>
          <p>You explicitly agree NOT to post or facilitate the posting of:</p>
          <ul>
            <li>Content that violates any local, national, or international laws (including the NDPA and GDPR).</li>
            <li>Defamatory, libelous, hateful, violent, or discriminatory material.</li>
            <li>Content that infringes upon the intellectual property or privacy rights of any third party.</li>
          </ul>
          <p><strong>MySignout assumes no responsibility or liability for user-generated content. We reserve the absolute right to remove any content or terminate accounts without prior notice if we deem a violation has occurred.</strong></p>

          <h2>4. Disclaimer of Warranties</h2>
          <p>THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. MYSIGNOUT DISCLAIMS ALL WARRANTIES, INCLUDING, BUT NOT LIMITED TO, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT ANY DATA WILL NOT BE LOST.</p>

          <h2>5. Comprehensive Limitation of Liability</h2>
          <p><strong>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL MYSIGNOUT, ITS FOUNDERS, EMPLOYEES, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THIS SERVICE.</strong></p>

          <h2>6. Indemnification</h2>
          <p>You agree to defend, indemnify, and hold harmless MySignout, its contractors, licensors, and their respective directors, officers, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from: (a) your use of and access to the Service; (b) your violation of any term of these Terms; (c) your violation of any third-party right, including without limitation any copyright, property, or privacy right; or (d) any claim that your content caused damage to a third party.</p>

          <h2>7. Governing Law and Jurisdiction</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions. Any dispute arising from or relating to the subject matter of these Terms shall be subject to the exclusive jurisdiction of the courts in Nigeria.</p>
        </div>
      </main>
    </div>
  );
}
