import React from "react";
import { motion } from "framer-motion";

interface MessageDisplayProps {
  message: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        <motion.div
          className="bg-white backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ backdropFilter: "blur(0px)" }}
          animate={{ backdropFilter: "blur(12px)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.p
            className="text-black/90 text-lg line-clamp-5 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {message.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.15,
                  delay: index * 0.02,
                  ease: "easeOut",
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MessageDisplay;
