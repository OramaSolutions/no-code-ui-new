import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MdCheckCircle,MdOutlineVisibility, MdError, MdOutlineHourglassEmpty, MdArrowForward } from "react-icons/md";

function DefectTrainPanel({ onVisualize, onFail }) {
  const { defectTrainData, loading, error } = useSelector(
    (state) => state.defectDetection
  );

  /* ===================== ERROR ===================== */
  if (error) {
    onFail?.(error);
    return null;
  }

  /* ===================== LOADING ===================== */
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-12 shadow-lg border border-blue-100"
      >
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="w-28 h-28 border-8 border-blue-100 rounded-full" />
            <div className="absolute top-0 left-0 w-28 h-28 border-8 border-transparent border-t-blue-500 rounded-full animate-spin" />
            <div className="absolute top-0 left-0 w-28 h-28 border-8 border-transparent border-b-blue-400 rounded-full animate-spin animation-delay-1000" />
          </div>
          <div className="text-center space-y-3">
            <h4 className="text-2xl font-bold text-gray-800">Training in Progress</h4>
            <p className="text-gray-600">This may take a few minutes. Please wait...</p>
            <div className="flex items-center justify-center gap-2 text-blue-500">
              <MdOutlineHourglassEmpty className="animate-pulse" />
              <span className="text-sm">Processing your model</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ===================== NO DATA ===================== */
  if (!defectTrainData?.confusion_matrix) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-12 shadow-lg border border-blue-100"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <MdOutlineHourglassEmpty className="w-10 h-10 text-blue-500" />
          </div>
          <div className="text-center space-y-2">
            <h4 className="text-xl font-bold text-gray-800">Waiting for Results</h4>
            <p className="text-gray-600">Training results will appear here shortly</p>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ===================== RESULTS ===================== */
  const cm = defectTrainData.confusion_matrix;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden"
    >
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Training Results</h3>
            <p className="text-blue-100 text-sm">Model performance metrics</p>
          </div>
          <div className="px-4 py-2 bg-blue-400/20 rounded-lg">
            <span className="text-white font-semibold">Completed</span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                Class
              </th>
              <th className="px-8 py-5 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                Correct Predictions
              </th>
              <th className="px-8 py-5 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                Incorrect Predictions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-blue-100">
            {["good", "bad"].map((cls, index) => (
              <motion.tr
                key={cls}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1}}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-blue-50/50 transition-colors"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${cls === 'good' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-semibold text-gray-800">Class {cls.toUpperCase()}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                    <MdCheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-700">
                      {cm?.[`Class_${cls}`]?.Correct_Predictions ?? 0}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg">
                    <MdError className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-red-700">
                      {cm?.[`Class_${cls}`]?.Incorrect_Predictions ?? 0}
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ACTION */}
      <div className="p-6 border-t border-blue-100 bg-white">
        <div className="flex justify-end">
          <button
            onClick={onVisualize}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3 group"
          >
            <MdOutlineVisibility className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Visualize Results
            <MdArrowForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default DefectTrainPanel;