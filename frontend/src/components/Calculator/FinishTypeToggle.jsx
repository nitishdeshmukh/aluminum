import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Snowflake } from 'lucide-react';

const FinishTypeToggle = ({ value, onChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
        Finish Type
      </label>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onChange('color')}
          className={`relative group flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${value === 'color'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-gray-50'
            }`}
        >
          {value === 'color' && (
            <motion.div
              layoutId="active-finish"
              className="absolute inset-0 bg-blue-100/50 rounded-xl"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`p-2 rounded-full ${value === 'color' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
              <Palette className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm">Powder Coated</span>
            <span className="text-xs opacity-75">Color Finish</span>
          </div>
        </button>

        <button
          onClick={() => onChange('silver')}
          className={`relative group flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${value === 'silver'
              ? 'border-gray-600 bg-gray-50 text-gray-800'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
        >
          {value === 'silver' && (
            <motion.div
              layoutId="active-finish"
              className="absolute inset-0 bg-gray-200/50 rounded-xl"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`p-2 rounded-full ${value === 'silver' ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}>
              <Snowflake className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm">Anodized Silver</span>
            <span className="text-xs opacity-75">Matte Finish</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default FinishTypeToggle;
