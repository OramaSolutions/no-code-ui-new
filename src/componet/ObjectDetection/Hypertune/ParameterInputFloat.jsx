import React from "react";
import { MdInfo } from "react-icons/md";

function ParameterInputFloat({ name, label, tooltip, value, onChange }) {
  const handleChange = (e) => {
    const val = e.target.value;

    // allow empty input
    if (val === "") {
      onChange("");
      return;
    }

    const num = Number(val);

    // ignore invalid numbers
    if (isNaN(num)) return;

    // clamp between 0 and 1
    if (num < 0 || num > 1) return;

    onChange(num);
  };

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
        step="0.01"
        min={0}
        max={1}
        name={name}
        value={value}
        onChange={handleChange}
        onWheel={(e) => e.target.blur()}
        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
        placeholder="0.0 – 1.0"
      />
    </div>
  );
}

export default ParameterInputFloat;
