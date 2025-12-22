import React, { useState } from 'react';
import { FiSliders, FiChevronDown, FiChevronUp, FiSettings } from 'react-icons/fi';

const RefinementControlPanel = ({ 
  lockedHoverSegment, 
  inclusionPoints, 
  exclusionPoints, 
  batchMode, 
  setBatchMode,
  undoPoints,
  redoPoints,
  submitBatchPoints,
  pointHistory,
  onUnlock,
  onFinishRefinement,
  inferComplexity,
  setInferComplexity
}) => {
  const [tempComplexity, setTempComplexity] = useState(inferComplexity);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!lockedHoverSegment) return null;

  const handleComplexityChange = (value) => {
    setTempComplexity(value);
    setInferComplexity(value); // Apply immediately for real-time feedback
  };

  return (
    <div 
      className={`absolute top-4 right-12 z-40 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${
        isCollapsed ? 'w-12' : 'min-w-64'
      }`}
    >
      {/* Header - Always Visible */}
      <div 
        className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200"
        onClick={() => setIsCollapsed(prev => !prev)}
      >
        <div className="flex items-center gap-2">
          <FiSettings className="text-gray-600 text-sm" />
          {!isCollapsed && <span className="text-sm font-semibold text-gray-800">Mask Refinement</span>}
        </div>
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent collapse when clicking unlock
                onUnlock();
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Unlock
            </button>
          )}
          {isCollapsed ? (
            <FiChevronUp className="text-gray-400 text-xs" />
          ) : (
            <FiChevronDown className="text-gray-400 text-xs" />
          )}
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="p-4">
          {/* Complexity Slider Section */}
          <div className="mb-3 p-2 bg-gray-50 rounded border">
            <div className="flex items-center gap-2 mb-2">
              <FiSliders className="text-gray-600 text-sm" />
              <span className="text-xs font-medium text-gray-700">Inference Complexity</span>
              <span className="text-xs text-gray-500 ml-auto">{tempComplexity}</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={tempComplexity}
              onChange={(e) => handleComplexityChange(e.target.value)}
              className="w-full accent-blue-500 h-1"
            />
            <div className="flex justify-between text-[0.65rem] text-gray-400 mt-1">
              <span>Simple</span>
              <span>Complex</span>
            </div>
          </div>
          
          {/* Point Stats */}
          <div className="space-y-2 text-xs text-gray-600 mb-3">
            <div className="flex justify-between">
              <span>Inclusion points:</span>
              <span className="font-medium text-green-600">{inclusionPoints.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Exclusion points:</span>
              <span className="font-medium text-red-600">{exclusionPoints.length}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                onClick={undoPoints}
                disabled={pointHistory.currentIndex <= 0}
                className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded"
              >
                Undo
              </button>
              <button
                onClick={redoPoints}
                disabled={pointHistory.currentIndex >= pointHistory.inclusion.length - 1}
                className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded"
              >
                Redo
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="batchMode"
                checked={batchMode}
                onChange={(e) => setBatchMode(e.target.checked)}
                className="text-blue-600"
              />
              <label htmlFor="batchMode" className="text-xs text-gray-700">
                Batch mode
              </label>
            </div>

            {batchMode && (
              <button
                onClick={submitBatchPoints}
                className="w-full px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update Mask
              </button>
            )}

            <button
              onClick={onFinishRefinement}
              className="w-full px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
            >
              Finish Refinement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefinementControlPanel;
