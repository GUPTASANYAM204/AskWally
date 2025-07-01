import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const privacyContent = [
  {
    title: '1. Information We Collect',
    text: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This may include your name, email address, phone number, and payment information.'
  },
  {
    title: '2. How We Use Your Information',
    text: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you updates and marketing communications, and respond to your questions and requests.'
  },
  {
    title: '3. Information Sharing',
    text: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.'
  },
  {
    title: '4. Data Security',
    text: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.'
  },
  {
    title: '5. Cookies and Tracking',
    text: 'We use cookies and similar tracking technologies to enhance your experience on our website, analyze usage patterns, and personalize content and advertisements.'
  },
  {
    title: '6. Your Rights',
    text: 'You have the right to access, update, or delete your personal information. You may also opt out of marketing communications at any time by following the unsubscribe instructions in our emails.'
  },
  {
    title: '7. Children\'s Privacy',
    text: 'Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.'
  },
  {
    title: '8. Changes to This Policy',
    text: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.'
  },
  {
    title: '9. Contact Us',
    text: 'If you have any questions about this Privacy Policy, please contact us at privacy@askwally.com.'
  }
];

export const PrivacyPage: React.FC = () => {
  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-walmart-blue to-walmart-blue-dark rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-walmart-blue to-walmart-blue-dark bg-clip-text text-transparent">
              AskWally
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Privacy Policy</h2>
          <p className="text-gray-600">Last Updated: December 2024</p>
        </div>

        {/* Privacy Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50 space-y-6">
          {privacyContent.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-semibold text-walmart-blue mb-1">{section.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            to="/signup"
            className="text-walmart-blue hover:text-walmart-blue-dark font-semibold transition-colors duration-200"
          >
            &larr; Back to Signup
          </Link>
        </div>
      </div>
    </div>
  );
}; 