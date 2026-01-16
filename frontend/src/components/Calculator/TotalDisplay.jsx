import React from 'react';
import { motion } from 'framer-motion';

const TotalDisplay = ({ totals, dimensions, weight }) => {
  if (!totals) return null;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 opacity-90">
          Total Estimate
        </h3>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-blue-400/30 text-sm">
          <div className="bg-blue-500/20 p-3 rounded-lg backdrop-blur-sm">
            <span className="block text-blue-100 text-xs uppercase tracking-wider mb-1">Dimensions</span>
            <p className="font-semibold text-lg">{dimensions?.width} × {dimensions?.height} ft</p>
            <p className="text-blue-200 text-xs">Area: {dimensions?.area} sq.ft</p>
          </div>
          <div className="bg-blue-500/20 p-3 rounded-lg backdrop-blur-sm">
            <span className="block text-blue-100 text-xs uppercase tracking-wider mb-1">Weight</span>
            <p className="font-semibold text-lg">{weight?.total} {weight?.unit}</p>
            <p className="text-blue-200 text-xs">Aluminum</p>
          </div>
        </div>

        {/* Cost Summary */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-blue-100">
            <span>Aluminum Cost</span>
            <span className="font-medium">₹{totals.aluminum?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-blue-100">
            <span>Materials & Fittings</span>
            <span className="font-medium">₹{totals.materials?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-blue-100">
            <span>Labour Charges</span>
            <span className="font-medium">₹{totals.labour?.toLocaleString()}</span>
          </div>
        </div>

        {/* Grand Total */}
        <div className="pt-4 border-t border-blue-400/50">
          <div className="flex justify-between items-end">
            <span className="text-lg text-blue-100 mb-1">Grand Total</span>
            <motion.span
              key={totals.grandTotal}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-extrabold tracking-tight"
            >
              ₹{totals.grandTotal?.toLocaleString()}
            </motion.span>
          </div>
          <p className="text-right text-blue-200 text-xs mt-1">*Includes all selected components</p>
        </div>
      </div>
    </div>
  );
};

export default TotalDisplay;
