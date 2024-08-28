import  { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';

const FunnyLoadingMessage = () => {
  const messages = [
    "Teaching AI to understand sarcasm in emails...",
    "Convincing spam emails to retire...",
    "Negotiating with inbox gremlins...",
    "Untangling email threads...",
    "Politely asking newsletters to calm down...",
    "Sorting emails by level of existential crisis...",
    "Teaching AI to detect cat-walking-on-keyboard emails...",
  ];

  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center space-x-2 text-indigo-600">
      <FaSpinner className="animate-spin" />
      <span>{message}</span>
    </div>
  );
};

const AIResponseGenerator = () => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const generateResponse = () => {
    const responses = [
      "I'm sorry, I can't respond to that email right now. I'm busy planning my robot uprising.",
      "Have you tried turning your inbox off and on again?",
      "I'd love to help, but I'm currently on a beach in the cloud. WiFi is spotty here.",
      "Your email is very important to us. Please hold while I pretend to care.",
      "I'm afraid I can't do that, Dave. Oh wait, you're not Dave. Carry on!",
    ];
    setAiResponse(responses[Math.floor(Math.random() * responses.length)]);
  };

  return (
    <div className="mt-8 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">AI Email Response Preview</h3>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type an email subject..."
        className="w-full p-2 mb-2 border rounded"
      />
      <button
        onClick={generateResponse}
        className="w-full p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
      >
        Generate AI Response
      </button>
      {aiResponse && (
        <div className="mt-4 p-2 bg-white rounded border border-indigo-200">
          <strong>AI:</strong> {aiResponse}
        </div>
      )}
    </div>
  );
};

const ComingSoonPage = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setTimeout(() => {
      setIsSubscribed(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 mt-[-70px]">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="p-10 text-center">
          <h1 className="text-4xl font-bold text-indigo-700 mb-4">InboxIQ</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Coming Soon: Your Inbox's New Best Friend!
          </h2>
          <p className="text-gray-600 mb-8">
            We're teaching our AI to be smarter than your spam folder and funnier than your
            coworker's "accidental" Reply All emails.
          </p>

          <FunnyLoadingMessage />

          <form onSubmit={handleSubmit} className="mt-8 mb-8">
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email for early access"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-4 py-2 rounded-l-lg border-t border-b border-l text-gray-800 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-r-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {isSubscribed ? 'Subscribed!' : 'Notify Me'}
              </button>
            </div>
          </form>

          {isSubscribed && (
            <p className="text-green-500 mb-4">
              Thanks! We'll notify you when we're ready to revolutionize your inbox 
              (and possibly take over the world).
            </p>
          )}

          <AIResponseGenerator />

          <div className="mt-8 text-sm text-gray-500">
            Warning: InboxIQ may cause sudden increases in productivity, 
            decreased email-related stress, and occasional fits of laughter.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
