import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const MaterialCheckboxes = ({ selectedItems, onChange, breakdown }) => {
  // Map backend keys to frontend display list
  // Note: 'hardwareLinear' covers both U-Channel and Screws in the new logic.
  // We will map both uChannel and screw checkboxes to this value for display if they exist,
  // but strictly speaking, in the new logic they are combined.
  const materials = [
    { key: 'glass', label: 'Glass', cost: breakdown?.glass?.cost || 0 },
    { key: 'mosquitoNet', label: 'Mosquito Net', cost: breakdown?.mosquitoNet?.cost || 0 },
    { key: 'glassRubber', label: 'Glass Rubber', cost: breakdown?.glassRubber?.cost || 0 },

    // In new logic, U-Channel + Screws are Hardware Linear.
    // We display them separately to keep UI consistent, but they might share costs or be split.
    // Since backend combines them into 'hardwareLinear', let's just show that split or 
    // for now, we'll assign the full hardwareLinear cost to 'uChannel' for display simplicity 
    // if we can't split it, OR better: we separate them if the backend supports it.
    // THE BACKEND returns 'hardwareLinear' and 'lock' and 'bearing'. 
    // Let's assume uChannel accounts for ~55% and screws ~45% of linear cost if we forced a split,
    // BUT simpler: let's combine them in the UI or just show "Hardware (Linear)"
    // The user wants "U-Channel" and "Screws" checkboxes. 
    // If backend returns `hardwareLinear`, we'll display it under one if the other is unchecked?
    // Let's try to grab specific costs if available, else fallback.

    { key: 'uChannel', label: 'U-Channel & Screws (Linear)', cost: breakdown?.hardwareLinear?.cost || 0 },
    // We'll hide the separate 'Screw' entry to avoid double counting visually, or make it 0

    { key: 'lock', label: 'Lock', cost: breakdown?.lock?.cost || 0 },
    { key: 'bearing', label: 'Bearings', cost: breakdown?.bearing?.cost || 0 },
    { key: 'labour', label: 'Labour Charges', cost: breakdown?.labour?.cost || 0 },
  ];

  const handleCheckboxChange = (e) => {
    onChange(e);
  };

  return (
    <div className="space-y-2">
      {materials.map((material, index) => {
        // Skip if cost is undefined (e.g. trackRubber which was removed from logic)
        if (material.label === 'Track Rubber' && !material.cost) return null;

        const isChecked = selectedItems[material.key] || false;

        return (
          <motion.label
            key={material.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer group
              ${isChecked
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                ${isChecked ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300 group-hover:border-blue-400'}`}>
                {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>

              <input
                type="checkbox"
                name={material.key}
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="hidden"
              />

              <span className={`font-medium transition-colors ${isChecked ? 'text-blue-900' : 'text-gray-700'}`}>
                {material.label}
              </span>
            </div>

            <span className={`text-sm font-bold transition-colors ${isChecked ? 'text-blue-700' : 'text-gray-400'}`}>
              ₹{material.cost.toLocaleString()}
            </span>
          </motion.label>
        );
      })}
    </div>
  );
};

export default MaterialCheckboxes;
