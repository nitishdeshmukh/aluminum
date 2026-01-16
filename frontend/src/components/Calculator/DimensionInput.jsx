import React from 'react';
import { Ruler, ArrowUpDown, ArrowLeftRight } from 'lucide-react';

const DimensionInput = ({ width, height, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
            <ArrowLeftRight className="w-4 h-4 text-blue-500" />
            Width (ft)
          </label>
          <div className="relative group">
            <input
              type="number"
              name="width"
              value={width}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold text-gray-800"
              placeholder="0.0"
              min="1"
              step="0.1"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              ft
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
            <ArrowUpDown className="w-4 h-4 text-blue-500" />
            Height (ft)
          </label>
          <div className="relative group">
            <input
              type="number"
              name="height"
              value={height}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold text-gray-800"
              placeholder="0.0"
              min="1"
              step="0.1"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              ft
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex items-center gap-2 text-xs text-blue-800">
        <Ruler className="w-4 h-4" />
        <span>Total Area: <span className="font-bold">{(width * height).toFixed(2)} sq.ft</span></span>
      </div>
    </div>
  );
};

export default DimensionInput;
