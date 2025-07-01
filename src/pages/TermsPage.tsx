import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const termsContent = [
  {
    title: '1. Acceptance of Terms',
    text: 'By creating an account or using AskWally, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use our services.'
  },
  {
    title: '2. User Responsibilities',
    text: 'You are responsible for maintaining the confidentiality of your account and password. You agree to provide accurate information and to update it as necessary.'
  },
  {
    title: '3. Prohibited Conduct',
    text: 'You may not use AskWally for any unlawful purpose or in violation of any applicable laws. Harassment, abuse, or any harmful behavior is strictly prohibited.'
  },
  {
    title: '4. Intellectual Property',
    text: 'All content, trademarks, and data on AskWally are the property of their respective owners. You may not use, copy, or distribute any content without permission.'
  },
  {
    title: '5. Limitation of Liability',
    text: 'AskWally is provided "as is" without warranties of any kind. We are not liable for any damages or losses resulting from your use of the service.'
  },
  {
    title: '6. Changes to Terms',
    text: 'We may update these Terms of Service from time to time. Continued use of AskWally after changes constitutes acceptance of the new terms.'
  },
  {
    title: '7. Contact Us',
    text: 'If you have any questions about these Terms, please contact us at support@askwally.com.'
  }
];

export const TermsPage: React.FC = () => {
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Terms of Service</h2>
          <p className="text-gray-600">Please read these terms carefully before using AskWally.</p>
        </div>

        {/* Terms Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50 space-y-6">
          {termsContent.map((section, idx) => (
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