import React from 'react'
import { useNavigate } from 'react-router-dom'

const TrainingStatusModal = ({
  trainingStatus,
  setTrainingStatus,
  setPerClassAccuracy,
  setCurrentEpoch,
  setTrainMessage,
  currentEpoch,
  perClassAccuracy,
  projectName,
}) => {
  const navigate = useNavigate()

  const resetState = () => {
    setPerClassAccuracy && setPerClassAccuracy({})
    setCurrentEpoch && setCurrentEpoch(null)
    setTrainMessage && setTrainMessage("")
  }

  const handlePrimary = () => {
    if (trainingStatus === 'completed') {
      resetState()
      setTrainingStatus && setTrainingStatus(null)
      navigate(`/project/${projectName}`)
    } else {
      setTrainingStatus && setTrainingStatus(null)
      resetState()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[480px] max-h-[80vh] overflow-y-auto p-6 relative border border-gray-200">
        <button
          onClick={handlePrimary}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition text-sm px-3 py-1 rounded"
        >
          {trainingStatus === 'completed' ? 'View Project' : '✕'}
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">Training Status</h2>

        <div className="text-sm text-gray-700 space-y-2 mt-4">
          <p>
            Status:{' '}
            <span className={`font-semibold ${trainingStatus === 'completed' ? 'text-green-600' : 'text-indigo-600'}`}>
              {trainingStatus}
            </span>
          </p>

          {trainingStatus === 'running' && (
            <div className="mt-5">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-600">Epoch {currentEpoch ?? 0} / 50</p>
                <p className="text-xs text-gray-600">{Math.min(((currentEpoch ?? 0) / 50) * 100, 100).toFixed(1)}%</p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-indigo-500 h-3 rounded-full transition-all duration-700 ease-in-out"
                  style={{ width: `${Math.min(((currentEpoch ?? 0) / 50) * 100, 100)}%` }}
                ></div>
              </div>

              <p className="text-xs text-gray-500 mt-2 text-center">Training in progress...</p>
            </div>
          )}

          {trainingStatus === 'completed' && (
            <div className="mt-5">
              <h3 className="text-lg font-semibold text-green-600 text-center">🎉 Training Completed!</h3>
            </div>
          )}

          {Object.keys(perClassAccuracy || {}).length > 0 && (
            <div className="mt-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Per-Class Accuracy</h4>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                {Object.entries(perClassAccuracy).map(([className, accuracy]) => (
                  <div key={className} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-none">
                    <span className="text-gray-700 truncate max-w-[250px]">{className}</span>
                    <span className="font-medium text-gray-900">{accuracy}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrainingStatusModal
