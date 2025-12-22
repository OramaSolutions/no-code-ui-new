import React, { useEffect } from "react";
import {
  FiSquare,
  FiMove,
  FiZoomIn,
  FiZoomOut,
  FiTrash2,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { FaSkullCrossbones, FaUndo, FaLock, FaLockOpen, FaMagic } from "react-icons/fa";
import { TbCancel } from "react-icons/tb";
import { FaDrawPolygon, FaImage } from "react-icons/fa";
const RightBar = ({
  setTool,
  tool,
  zoomLevel,
  handleZoom,
  handleResetZoom,
  setSegments,
  selectedSegmentForModal,
  setSelectedSegmentForModal,
  isLocked,
  setIsLocked,
  handleNull,
  setShowSegments,
  showSegments,
  deleteAllSegment,
  setShowSegmentModal,
  directInferenceMode,
  setDirectInferenceMode,
  showMask,
  setShowMask,
}) => {
  // Keyboard shortcuts (unchanged)
  useEffect(() => {
    const handleKeyPress = (e) => {
      const tag = e.target.tagName.toLowerCase();
      const isInput = tag === "input" || tag === "textarea";
      if (isInput) return;

      switch (e.key.toLowerCase()) {
        case 'w':
          e.preventDefault();
          setTool("polygon");
          break;
        case 'a':
          e.preventDefault();
          setTool("move");
          break;
        case 'e':
          e.preventDefault();
          setShowSegments((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setTool]);

  // Mouse wheel controls (unchanged)
  useEffect(() => {


    const handleMouseDown = (e) => {
      const tag = e.target.tagName.toLowerCase();
      const isInput = tag === "input" || tag === "textarea";
      if (e.button === 1 && !isInput) {
        e.preventDefault();
        handleResetZoom();
      }
    };


    document.addEventListener('mousedown', handleMouseDown);

    return () => {

      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleZoom, handleResetZoom]);



  return (
    <div className="w-10 bg-gray-900 p-1 border-l border-gray-700 flex flex-col items-center justify-center space-y-3">
      {/* Direct Inference Button */}
      <button
        onClick={() => setDirectInferenceMode((prev) => !prev)}
        className={`p-1.5 rounded-md transition-all duration-150 ${directInferenceMode
          ? "bg-purple-600 text-white"
          : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
        title={directInferenceMode ? 'Exit Direct Inference' : 'Direct Inference Mode'}
      >
        <FaMagic className="text-xs" />
      </button>

      {/* Mask/Points Toggle - Only in Direct Inference Mode */}
      {directInferenceMode && (
        <button
          onClick={() => setShowMask((prev) => !prev)}
          className={`p-1.5 rounded-md transition-all duration-150 ${showMask
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          title={showMask ? 'Show Points' : 'Show Mask'}
        >
          {showMask ? <FaImage className="text-xs" /> : <FaDrawPolygon className="text-xs" />}
        </button>
      )}

      {/* Drawing Tools Section */}
      <div className="flex flex-col items-center space-y-2 w-full">
        <button
          onClick={() => setTool("move")}
          className={`p-1.5 rounded-md transition-all duration-150 ${tool === "move"
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          title="Move/Zoom (A)"
        >
          <FiMove className="text-xs" />
        </button>

        <button
          onClick={() => setTool("polygon")}
          className={`p-1.5 rounded-md transition-all duration-150 ${tool === "polygon"
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          title="Draw Polygon (W)"
        >
          <FiSquare className="text-xs" />
        </button>
      </div>

      {/* Visibility & Lock Section */}
      <div className="flex flex-col items-center space-y-2 w-full border-t border-gray-700 pt-2">
        <button
          onClick={() => setShowSegments(!showSegments)}
          className={`p-1.5 rounded-md transition-all duration-150 ${showSegments
            ? "bg-gray-700 text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          title="Toggle Segments Visibility (E)"
        >
          {showSegments ? <FiEyeOff className="text-xs" /> : <FiEye className="text-xs" />}
        </button>

        <button
          onClick={() => setIsLocked(!isLocked)}
          className={`p-1.5 rounded-md transition-all duration-150 ${isLocked
            ? "bg-purple-600 text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          title="Lock The Segments In Place"
        >
          {isLocked ? <FaLock className="text-xs" /> : <FaLockOpen className="text-xs" />}
        </button>
      </div>

      {/* Zoom Controls Section */}
      <button
        onClick={() => handleZoom("in")}
        className="p-1.5 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all duration-150"
        title="Zoom In"
      >
        <FiZoomIn className="text-xs" />
      </button>

      <button
        onClick={() => handleZoom("in")}
        className="p-1.5 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all duration-150"
        title="Zoom Out"
      >
        <FiZoomOut className="text-xs" />
      </button>

      {/* Edit Tools Section */}
      <div className="flex flex-col items-center space-y-2 w-full border-t border-gray-700 pt-2">
        <button
          onClick={handleNull}
          className="p-1.5 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all duration-150"
          title="Set as Null"
        >
          <TbCancel className="text-xs" />
        </button>
        <button
          onClick={() => {
            if (selectedSegmentForModal) {
              setSegments((prev) =>
                prev.filter((rect) => rect.id !== selectedSegmentForModal?.id)
              );
              setSelectedSegmentForModal(null);
              setShowSegmentModal(false)
            }
          }}
          disabled={!selectedSegmentForModal?.id}
          className={`p-1.5 rounded-md transition-all duration-150 ${!selectedSegmentForModal?.id
            ? "bg-gray-800 text-gray-500"
            : "bg-gray-800 text-gray-300 hover:bg-red-700"}`}
          title="Delete Selected (Backspace)"
        >
          <FiTrash2 className="text-xs" />
        </button>
      </div>

      {/* Danger Zone Section */}
      <div className="flex flex-col items-center space-y-2 w-full border-t border-gray-700 pt-2">
        <button
          onClick={deleteAllSegment}
          className="p-1.5 rounded-md bg-gray-800 text-red-400 hover:bg-red-900 transition-all duration-150 group"
          title="Delete All Segments"
        >
          <div className="relative">
            <FaSkullCrossbones className="text-xs" />
            <span className="absolute -right-0.5 -top-0.5 w-1.5 h-1.5 bg-red-500 rounded-full group-hover:animate-ping"></span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default RightBar;