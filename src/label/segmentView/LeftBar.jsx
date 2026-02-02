import React from "react";
import { Link } from "react-router-dom";
import {
  FiChevronLeft,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { FaMagic } from "react-icons/fa";

const LeftBar = ({
  classes,
  setClasses,
  setShowClassModal,
  setModalMode,
  setNewClassName,
  segments,
  setSegments,
  projectName,
  userName,
  selectedSegmentForModal,
  setSelectedSegmentForModal,
  setShowSegmentModal,
  setSegmentModalPosition,
  stageRef,
  scale,
  ProjectOverviewLink,
  inferenceLoading = false,
  directInferenceMode,

  directInferenceLoading,
  samActive,
}) => {

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this segment?")) {
      const updatedSegments = segments.filter(segment => segment.id !== id);
      setSegments(updatedSegments);
      if (selectedSegmentForModal?.id === id) {
        setSelectedSegmentForModal(null);
        setShowSegmentModal(false);
      }
    }
  };

  const handleSegmentClick = (segment) => {
    if (selectedSegmentForModal?.id === segment.id) {
      setSelectedSegmentForModal(null);
      setShowSegmentModal(false);
    } else {
      setSelectedSegmentForModal(segment);

      const points = segment.points;
      if (points && points.length > 0) {
        const stage = stageRef.current;
        if (stage) {
          // Calculate centroid in stage coordinates
          let centroid = { x: 0, y: 0 };
          points.forEach(([x, y]) => {
            centroid.x += x;
            centroid.y += y;
          });
          centroid.x /= points.length;
          centroid.y /= points.length;



          // Get the stage container's position
          const stageRect = stage.container().getBoundingClientRect();

          // Calculate the absolute position
          setSegmentModalPosition({
            x: (stageRect.left + (centroid.x * scale)),
            y: (stageRect.top + (centroid.y * scale)),
          });

          setShowSegmentModal(true);
        }
      }
    }
  };

  const getClassCounts = () => {
    const counts = {};

    segments.forEach(segment => {
      if (segment.label && segment.label.name) {
        counts[segment.label.name] = (counts[segment.label.name] || 0) + 1;
      }
    });

    return counts;
  };

  const classCounts = getClassCounts();

  return (
    <div className="w-48 bg-gray-100 p-4 border-r flex flex-col h-full">
      <Link
        to={ProjectOverviewLink}
        className="mb-4 bg-white px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-500 hover:underline flex items-center"
      >
        <FiChevronLeft /> Project Overview
      </Link>

      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Segments</h3>
        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
          {segments.length} total
        </span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <ul className="space-y-1 text-xs text-gray-700">
          {segments.map((segment) => (
            <li
              key={segment.id}
              className={`flex items-center justify-between px-2 py-0.5 rounded group cursor-pointer ${selectedSegmentForModal?.id === segment.id
                ? "bg-blue-100 border border-blue-300"
                : "hover:bg-gray-200"
                }`}
              onClick={() => handleSegmentClick(segment)}
            >
              <div className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{
                    backgroundColor: segment.label?.color || "#03a1fc",
                    opacity: 0.3,
                  }}
                />
                <span className="truncate">
                  {segment.label?.name || "Unlabeled"}
                  {selectedSegmentForModal?.id === segment.id && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({classCounts[segment.label?.name || "Unlabeled"] || 0})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(segment.id);
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

      {/* Single inference button, changes behavior based on mode */}

      {directInferenceLoading && (
        <div className="flex text-xs items-center justify-center w-full p-2 bg-gray-800 text-white rounded mt-4">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {samActive ? 'Running Inference...' : 'Preparing the AI, first time detection may take upto 30 seconds...'}
        </div>
      )}


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