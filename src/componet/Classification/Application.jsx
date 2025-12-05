import React, { useState } from "react";
import { MdDownload } from "react-icons/md";

const applications = [
  {
    id: 1,
    title: "Single Camera Assembly Verification",
    description:
      "AI-powered assembly verification using a single camera vision system. Ensures precise assembly quality and reduces manual inspection effort.",
    image:
      "https://via.placeholder.com/400x250.png?text=Camera+Verification",
  },
  {
    id: 2,
    title: "Multi-Camera Inspection",
    description:
      "Combines multiple cameras for high-accuracy inspection. Ideal for 360° product checks and environments needing redundant vision inputs.",
    image: "https://via.placeholder.com/400x250.png?text=Multi+Camera",
  },
  {
    id: 3,
    title: "defectdetection System",
    description:
      "Automates real-time defectdetection in the production line, reducing errors and improving throughput in critical manufacturing systems.",
    image: "https://via.placeholder.com/400x250.png?text=Defect+Detection",
  },
];

const Application = () => {
  const [selectedApp, setSelectedApp] = useState(null);

  const handleDownload = (appTitle) => {
    alert(`Downloading ${appTitle}... (dummy call)`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-10">
        Applications
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {applications.map((app) => {
          const isSelected = selectedApp === app.id;
          return (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app.id)}
              className={`cursor-pointer bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 ${
                isSelected
                  ? "ring-4 ring-blue-500 shadow-2xl scale-105"
                  : "hover:shadow-xl"
              }`}
            >
              <img
                src={app.image}
                alt={app.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800">
                  {app.title}
                </h2>
                <p className="text-gray-600 text-sm mt-2">{app.description}</p>

                {/* Show download button only if selected */}
                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent card click overriding selection
                      handleDownload(app.title);
                    }}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <MdDownload size={18} />
                    Download
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Application;
