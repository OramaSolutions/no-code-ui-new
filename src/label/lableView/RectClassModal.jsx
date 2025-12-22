import React, { useEffect, useRef } from "react";

const RectClassModal = ({
  position,
  classes,
  selectedClass,
  setSelectedClass,
  onClose,
  onSave,
}) => {
  const selectRef = useRef(null);

  useEffect(() => {
    // Focus the select input when modal opens
    if (selectRef.current) {
      selectRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && selectedClass?.name) {
      onSave(selectedClass);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed z-20 bg-white p-4 rounded shadow-lg border border-gray-300 w-[200px] h-[150px]"
      style={{
        left: `${position.x + 20}px`,
        top: `${position.y + 20}px`,
      }}
      onKeyDown={handleKeyDown}
    >
      <h3 className="text-md font-semibold mb-2">Assign Class</h3>
      <select
        ref={selectRef}
        value={selectedClass?.name || ''}
        onChange={(e) => {
          const selected = classes.find((cls) => cls.name === e.target.value);
          setSelectedClass(selected);
        }}
        className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select a class</option>
        {classes.map((cls, index) => (
          <option key={index} value={cls.name}>
            {cls.name}
          </option>
        ))}
      </select>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(selectedClass)}
          className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm"
          disabled={!selectedClass?.name}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default RectClassModal