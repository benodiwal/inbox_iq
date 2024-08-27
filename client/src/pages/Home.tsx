import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { SiMicrosoftoutlook } from "react-icons/si";
import { MdEmail, MdAutorenew, MdSecurity } from "react-icons/md";
import { BiBrain } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const FeatureCard = ({ icon, title, description }: any) => (
  <motion.div 
    className="bg-white p-6 rounded-lg shadow-md"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {icon}
    <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">InboxIQ</h1>
          <Button 
            onClick={() => navigate('/app')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Log In
          </Button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <motion.h2 
            className="text-4xl font-extrabold text-gray-900 sm:text-5xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Intelligent Email Management
          </motion.h2>
          <motion.p 
            className="mt-4 text-xl text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            InboxIQ brings AI-powered efficiency to your Gmail and Outlook accounts.
          </motion.p>
          <motion.div 
            className="mt-8 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FcGoogle className="text-6xl mx-2" />
            <MdEmail className="text-6xl mx-2 text-indigo-600" />
            <SiMicrosoftoutlook className="text-6xl mx-2 text-blue-500" />
            <BiBrain className="text-6xl mx-2 text-green-500" />
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Smart Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<BiBrain className="text-4xl text-green-500" />}
            title="AI-Powered Insights"
            description="Get intelligent suggestions and analytics to optimize your email workflow."
          />
          <FeatureCard 
            icon={<MdAutorenew className="text-4xl text-indigo-600" />}
            title="Smart Automation"
            description="Set up AI-driven rules and filters that work across Gmail and Outlook."
          />
          <FeatureCard 
            icon={<MdSecurity className="text-4xl text-red-500" />}
            title="Enhanced Security"
            description="Advanced AI-based threat detection to keep your emails safe and secure."
          />
        </div>
      </section>

      <section className="bg-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Ready to elevate your email experience?</h2>
          <p className="text-xl mb-8">Join InboxIQ today and unleash the power of AI in your inbox.</p>
          <Button 
            onClick={() => navigate('/app')}
            className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Get Started for Free
          </Button>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2024 InboxIQ. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="mx-2 hover:text-indigo-400">Privacy Policy</a>
            <a href="#" className="mx-2 hover:text-indigo-400">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
