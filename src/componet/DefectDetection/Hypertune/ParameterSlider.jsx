import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { MdInfo } from 'react-icons/md';

function ParameterSlider({ name, label, tooltip, value = 0, min, max, step, onChange, showTrainingValidation }) {
    return (
        <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-6 rounded-xl border border-indigo-100">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
                {label}
                {tooltip && (
                    <div className="group relative">
                        <MdInfo className="w-4 h-4 text-slate-400 cursor-help" />
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg z-10">
                            {tooltip}
                        </div>
                    </div>
                )}
            </label>

            <div className="flex items-center justify-between mb-2 text-xs text-slate-600">
                {showTrainingValidation ? (
                    <div className="w-full flex justify-between">
                        <span className="text-red-600 font-semibold">Validation: {(value ? (value * 100).toFixed(0) : '0')}%</span>
                        <span className="text-green-600 font-semibold">Training: {(value ? ((1 - value) * 100).toFixed(0) : '100')}%</span>
                    </div>
                ) : (
                    <>
                        <span>Min: {min}</span>
                        <span className="text-base font-bold text-indigo-600">{value ? value.toFixed(1) : '0.0'}</span>
                        <span>Max: {max}</span>
                    </>
                )}
            </div>
 
            <Slider
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                railStyle={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e2e8f0',
                }}
                trackStyle={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#4F46E5',
                }}
                handleStyle={{
                    height: 20,
                    width: 20,
                    marginTop: -6,
                    backgroundColor: '#ffffff',
                    border: '3px solid #4F46E5',
                    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
                    opacity: 1,
                }}
            />
        </div>
    );
}

export default ParameterSlider;
