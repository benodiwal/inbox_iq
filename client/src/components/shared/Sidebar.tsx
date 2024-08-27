import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { 
  MdInbox, 
  MdOutlineAnalytics, 
  MdSettings, 
  MdHelp, 
  MdMenu, 
  MdClose,
} from 'react-icons/md';

const Sidebar = ({ isOpen, toggleSidebar }: any) => {
  const navigate = useNavigate();
  const menuItems = [
    { icon: MdInbox, label: 'Inbox', path: '/inbox' },
    { icon: MdOutlineAnalytics, label: 'Analytics', path: '/analytics' },
    { icon: MdSettings, label: 'Settings', path: '/settings' },
    { icon: MdHelp, label: 'Help', path: '/help' },
  ];

  return (
    <motion.div
      className={`fixed left-0 top-0 h-full bg-indigo-700 text-white p-4 z-30 ${isOpen ? 'w-64' : 'w-20'}`}
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className={`font-bold ${isOpen ? 'text-2xl' : 'text-lg'}`}>
          {isOpen ? 'InboxIQ' : 'IQ'}
        </h1>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </Button>
      </div>
      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-4">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate(item.path)}
              >
                <item.icon size={24} className="mr-4" />
                {isOpen && item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
