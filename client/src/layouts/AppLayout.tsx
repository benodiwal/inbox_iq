import { FC, ReactNode } from "react"

const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="w-full h-full">
        { children }
    </div>
  )
}

export default AppLayout
