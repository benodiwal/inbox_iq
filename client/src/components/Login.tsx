import { useSendCode } from "@/state/mutations";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { SiMicrosoftoutlook } from "react-icons/si";
import { MdEmail } from "react-icons/md";

const Login = () => {
    const sendCode = useSendCode();
    const login = useGoogleLogin({
        onSuccess: async ({ code }) => {
            await sendCode.mutate(code);
        },
        flow: "auth-code",
        scope: "email profile openid",
    });
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-5xl w-full mx-auto flex shadow-2xl rounded-xl overflow-hidden">
                <div className="w-1/2 bg-indigo-600 p-12 flex-col justify-center items-center text-white hidden md:flex">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold mb-4">Unified Email Experience</h2>
                        <p className="mb-8">Seamlessly integrate your Gmail and Outlook accounts</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex justify-center items-center mb-8"
                    >
                        <FcGoogle className="text-6xl mr-4" />
                        <MdEmail className="text-6xl text-white mx-4" />
                        <SiMicrosoftoutlook className="text-6xl ml-4" />
                    </motion.div>
                    <motion.ul
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="list-disc list-inside"
                    >
                        <li>Manage all your emails in one place</li>
                        <li>Smart categorization and filtering</li>
                        <li>Automated responses and scheduling</li>
                    </motion.ul>
                </div>
                
                <div className="w-full md:w-1/2 bg-white p-12 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-bold mb-2 text-gray-800">Welcome Back</h1>
                        <p className="text-gray-600 mb-8">Log in to access your unified inbox</p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Button
                            onClick={() => login()}
                            className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        >
                            <FcGoogle className="mr-2 text-2xl" />
                            Sign in with Google
                        </Button>
                    </motion.div>
                    
                    <motion.p 
                        className="mt-8 text-center text-sm text-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        By signing in, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
                    </motion.p>
                </div>
            </div>
        </div>
    );
}

export default Login;
