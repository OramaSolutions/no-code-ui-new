import React from 'react';
import { motion } from 'framer-motion';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export const SliderRow = ({ title, min, max, step, value, onChange }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-1 px-4 py-2 bg-white rounded-xl border border-slate-200"
    >
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{title}</label>
        <motion.span
          key={value}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          {value}
        </motion.span>
      </div>

      <div className="relative">
        <Slider
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          trackStyle={{
            background: 'linear-gradient(to right, #3B82F6, #6366F1, #4F46E5)',
            height: 6,
          }}
          railStyle={{
            backgroundColor: '#E5E7EB',
            height: 6,
          }}
          handleStyle={{
            borderColor: '#4F46E5',
            backgroundColor: '#fff',
            opacity: 1,
            width: 20,
            height: 20,
            marginTop: -7,
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
          }}
        />
        
        {/* Progress indicator */}
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </motion.div>
  );
};
