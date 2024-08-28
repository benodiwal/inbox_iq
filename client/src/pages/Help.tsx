import React, { useState } from 'react';
import { FaQuestionCircle, FaEnvelope } from 'react-icons/fa';

const HelpPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');

  const faqs = [
    {
      question: "How does InboxIQ categorize my emails?",
      answer: "InboxIQ uses advanced AI algorithms to analyze the content and context of your emails, automatically sorting them into relevant categories for easier management."
    },
    {
      question: "Is my email data secure with InboxIQ?",
      answer: "Yes, we take your privacy seriously. InboxIQ uses bank-level encryption to protect your data. We never store your email passwords, and all processing is done securely on our servers."
    },
    {
      question: "Can I use InboxIQ with multiple email accounts?",
      answer: "Absolutely! InboxIQ supports both Gmail and Outlook accounts. You can connect and manage multiple accounts from different providers within the same InboxIQ interface."
    },
    {
      question: "How accurate are the AI-generated responses?",
      answer: "Our AI-generated responses are highly accurate and context-aware. However, we always recommend reviewing and adjusting the suggested responses before sending to ensure they match your tone and intent perfectly."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">Help Center</h1>
      
      <div className="flex mb-6">
        <button
          className={`mr-4 px-4 py-2 rounded-lg ${activeSection === 'general' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveSection('general')}
        >
          General Usage
        </button>
        <button
          className={`mr-4 px-4 py-2 rounded-lg ${activeSection === 'faq' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveSection('faq')}
        >
          FAQs
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${activeSection === 'contact' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveSection('contact')}
        >
          Contact Us
        </button>
      </div>

      {activeSection === 'general' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Getting Started with InboxIQ</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Connect your email account (Gmail or Outlook) by clicking the "Connect" button in the sidebar.</li>
            <li>Allow InboxIQ to sync your emails. This may take a few minutes depending on the size of your inbox.</li>
            <li>Explore your newly organized inbox! Emails will be automatically categorized for you.</li>
            <li>When composing or replying to emails, use the AI-powered suggestion feature to draft responses quickly.</li>
            <li>Check out the Analytics section to gain insights into your email habits and productivity.</li>
          </ol>
        </div>
      )}

      {activeSection === 'faq' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-4">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <FaQuestionCircle className="mr-2 text-indigo-600" />
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'contact' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
          <p className="mb-4">If you need further assistance, please don't hesitate to contact our support team:</p>
          <div className="flex items-center text-lg">
            <FaEnvelope className="mr-2 text-indigo-600" />
            <a href="mailto:support@inboxiq.com" className="text-indigo-600 hover:underline">support@inboxiq.com</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpPage;
