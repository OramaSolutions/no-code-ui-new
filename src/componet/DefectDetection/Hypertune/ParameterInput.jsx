import React from 'react';
import { MdInfo } from 'react-icons/md';

function ParameterInput({ name, label, tooltip, value, onChange }) {
    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
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
            <input
                type="number"
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
                onWheel={(e) => e.target.blur()}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                placeholder={`Enter ${label.toLowerCase()}`}
            />
        </div>
    );
}

export default ParameterInput;
