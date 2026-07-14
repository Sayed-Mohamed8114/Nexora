import ChatPage from "@/Components/ChatBot/ChatPage";
import DashboardLayout from "@/mainLayout/DashboardLayout";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const Recommendation = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <DashboardLayout>
      <motion.button
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 rounded-full bg-sky-900 px-5 py-3 text-white shadow-lg z-999 cursor-pointer hover:scale-110 duration-700"
      >
        {isChatOpen ? "Close Nexora" : "Ask Nexora"}
      </motion.button>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 25,
            }}
            className="fixed -bottom-24 right-6 w-[50%] h-full "
          >
            <ChatPage />
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Recommendation;
