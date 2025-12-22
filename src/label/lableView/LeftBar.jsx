import React from "react";
import { Link } from "react-router-dom";
import {
  FiChevronLeft,
  FiPlus,
  FiTrash2,
  FiEdit2,

} from "react-icons/fi";
import { FaMagic } from "react-icons/fa";

const LeftBar = ({
  classes,
  setClasses,
  setShowClassModal,
  setModalMode,
  setNewClassName,
  rectangles,
  setRectangles,
  projectName,
  ProjectOverviewLink,
  selectedRectForModal,
  setSelectedRectForModal,
  setShowRectModal,
  setRectModalPosition,
  stageRef,
  onMagic, // new prop
  inferenceLoading = false, // new prop
}) => {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this rectangle?")) {
      const updatedRectangles = rectangles.filter(rect => rect.id !== id);
      setRectangles(updatedRectangles);
      if (selectedRectForModal?.id === id) {
        setSelectedRectForModal(null);
        setShowRectModal(false);
      }
    }
  };

  const handleRectClick = (rect) => {
    if (selectedRectForModal?.id === rect.id) {
      // If already selected, deselect
      setSelectedRectForModal(null);
      setShowRectModal(false);
    } else {
      // Select the rectangle
      setSelectedRectForModal(rect);

      // Calculate modal position (center of rectangle)
      const stage = stageRef.current;
      if (stage) {
        const rectCenter = {
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2
        };

        const stageRect = stage.container().getBoundingClientRect();
        setRectModalPosition({
          x: stageRect.left + rectCenter.x,
          y: stageRect.top + rectCenter.y
        });
        setShowRectModal(true);
      }
    }
  };

  const getClassCounts = () => {
    const counts = {};

    rectangles.forEach(rect => {
      if (rect.class && rect.class.name) {
        counts[rect.class.name] = (counts[rect.class.name] || 0) + 1;
      }
    });

    return counts;
  };

  const classCounts = getClassCounts();

  return (
    <div className="w-48 bg-gray-100 p-4 flex flex-col h-full">
      <Link
        to={ProjectOverviewLink}
        className="mb-4 bg-white px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-500 hover:underline flex items-center"
      >
        <FiChevronLeft /> Project Overview
      </Link>

      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Rectangles</h3>
        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
          {rectangles.length} total
        </span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <ul className="space-y-1 text-xs text-gray-700">
          {rectangles.map((rect) => (
            <li
              key={rect.id}
              className={`flex items-center justify-between px-2 py-0.5 rounded group cursor-pointer ${selectedRectForModal?.id === rect.id
                  ? 'bg-blue-100 border border-blue-300'
                  : 'hover:bg-gray-200'
                }`}
              onClick={() => handleRectClick(rect)}
            >
              <div className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{
                    backgroundColor: rect.class?.color || '#03a1fc',
                    opacity: 1
                  }}
                />
                <span className="truncate">
                  {rect.class?.name || 'Unlabeled'}
                  {selectedRectForModal?.id === rect.id && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({classCounts[rect.class?.name || 'Unlabeled'] || 0})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(rect.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* <button
        onClick={onMagic}
        className={`mt-2 flex items-center justify-center w-full px-3 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 ${inferenceLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
        title="Run Magic Inference"
        disabled={inferenceLoading}
      >
        {inferenceLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Running Inference...
          </>
        ) : (
          <>
            <FaMagic className="mr-1" />
            Run Inference
          </>
        )}
      </button> */}
      <button
        onClick={() => {
          setModalMode("add");
          setNewClassName("");
          setShowClassModal(true);
        }}
        className="mt-4 flex items-center justify-center w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <FiPlus className="mr-1" />
        Add Class
      </button>
    </div>
  );
};

export default LeftBar;