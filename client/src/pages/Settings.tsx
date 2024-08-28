import { useState } from 'react';
import { motion } from "framer-motion";
import { MdPerson, MdNotifications, MdSecurity, MdColorLens } from "react-icons/md";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from '@/state/queries';

const SettingsCard = ({ icon, title, children }: any) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-md mb-6"
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-xl font-semibold ml-2">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [theme, setTheme] = useState("indigo");
  const user = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <SettingsCard icon={<MdPerson className="text-3xl text-indigo-600" />} title="Account">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="email">Email</Label>
              <input
                id="email"
                type="email"
                value={user?.email}
                readOnly
                className="bg-gray-100 px-3 py-2 rounded-md"
              />
            </div>
            <div className="flex justify-between items-center">
              <Label htmlFor="name">Name</Label>
              <input
                id="name"
                type="text"
                value={user?.name}
                readOnly
                className="bg-gray-100 px-3 py-2 rounded-md"
              />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard icon={<MdNotifications className="text-3xl text-yellow-500" />} title="Notifications">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Enable Notifications</Label>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard icon={<MdSecurity className="text-3xl text-green-500" />} title="Security">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="twoFactor" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Two-Factor Authentication</Label>
              <Switch
                id="twoFactor"
                checked={twoFactor}
                onCheckedChange={setTwoFactor}
              />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard icon={<MdColorLens className="text-3xl text-purple-500" />} title="Appearance">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Dark Mode</Label>
              <Switch
                id="darkMode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="theme" className="text-sm font-medium leading-none">Theme Color</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indigo">Indigo</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SettingsCard>

        <div className="mt-8 flex justify-end">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Save Changes
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
