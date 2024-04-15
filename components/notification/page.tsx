import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
    message: string;
    onClose: () => void;
  }

  const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ x: -100, opacity: 0 }} // Animasi masuk dari kiri
          animate={{ x: 0, opacity: 1 }} // Animasi ke posisi awal
          transition={{ duration: 0.7, delay: 5 }} // Durasi animasi
          className="fixed top-8 left-8 z-50 pointer-events-none"
        >
          <div className="bg-[#0d2818] active-shadow p-3 rounded-lg shadow-lg flex items-center pointer-events-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#154227] text-white rounded-full focus:outline-none hover:bg-[#4C0000] text-[15px]"
            >
              X
            </button>
            <p className="ml-4 text-[15px]">{message}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
  

export default Notification