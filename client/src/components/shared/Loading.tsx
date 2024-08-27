import { motion } from 'framer-motion';

const Loading= () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <motion.div
          className="mb-8"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity,
          }}
        >
          <svg
            className="w-24 h-24 mx-auto"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Envelope body */}
            <motion.path
              d="M10,20 L90,20 L90,80 L10,80 Z"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Envelope flap */}
            <motion.path
              d="M10,20 L50,50 L90,20"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            {/* AI brain icon */}
            <motion.path
              d="M50,40 Q40,20 30,40 Q20,60 30,80 Q50,90 70,80 Q80,60 70,40 Q60,20 50,40"
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </svg>
        </motion.div>
        <motion.h2
          className="text-2xl font-bold text-indigo-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          InboxIQ
        </motion.h2>
        <motion.p
          className="mt-2 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Optimizing your inbox...
        </motion.p>
      </div>
    </div>
  );
};

export default Loading;
