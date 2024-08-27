import { motion } from 'framer-motion';
import { MdRefresh, MdEmail } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

const SomethingWentWrong = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-block"
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                transition: { 
                  duration: 0.5, 
                  repeat: Infinity,
                  repeatDelay: 3
                }
              }}
            >
              <MdEmail className="text-6xl text-indigo-500 mx-auto" />
            </motion.div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Oops! Something went wrong</h2>
            <p className="mt-2 text-gray-600">We encountered an unexpected error. Don't worry, it happens to the best of us!</p>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button 
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center"
            >
              <MdRefresh className="mr-2" />
              Try Again
            </Button>
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-white hover:bg-gray-100 text-indigo-600 border border-indigo-600"
            >
              Go to Homepage
            </Button>
          </motion.div>

          <motion.p 
            className="mt-6 text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            If the problem persists, please <a href="#" className="text-indigo-600 hover:underline">contact our support team</a>.
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default SomethingWentWrong;
