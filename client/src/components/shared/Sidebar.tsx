import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
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

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const menuItems = [
    { icon: MdInbox, label: 'Inbox', path: '/inbox' },
    { icon: MdOutlineAnalytics, label: 'Analytics', path: '/analytics' },
    { icon: MdSettings, label: 'Settings', path: '/settings' },
    { icon: MdHelp, label: 'Help', path: '/help' },
  ];

  return (
    <motion.div
      className="fixed left-0 top-0 h-full bg-indigo-700 text-white z-30 overflow-hidden"
      animate={{ width: isOpen ? 256 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4">
          <AnimatePresence>
            {isOpen && (
              <motion.h1
                className="font-bold text-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                InboxIQ
              </motion.h1>
            )}
          </AnimatePresence>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white">
            {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </Button>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-indigo-600"
                  onClick={() => navigate(item.path)}
                >
                  <div className={`flex items-center ${isOpen ? 'justify-start' : 'justify-center'} w-full`}>
                    <item.icon size={24} className={isOpen ? 'mr-4' : ''} />
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
