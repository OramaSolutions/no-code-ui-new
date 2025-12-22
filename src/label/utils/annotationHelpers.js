export const saveMasterRectangles = async (rectangles, projectName) => {
  const key = `masterRects_${projectName}`;
  try {
    localStorage.setItem(key, JSON.stringify(rectangles));
  } catch (error) {
    console.error('Error saving rectangles to localStorage:', error);
    throw new Error('Failed to save rectangles');
  }
};

export const getMasterRectangles = async (projectName) => {
  const key = `masterRects_${projectName}`;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading rectangles from localStorage:', error);
    return [];
  }
};
