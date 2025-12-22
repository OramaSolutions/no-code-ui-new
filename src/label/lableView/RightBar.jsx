import React, { useEffect } from "react";

import {
  FiSquare,
  FiMove,
  FiZoomIn,
  FiZoomOut,
  FiTrash2,
  FiKey,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { FaUndo, FaLockOpen, FaLock } from "react-icons/fa";
import { TbCancel } from "react-icons/tb";

const RightBar = ({
  setTool,
  tool,
  zoomLevel,
  handleZoom,
  handleResetZoom,
  setRectangles,
  selectedRectForModal,
  setSelectedRectForModal,
  setShowRectModal,
  isLocked,
  setIsLocked,
  handleNull,
  setMaster,
  setShowSegments,
  showSegments
}) => {
  // Add keyboard shortcuts for tool selection
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle if not in an input field
      const tag = e.target.tagName.toLowerCase();
      const isInput = tag === "input" || tag === "textarea";
      if (isInput) return;

      switch (e.key.toLowerCase()) {
        case 'w':
          e.preventDefault();
          setTool("rectangle");
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

  // // Add mouse wheel controls for zoom
  // useEffect(() => {
  //   const handleWheel = (e) => {
  //     // Only handle if not in an input field and not holding any modifier keys
  //     const tag = e.target.tagName.toLowerCase();
  //     const isInput = tag === "input" || tag === "textarea";
  //     if (isInput || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;

  //     // Prevent page scrolling
  //     e.preventDefault();

  //     if (e.deltaY < 0) {
  //       // Wheel up - zoom in
  //       handleZoom("in");
  //     } else if (e.deltaY > 0) {
  //       // Wheel down - zoom out
  //       handleZoom("out");
  //     }
  //   };

  //   const handleMouseDown = (e) => {
  //     // Only handle middle button click and not in an input field
  //     const tag = e.target.tagName.toLowerCase();
  //     const isInput = tag === "input" || tag === "textarea";
  //     if (e.button === 1 && !isInput) {
  //       e.preventDefault();
  //       handleResetZoom();
  //     }
  //   };

  //   // Add event listeners to the whole document
  //   document.addEventListener('wheel', handleWheel, { passive: false });
  //   document.addEventListener('mousedown', handleMouseDown);

  //   return () => {
  //     document.removeEventListener('wheel', handleWheel);
  //     document.removeEventListener('mousedown', handleMouseDown);
  //   };
  // }, [handleZoom, handleResetZoom]);


  // useEffect(() => {
  //   const handleKeyPress = (e) => {
  //     const tag = e.target.tagName.toLowerCase();
  //     const isInput = tag === "input" || tag === "textarea";
  //     if (isInput) return;

  //     switch (e.key.toLowerCase()) {
  //       case 'w':
  //         e.preventDefault();
  //         setTool("polygon");
  //         break;
  //       case 'a':
  //         e.preventDefault();
  //         setTool("move");
  //         break;
  //       case 'e':
  //         e.preventDefault();
  //         setShowSegments((prev) => !prev);
  //         break;
  //       default:
  //         break;
  //     }
  //   };

  //   window.addEventListener('keydown', handleKeyPress);
  //   return () => window.removeEventListener('keydown', handleKeyPress);
  // }, [setTool]);

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
    <div className="w-16 bg-gray-900 p-2 flex flex-col items-center space-y-4 border-r border-gray-800">
      <button
        onClick={() => setTool("move")}
        className={`p-2 rounded-md transition-colors duration-150 ${tool === "move"
            ? "bg-blue-600 text-white"
            : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          }`}
        title="Move/Zoom (A)"
      >
        <FiMove className="text-lg" />
      </button>

      <button
        onClick={() => setTool("rectangle")}
        className={`p-2 rounded-md transition-colors duration-150 ${tool === "rectangle"
            ? "bg-blue-600 text-white"
            : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          }`}
        title="Draw Rectangle (W)"
      >
        <FiSquare className="text-lg" />
      </button>

      <button
        onClick={setMaster}
        className="p-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors duration-150"
        title="Set As Master"
      >
        <FiKey className="text-lg" />
      </button>

      <button
        onClick={() => setShowSegments(!showSegments)}
        className="p-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors duration-150"
        title="Toggle Segments Visibility"
      >
        {showSegments ? (
          <FiEyeOff className="text-lg" />
        ) : (
          <FiEye className="text-lg" />
        )}
      </button>

      <button
        onClick={() => setIsLocked(!isLocked)}
        title="Lock The Boxes In Place"
        className={`p-2 rounded-md transition-colors duration-150 ${isLocked
            ? "bg-purple-600 text-white"
            : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          }`}
      >
        {isLocked ? (
          <FaLock className="text-lg" />
        ) : (
          <FaLockOpen className="text-lg" />
        )}
      </button>

      <div className="border-t border-gray-800 w-full"></div>

      {/* zoom control */}
      <div className="text-xs text-center text-gray-400 font-medium">
        {Math.round(zoomLevel * 100)}%
      </div>

      <button
        onClick={() => handleZoom("in")}
        className="p-1.5 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150"
        title="Zoom In"
      >
        <FiZoomIn className="text-xs" />
      </button>

      <button
        onClick={() => handleZoom("out")}
        className="p-1.5 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150"
        title="Zoom Out"
      >
        <FiZoomOut className="text-xs" />
      </button>

      <button
        onClick={handleResetZoom}
        className="p-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors duration-150"
        title="Reset Zoom"
      >
        <span className="text-lg">
          <FaUndo className="text-sm" />
        </span>
      </button>

      <button
        onClick={handleNull}
        className="p-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors duration-150"
        title="Set as Null"
      >
        <span className="text-lg">
          <TbCancel className="text-md" />
        </span>
      </button>

      <button
        onClick={() => {
          if (selectedRectForModal) {
            setRectangles((prev) =>
              prev.filter((rect) => rect.id !== selectedRectForModal?.id)
            );
            setSelectedRectForModal(null);
            setShowRectModal(false);
          }
        }}
        disabled={!selectedRectForModal?.id}
        className="p-2 rounded-md text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors duration-150 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400"
        title="Delete Selected (Backspace)"
      >
        <FiTrash2 className="text-lg" />
      </button>
    </div>
  );
};

export default RightBar;

