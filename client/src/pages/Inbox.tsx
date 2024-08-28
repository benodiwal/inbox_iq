import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { SiMicrosoftoutlook } from 'react-icons/si';
import { MdSecurity, MdSpeed, MdAutoAwesome } from 'react-icons/md';
import { useSendGmailCode } from '@/state/mutations';
import { useGoogleLogin } from '@react-oauth/google';
import { useGetUserAccounts } from '@/state/queries';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/shared/Loading';
import SomethingWentWrong from '@/components/shared/SomethingWentWrong';
import { Platform } from '@/types/User';

export type Account = {
    id: string;
    platform: Platform;
    email: string;
};

const ConnectedAccountCard = ({ account, onClick }: { account: Account; onClick: () => void }) => (
  <motion.div
    className="bg-white rounded-lg shadow-md p-6 mb-4 cursor-pointer"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
  >
    <div className="flex items-center mb-2">
      {account.platform === Platform.GMAIL ? (
        <FcGoogle className="text-3xl mr-3" />
      ) : (
        <SiMicrosoftoutlook className="text-3xl mr-3 text-blue-500" />
      )}
      <h3 className="text-xl font-semibold">{account.platform} Connected</h3>
    </div>
    <p className="text-gray-600">{account.email}</p>
    <p className="text-sm text-blue-500 mt-2">Click to view inbox</p>
  </motion.div>
);

const ConnectButton = ({ icon: Icon, service, onClick, disabled }: any) => (
  <motion.button
    className={`mb-2 flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-semibold transition duration-300 ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
    }`}
    whileHover={disabled ? {} : { scale: 1.02 }}
    whileTap={disabled ? {} : { scale: 0.98 }}
    onClick={onClick}
    disabled={disabled}
  >
    <Icon className="text-2xl mr-3" />
    Connect with {service}
  </motion.button>
);

const FeatureItem = ({ icon: Icon, title, description }: any) => (
  <div className="flex items-start mb-6">
    <Icon className="text-2xl text-blue-500 mr-4 mt-1 flex-shrink-0" />
    <div>
      <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const Inbox = () => {
  const navigate = useNavigate();
  const sendGmailCode = useSendGmailCode();
  const { isLoading, isError, data: accounts, error } = useGetUserAccounts();

  const gmailLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      await sendGmailCode.mutateAsync(code);
    },
    flow: "auth-code",
    scope: "email profile openid https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/pubsub",
  });

  const handleConnectOutlook = () => {
    console.log('Connecting to Outlook...');
    // Implement Outlook connection logic here
  };

  if (isLoading) return <Loading />;
  if (isError && (!error.response || error.response.status !== 401)) return <SomethingWentWrong />;

  const gmailAccount = accounts?.find(account => account.platform === Platform.GMAIL);
  const outlookAccount = accounts?.find(account => account.platform === Platform.OUTLOOK);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Your Email Accounts</h1>
          <p className="text-gray-600 mb-8 text-center">
            Manage your connected accounts or add new ones to use AI-powered email management.
          </p>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            {gmailAccount ? (
              <ConnectedAccountCard 
                account={gmailAccount} 
                onClick={() => navigate(`/inbox/gmail/${gmailAccount.id}`)}
              />
            ) : (
              <ConnectButton 
                icon={FcGoogle} 
                service="Gmail" 
                onClick={() => gmailLogin()} 
                disabled={sendGmailCode.isLoading}
              />
            )}

            {outlookAccount ? (
              <ConnectedAccountCard 
                account={outlookAccount} 
                onClick={() => navigate(`/inbox/outlook/${outlookAccount.id}`)} 
              />
            ) : (
              <ConnectButton 
                icon={SiMicrosoftoutlook} 
                service="Outlook" 
                onClick={handleConnectOutlook} 
              />
            )}

            {(gmailAccount || outlookAccount) && (
              <p className="text-sm text-gray-600 mt-4 text-center">
                Click on a connected account to view its inbox.
              </p>
            )}

            {(!gmailAccount && !outlookAccount) && (
              <p className="text-xs text-gray-500 text-center mt-4">
                We use secure OAuth2. Your credentials are never stored.
              </p>
            )}
          </div>

          {(!gmailAccount || !outlookAccount) && (
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
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Inbox;
