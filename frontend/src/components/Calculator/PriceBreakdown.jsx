import React from 'react';
import { motion } from 'framer-motion';

const PriceBreakdown = ({ data, selectedItems }) => {
  const { breakdown } = data;
  if (!breakdown) return null;
  // If selectedItems not passed, default to showing everything (fallback)
  const isSelected = (key) => !selectedItems || selectedItems[key];

  const Item = ({ label, detail, cost, colorClass = "bg-gray-50 text-gray-700", delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`p-3 rounded-xl flex justify-between items-center ${colorClass} mb-2`}
    >
      <div>
        <h4 className="font-medium text-sm">{label}</h4>
        {detail && <p className="text-xs opacity-80 mt-0.5">{detail}</p>}
      </div>
      <span className="font-bold text-sm">₹{cost?.toLocaleString()}</span>
    </motion.div>
  );

  return (
    <div className="space-y-1">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Detailed Breakdown</h3>

      <Item
        label="Aluminum Profile"
        detail={`${breakdown.aluminum.weight} kg @ ₹${breakdown.aluminum.rate}/kg`}
        cost={breakdown.aluminum.cost}
        colorClass="bg-blue-50 text-blue-900"
        delay={0.05}
      />

      {isSelected('glass') && breakdown.glass.cost > 0 && (
        <Item
          label="Glass"
          detail={`${breakdown.glass.area} sq.ft @ ₹${breakdown.glass.rate}/sq.ft`}
          cost={breakdown.glass.cost}
          colorClass="bg-green-50 text-green-900"
          delay={0.1}
        />
      )}

      {isSelected('glassRubber') && breakdown.glassRubber.cost > 0 && (
        <Item
          label="Glass Rubber"
          detail={`${breakdown.glassRubber.length} ft @ ₹${breakdown.glassRubber.rate}/ft`}
          cost={breakdown.glassRubber.cost}
          delay={0.15}
        />
      )}

      {isSelected('mosquitoNet') && breakdown.mosquitoNet && breakdown.mosquitoNet.cost > 0 && (
        <Item
          label="Mosquito Net"
          detail={`${breakdown.mosquitoNet.area} sq.ft`}
          cost={breakdown.mosquitoNet.cost}
          colorClass="bg-purple-50 text-purple-900"
          delay={0.25}
        />
      )}

      {isSelected('uChannel') && breakdown.hardwareLinear && breakdown.hardwareLinear.cost > 0 && (
        <Item
          label="Hardware (Linear)"
          detail={`U-Channel & Screws (Base + ${breakdown.hardwareLinear.perimeter}ft perimeter)`}
          cost={breakdown.hardwareLinear.cost}
          delay={0.3}
        />
      )}

      {isSelected('lock') && breakdown.lock && breakdown.lock.cost > 0 && (
        <Item label="Lock" cost={breakdown.lock.cost} delay={0.35} />
      )}

      {isSelected('bearing') && breakdown.bearing && breakdown.bearing.cost > 0 && (
        <Item
          label="Bearings"
          detail="Set of 6"
          cost={breakdown.bearing.cost}
          delay={0.4}
        />
      )}

      {isSelected('labour') && breakdown.labour && breakdown.labour.cost > 0 && (
        <Item
          label="Fabrication Labour"
          detail={`Area: ${breakdown.labour.area} sq.ft`}
          cost={breakdown.labour.cost}
          colorClass="bg-orange-50 text-orange-900"
          delay={0.5}
        />
      )}

    </div>
  );
};

export default PriceBreakdown;
