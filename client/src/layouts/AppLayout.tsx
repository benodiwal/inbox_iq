import Header from "@/components/shared/Header"
import Sidebar from "@/components/shared/Sidebar";
import { FC, ReactNode, useState } from "react"

const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <div className="flex h-screen bg-gray-100">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
            <Header />
            { children }
        </div>
    </div>
  )
}

export default AppLayout
