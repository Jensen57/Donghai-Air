import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerService({ isOpen, onClose }: CustomerServiceProps) {
  const servicePhone = '4009908619';

  const handleCall = () => {
    window.location.href = `tel:${servicePhone}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[200] overflow-hidden flex flex-col justify-end p-3 pb-5">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
          />
          
          {/* WeChat/iOS styled Action Sheet Container */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="relative z-50 w-full flex flex-col gap-2 max-w-md mx-auto"
          >
            {/* Primary Block */}
            <div className="bg-white rounded-2xl overflow-hidden flex flex-col divide-y divide-gray-100 shadow-xl">
              {/* Phone number display */}
              <div className="py-4 px-4 text-center flex flex-col items-center gap-1">
                <span className="text-gray-900 text-base font-bold tracking-wide">
                  {servicePhone}
                </span>
                <span className="text-gray-400 text-[10px] font-medium">
                  咨询时间：周一至周日 09:00 - 21:00
                </span>
              </div>
              
              {/* Call action */}
              <button 
                onClick={() => {
                  handleCall();
                  onClose();
                }}
                className="w-full py-4 text-center font-medium text-[17px] text-gray-900 active:bg-gray-50 transition-colors focus:outline-none"
              >
                呼叫
              </button>
            </div>

            {/* Cancel Button Block */}
            <button 
              onClick={onClose}
              className="w-full bg-white py-4 text-center font-medium text-[17px] text-gray-900 rounded-2xl shadow-xl active:bg-gray-50 transition-colors focus:outline-none"
            >
              取消
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


