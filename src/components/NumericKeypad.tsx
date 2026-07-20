import React from 'react';
import { Delete } from 'lucide-react';
import { motion } from 'motion/react';

interface NumericKeypadProps {
  onInput: (digit: string) => void;
  onDelete: () => void;
  onClose: () => void;
}

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'];

export const NumericKeypad: React.FC<NumericKeypadProps> = ({ onInput, onDelete, onClose }) => {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: '0%' }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="bg-white w-full p-4 pb-8 border-t border-gray-100"
    >
      <div className="grid grid-cols-3 gap-2">
        {keys.map((key, index) => (
          <button
            key={index}
            onClick={() => {
              if (key === 'delete') onDelete();
              else if (key !== '') onInput(key);
            }}
            className={`h-14 flex items-center justify-center rounded-lg font-medium text-xl
              ${key === '' ? 'bg-transparent' : 'bg-gray-100 active:bg-gray-200'}
              ${key === 'delete' ? 'text-gray-600' : 'text-gray-900'}
            `}
          >
            {key === 'delete' ? <Delete className="w-6 h-6" /> : key}
          </button>
        ))}
      </div>
      <button 
        onClick={onClose}
        className="w-full text-center text-gray-400 text-sm mt-4"
      >
        收起键盘
      </button>
    </motion.div>
  );
};
