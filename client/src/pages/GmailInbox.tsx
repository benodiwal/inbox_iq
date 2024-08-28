import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { FaInbox, FaRegStar, FaRegClock, FaSearch, FaSpinner, FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa';
import { Email } from '@/types/Email';
import { useEmails } from '@/state/queries';

const EmailItem: React.FC<{ email: Email; onSelect: (email: Email) => void }> = ({ email, onSelect }) => (
  <div
    className="flex items-center p-4 hover:bg-gray-100 cursor-pointer border-b transition duration-150 ease-in-out max-w-[1300px]"
    onClick={() => onSelect(email)}
  >
    <div className="flex-shrink-0 mr-4">
      {email.responseStatus === 'SENT' ? (
        <FaEnvelopeOpen className="text-green-500 text-xl" />
      ) : (
        <FaEnvelope className="text-gray-400 text-xl" />
      )}
    </div>
    <div className="flex-grow min-w-0">
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-semibold text-sm truncate">{email.sender}</span>
        <span className="text-xs text-gray-500">{format(new Date(email.receivedAt), 'MMM d, yyyy')}</span>
      </div>
      <div className="text-sm font-medium truncate">{email.subject}</div>
      <div className="text-xs text-gray-600 truncate">
        {email.response || 'No response yet'}
      </div>
    </div>
    <div className="ml-4 flex-shrink-0">
      <span className={`text-xs px-2 py-1 rounded-full ${
        email.responseStatus === 'SENT' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {email.responseStatus}
      </span>
    </div>
  </div>
);

const GmailInbox: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: emails, isLoading, isError, error } = useEmails(id as string);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const filteredEmails = emails
    ? emails.filter(email => {
        const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              email.sender.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'all' || email.category.toUpperCase() === category.toUpperCase();
        return matchesSearch && matchesCategory;
      })
    : [];

  const categories = [
    { id: 'all', name: 'All', icon: FaInbox },
    { id: 'INTERESTED', name: 'Interested', icon: FaRegStar },
    { id: 'NOT_INTERESTED', name: 'Not Interested', icon: FaRegClock },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error?.message || 'An error occurred while fetching emails.'}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-indigo-600 mb-6">InboxIQ</h1>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center w-full p-2 mb-2 rounded transition duration-150 ease-in-out ${
                category === cat.id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
              }`}
            >
              <cat.icon className="mr-2" />
              <span className="text-sm">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-150 ease-in-out"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-white">
          {filteredEmails.length > 0 ? (
            filteredEmails.map(email => (
              <EmailItem key={email.id} email={email} onSelect={setSelectedEmail} />
            ))
          ) : (
            <div className="text-center p-8 text-gray-500">
              No emails found. Try adjusting your search or category.
            </div>
          )}
        </div>
      </div>
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedEmail.subject}</h2>
              <p className="mb-2"><strong>From:</strong> {selectedEmail.sender}</p>
              <p className="mb-4"><strong>Received:</strong> {format(new Date(selectedEmail.receivedAt), 'PPpp')}</p>
              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold mb-2">Response:</h3>
                {selectedEmail.response ? (
                  <p className="text-gray-700">{selectedEmail.response}</p>
                ) : (
                  <p className="text-yellow-500">Response pending</p>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  selectedEmail.responseStatus === 'SENT' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedEmail.responseStatus}
                </span>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GmailInbox;
