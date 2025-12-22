// Add this new component to show contextual hints
const InferenceGuide = ({ mode, lockedHoverSegment, inclusionPoints, exclusionPoints }) => {
  const getGuideText = () => {
    if (lockedHoverSegment) {
      return `Refinement Mode: Left click = Add inclusion (${inclusionPoints.length}), Right click = Add exclusion (${exclusionPoints.length})`;
    }
    if (mode === 'directInference') {
      return 'Hover for 1s to preview mask, then left click to lock and refine';
    }
    return '';
  };

  const text = getGuideText();
  if (!text) return null;

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
      {text}
    </div>
  );
};

export default InferenceGuide;