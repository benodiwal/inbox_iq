import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { SiMicrosoftoutlook } from 'react-icons/si';
import { MdSecurity, MdSpeed, MdAutoAwesome } from 'react-icons/md';
import { useSendGmailCode } from '@/state/mutations';
import { useGoogleLogin } from '@react-oauth/google';

const FeatureItem = ({ icon: Icon, title, description }: any) => (
  <div className="flex items-start mb-6">
    <Icon className="text-2xl text-blue-500 mr-4 mt-1 flex-shrink-0" />
    <div>
      <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const ConnectButton = ({ icon: Icon, service, onClick }: any) => (
  <motion.button
    className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-semibold hover:bg-gray-50 transition duration-300"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
  >
    <Icon className="text-2xl mr-3" />
    Connect with {service}
  </motion.button>
);

const Inbox = () => {
    const sendGmailCode = useSendGmailCode();

    const gmailLogin = useGoogleLogin({
        onSuccess: async ({ code }) => {
            await sendGmailCode.mutateAsync(code);
        },
        flow: "auth-code",
        scope: "email profile openid https://www.googleapis.com/auth/gmail.modify",
    });

  const handleConnectOutlook = () => {
    console.log('Connecting to Outlook...');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Connect Your Email</h1>
          <p className="text-gray-600 mb-8 text-center">
            Link your account to start using AI-powered email management.
          </p>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="space-y-4 mb-6">
              <ConnectButton icon={FcGoogle} service="Gmail" onClick={() => gmailLogin()} />
              <ConnectButton icon={SiMicrosoftoutlook} service="Outlook" onClick={handleConnectOutlook} />
            </div>
            <p className="text-xs text-gray-500 text-center">
              We use secure OAuth2. Your credentials are never stored.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Why Connect Your Email?</h2>
            <FeatureItem 
              icon={MdSecurity}
              title="Secure and Private"
              description="Your data is encrypted and protected at all times."
            />
            <FeatureItem 
              icon={MdSpeed}
              title="Instant Sync"
              description="Get real-time updates across all your devices."
            />
            <FeatureItem 
              icon={MdAutoAwesome}
              title="AI-Powered Features"
              description="Enjoy smart categorization and automated responses."
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Inbox;
