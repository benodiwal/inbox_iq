import { 
  MdEmail, 
  MdLightbulb, 
  MdInsertChart, 
  MdArrowForward,
  MdCheckCircle,
  MdWarning,
  MdTrendingUp
} from 'react-icons/md';
import { motion } from 'framer-motion';

const DashboardCard = ({ title, icon: Icon, content, footer, color }: any) => (
  <motion.div 
    className={`bg-white p-6 rounded-lg shadow-md ${color} overflow-hidden relative`}
    whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="flex items-center mb-4">
      <Icon className="text-3xl mr-3 text-gray-600" />
      <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
    </div>
    {content}
    <div className="mt-4 flex justify-between items-center">
      {footer}
      <MdArrowForward className="text-gray-400" />
    </div>
    <div className="absolute -right-6 -bottom-6 opacity-5">
      <Icon className="text-9xl" />
    </div>
  </motion.div>
);

const App = () => {
  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-3xl font-bold mb-2 text-gray-800">Welcome to InboxIQ</h3>
        <p className="text-gray-600 mb-8">
          Harness the power of AI to manage your emails more efficiently. Here's your personalized dashboard.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Unread Emails" 
          icon={MdEmail}
          color="border-l-4 border-blue-500"
          content={
            <div>
              <p className="text-3xl font-bold mb-2 text-blue-600">24</p>
              <p className="text-sm text-gray-600">8 urgent, 16 regular</p>
            </div>
          }
          footer={
            <div className="flex items-center text-sm text-gray-600">
              <MdTrendingUp className="text-green-500 mr-1" />
              <span>12% from yesterday</span>
            </div>
          }
        />

        <DashboardCard 
          title="AI Suggestions" 
          icon={MdLightbulb}
          color="border-l-4 border-yellow-500"
          content={
            <ul className="text-sm text-gray-700">
              <li className="mb-2 flex items-center">
                <MdCheckCircle className="text-green-500 mr-2" />
                Schedule meeting with Marketing team
              </li>
              <li className="mb-2 flex items-center">
                <MdWarning className="text-yellow-500 mr-2" />
                Follow up on Project X proposal
              </li>
              <li className="flex items-center">
                <MdEmail className="text-blue-500 mr-2" />
                Respond to client inquiry about pricing
              </li>
            </ul>
          }
          footer={<span className="text-sm text-gray-600">3 new suggestions</span>}
        />

        <DashboardCard 
          title="Recent Analytics" 
          icon={MdInsertChart}
          color="border-l-4 border-purple-500"
          content={
            <div>
              <p className="text-sm text-gray-600 mb-2">Email Management Efficiency</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{width: '70%'}}></div>
              </div>
              <p className="text-right text-sm text-gray-600 mt-1">70% efficient</p>
            </div>
          }
          footer={<span className="text-sm text-blue-600 hover:underline cursor-pointer">View detailed report</span>}
        />
      </div>
    </main>
  );
};

export default App;
