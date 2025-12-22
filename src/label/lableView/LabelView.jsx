import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Navbar from "../components/Navbar.jsx";

import {
  // saveClasses,
  // saveAnnotations,
  // getAnnotations,
  saveMasterRectangles,
  getMasterRectangles,
} from "../utils/annotationHelpers";
import {
  saveLabelData,

  saveProjectClasses,
  fetchImageDetails,
  getProjectAnnotations,
  getProjectClasses,
  getBaseUrlFromBackLink,
  getTaskFromBackLink,

} from "../utils/crudFunctions";

import { fetchInferenceResults } from "../utils/inferenceUtils";

import ClassModal from "./ClassModal";
import LeftBar from "./LeftBar";
import RightBar from "./RightBar";
import RectClassModal from "./RectClassModal";
import KonvaStage from "./KonvaStage";

function LabelComponent() {
  const { backLink, projectId, projectName, version, imageId } = useParams();

  if (!backLink || !projectId || !projectName || !version || !imageId) {
    throw new Error("Invalid route params");
  }
  const backURL = `/${backLink}/${projectId}/${projectName}/${version}`;

  // Get baseUrl from backLink  path="dataset-overview/:backLink/:projectId/:projectName/:version"
 const ProjectOverviewLink = `/dataset-overview/${backLink}/${projectId}/${projectName}/${version}`;

  const baseUrl = getBaseUrlFromBackLink(backLink);
  if (!baseUrl) {
    throw new Error(`Unable to resolve base URL for backLink: ${backLink}`);
  }


  // Get task from backLink
  const task = getTaskFromBackLink(backLink);
  if (!task) {
    throw new Error(`Unable to resolve task for backLink: ${backLink}`);
  }
  // console.log("task>>", task);

  const userData = useSelector(
    (state) => state.auth.user
  );

  if (!userData || !userData.userName) {
    throw new Error("User data not found in Redux store");
  }


  const [currentIndex, setCurrentIndex] = useState(parseInt(imageId) - 1 || 0);
  const [image, setImage] = useState(null);
  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);
  const [imageData, setImageData] = useState({});
  const [classes, setClasses] = useState([]);
  const [classesLoaded, setClassesLoaded] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [modalMode, setModalMode] = useState("add");
  const [tool, setTool] = useState("move"); // 'move' or 'rectangle'
  const [rectangles, setRectangles] = useState([]);
  const [masterRect, setMasterRect] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100%
  const [showRectModal, setShowRectModal] = useState(false);
  const [rectModalPosition, setRectModalPosition] = useState({ x: 0, y: 0 });
  const [selectedRectForModal, setSelectedRectForModal] = useState(null);
  const [selectedClassForRect, setSelectedClassForRect] = useState({});
  const [isLocked, setIsLocked] = useState(false);
  const [allAnnotations, setAllAnnotations] = useState([]);
  const [showSegments, setShowSegments] = useState(true);
  const [datasetLength, setDatasetLength] = useState(() => {
    const savedLength = localStorage.getItem(`${projectName}_datasetLength`);
    return savedLength ? parseInt(savedLength) : 0;
  });
  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const currentImageRef = useRef(null);

  // useEffect(() => {
  //   console.log('rects changes>>>>', rectangles)
  // }, [rectangles])

  const abortControllerRef = useRef(new AbortController());

  const navigate = useNavigate();

  // Replace individual dimension states with a single dimensions state
  const [dimensions, setDimensions] = useState({
    original: { width: 0, height: 0 },
    rendered: { width: 0, height: 0 },
    scale: 1,
  });
  const [inferenceData, setInferenceData] = useState([]);
  const [inferenceLoading, setInferenceLoading] = useState(false);

  // ------------------for images ------------------

  const cleanupResources = () => {
    // Cleanup current image
    if (currentImageRef.current) {
      if (currentImageRef.current.src.startsWith('blob:')) {
        URL.revokeObjectURL(currentImageRef.current.src);
      }
      currentImageRef.current.onload = null;
      currentImageRef.current.onerror = null;
      currentImageRef.current = null;
    }
    // Abort pending requests
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
  };

  const loadCurrentImage = async () => {
    if (isNaN(currentIndex)) return;

    cleanupResources();
    setLoadingCurrent(true);

    try {
      const imageDetails = await fetchImageDetails(baseUrl, projectName, task, version, userData.userName, currentIndex);
      console.log("Image Inference Details:", imageDetails.inference);
      if (!imageDetails?.image) {
        throw new Error("No image data received");
      }
      // Clean up previous image if it exists
      if (currentImageRef.current) {
        if (currentImageRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(currentImageRef.current.src);
        }
        currentImageRef.current.onload = null;
        currentImageRef.current.onerror = null;
      }

      const img = new window.Image();
      currentImageRef.current = img;
      const imageLoadPromise = new Promise((resolve, reject) => {
        img.onload = () => {
          if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            resolve(img);
          } else {
            reject(new Error("Invalid image dimensions"));
          }
        };
        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };
      });

      img.src = `data:image/jpeg;base64,${imageDetails.image}`;


      // Wait for image to load
      await imageLoadPromise;

      setImage(img);
      setImageData({
        id: imageDetails.id,
        name: imageDetails.filename,
        data: `data:image/jpeg;base64,${imageDetails.image}`
      });
      // setInferenceData(Array.isArray(imageDetails.inference) ? imageDetails.inference : []);
      // Calculate dimensions
      const maxWidth = window.innerWidth - 260;
      const maxHeight = window.innerHeight - 110;
      const ratio = Math.min(
        maxWidth / img.naturalWidth,
        maxHeight / img.naturalHeight,
        1
      );

      setDimensions({
        original: {
          width: img.naturalWidth,
          height: img.naturalHeight,
        },
        rendered: {
          width: Math.round(img.naturalWidth * ratio),
          height: Math.round(img.naturalHeight * ratio),
        },
        scale: ratio,
      });

    } catch (error) {
      console.error("Error loading image:", error);
      setImageLoaded(false);
    } finally {
      setLoadingCurrent(false);

    }
  };

  useEffect(() => {
    if (!classesLoaded) return;
    loadCurrentImage();
  }, [currentIndex, projectName, classesLoaded]);

  useEffect(() => {
    return () => {
      cleanupResources();
      setImage(null); // Clear image state
    };
  }, [currentIndex]);

  // ----------------------end images ------------------


  const setMaster = async () => {
    if (!rectangles.length) {
      alert("No Rectangles To Be Set, First Draw Rectangles.");
      return;
    }
    setMasterRect(rectangles);
    saveMasterRectangles(rectangles, projectName);

    alert("Set as Master.");
  };

  // UE for predrawing existing rects
  useEffect(() => {
    if (!image) return;

    // 1. Use saved annotations if present
    const existingAnnotations = allAnnotations.find((ann) => ann.imageIndex === currentIndex);
    if (existingAnnotations && existingAnnotations.annotations) {
      console.log('set by exisiting annotations');
      const scaledRects = existingAnnotations.annotations.map((rect) => ({
        ...rect,
        x: Math.round(rect.x * dimensions.scale),
        y: Math.round(rect.y * dimensions.scale),
        width: Math.round(rect.width * dimensions.scale),
        height: Math.round(rect.height * dimensions.scale),
        class: { ...rect.class },
        id: rect.id || `rect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }));
      setRectangles(scaledRects);
      return;
    }

    // 2. Use inference rectangles if present
    if (inferenceData && inferenceData.length > 0) {
      console.log('set by inference annotations');
      const ratio = dimensions.scale;
      const inferenceRects = inferenceData.map((item, idx) => {
        const [x1, y1, x2, y2] = item.points;
        let classIndex = null;
        let className = item.class;
        if (typeof item.class === 'string' && item.class.includes(' ')) {
          const split = item.class.split(' ');
          classIndex = parseInt(split[0], 10);
          className = split.slice(1).join(' ');
        }
        let matchedClass = classes.find(c => c.name === className);
        if (!matchedClass) {
          matchedClass = { name: className, index: classIndex, color: 'rgba(0, 161, 255, 0.3)' };
        }
        return {
          x: Math.round(x1 * ratio),
          y: Math.round(y1 * ratio),
          width: Math.round((x2 - x1) * ratio),
          height: Math.round((y2 - y1) * ratio),
          class: matchedClass,
          id: `inference_${Date.now()}_${idx}`,
        };
      });
      setRectangles(inferenceRects);
      return;
    }

    // 3. Fallback to master rectangles
    const getMaster = async () => {
      console.log('set by master');
      const master = await getMasterRectangles(projectName);
      const masterWithIds = master.map((rect) => ({
        ...rect,
        id: rect.id || `master_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }));
      setRectangles(masterWithIds);
    };
    getMaster();
  }, [
    currentIndex,
    image,
    allAnnotations,
    dimensions.scale,
    classes,
    dimensions.original,
    projectName,
    inferenceData
  ]);

  const loadClasses = async () => {
    try {
      const backendClasses = await getProjectClasses(baseUrl, projectName, userData.userName, version, task); // from API
      // console.log('backendClasses', backendClasses);
      const sorted = backendClasses.classes.sort((a, b) => a.index - b.index);

      setClasses(sorted);
      // await saveClasses(backendClasses);
      setClassesLoaded(true);
    } catch (error) {
      console.error("Failed to load classes:", error);
    }
  };

  useEffect(() => {
    loadClasses();

  }, [projectName]);

  useEffect(() => {
    getProjectAnnotations(baseUrl, projectName, userData.userName, version, task).then((saved) => {
      if (saved.length > 0) {
        setAllAnnotations(saved);
      }
    });
  }, [projectName, baseUrl, version, task, userData.userName]);


  // adding new class
  const handleSubmit = async () => {
    const name = newClassName.trim();
    if (!name) return;

    if (classes.some((cls) => cls.name === name)) {
      console.error("Class name must be unique.");
      return;
    }

    try {
      const newClasses = [...classes, { name }];
      setClasses(newClasses); // Immediate UI update
      setNewClassName("");
      // await saveClasses(newClasses);
      await saveProjectClasses(baseUrl, newClasses, projectName, userData.userName, version, task);
      setNewClassName("");
      await loadClasses();
    } catch (error) {
      console.error("Failed to add class:", error);
    }
  };



  useEffect(() => {
    const updateDimensions = () => {
      if (imgRef.current && dimensions.original.width > 0) {
        const maxWidth = window.innerWidth - 260;
        const maxHeight = window.innerHeight - 110;
        const ratio = Math.min(
          maxWidth / dimensions.original.width,
          maxHeight / dimensions.original.height,
          1
        );

        setDimensions((prev) => ({
          ...prev,
          rendered: {
            width: Math.round(dimensions.original.width * ratio),
            height: Math.round(dimensions.original.height * ratio),
          },
          scale: ratio,
        }));
      }
    };

    // Initial measurement
    updateDimensions();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (imgRef.current) {
      resizeObserver.observe(imgRef.current);
    }

    // Set up window resize listener as fallback
    window.addEventListener("resize", updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, [currentIndex, dimensions.original]);



  // useEffect(() => {
  //   saveAnnotations(allAnnotations);
  // }, [allAnnotations]);

  // nav--------------

  const goToIndex = useCallback((newIndex) => {
    if (newIndex < 0 || newIndex >= datasetLength) return;
    cleanupResources();
    setCurrentIndex(newIndex);
    navigate(`/image-label/${backLink}/${projectId}/${projectName}/${version}/image/${newIndex + 1}`, {
      replace: true,
    });
  }, [datasetLength, projectName, navigate]);

  const convertToYOLOFormat = (rects, imgWidth, imgHeight) => {
    return rects
      .map((rect) => {
        if (!rect.class) return null;

        // Get class index
        let classIndex = -1;
        if (rect.class?.index !== undefined) {
          classIndex = rect.class.index;
        } else if (rect.class?.id || rect.class?.name) {
          const matchedClass = classes.find(
            (c) => c.id === rect.class?.id || c.name === rect.class?.name
          );
          classIndex = matchedClass?.index ?? -1;
        } else if (typeof rect.class === "string") {
          const matchedClass = classes.find((c) => c.name === rect.class);
          classIndex = matchedClass?.index ?? -1;
        }

        if (classIndex === -1) return null;

        // Convert to YOLO format (normalized coordinates)
        const xCenter = (rect.x + rect.width / 2) / imgWidth;
        const yCenter = (rect.y + rect.height / 2) / imgHeight;
        const normWidth = rect.width / imgWidth;
        const normHeight = rect.height / imgHeight;

        return `${classIndex} ${xCenter.toFixed(6)} ${yCenter.toFixed(
          6
        )} ${normWidth.toFixed(6)} ${normHeight.toFixed(6)}`;
      })
      .filter((line) => line !== null)
      .join("\n");
  };

  const handleSaveNext = async () => {
    // Convert rectangles to pixel coordinates
    const pixelRects = rectangles.map((rect) => ({
      ...rect,
      x: Math.round(rect.x / dimensions.scale),
      y: Math.round(rect.y / dimensions.scale),
      width: Math.round(rect.width / dimensions.scale),
      height: Math.round(rect.height / dimensions.scale),
      class: rect.class,
    }));

    // Convert to YOLO format
    const yoloContent = convertToYOLOFormat(
      pixelRects,
      dimensions.original.width,
      dimensions.original.height
    );

    // Prepare data for saving
    const dataToSave = {
      imageName: imageData?.name || `image_${imageData.id}`,
      imageIndex: imageData?.id,
      yoloAnnotations: yoloContent || "", // Send empty string if no annotations
    };
    // console.log("dataToSave", dataToSave);

    const currentImageData = {
      imageName: imageData?.name || `image_${imageData.id}`,
      imageIndex: imageData?.id,
      classes: classes,
      annotations: rectangles.map((rect) => {
        // Convert from rendered coordinates to pixel coordinates
        const pixelX = Math.round(rect.x / dimensions.scale);
        const pixelY = Math.round(rect.y / dimensions.scale);
        const pixelWidth = Math.round(rect.width / dimensions.scale);
        const pixelHeight = Math.round(rect.height / dimensions.scale);

        return {
          id: rect.id,
          x: pixelX,
          y: pixelY,
          width: pixelWidth,
          height: pixelHeight,
          class: rect.class || null,
        };
      }),
    };
    // console.log("Final saved data:", currentImageData);

    // Save to backend
    const success = await saveLabelData(baseUrl, projectName, userData.userName, version, task, {
      ...dataToSave,
      ...currentImageData,
    });
    // console.log("success", success);
    if (success) {
      // Update local state
      setAllAnnotations((prev) => {
        const updated = [...prev];
        const existingIndex = updated.findIndex(
          (item) => item.imageIndex === imageData.id
        );

        const annotationData = {
          imageName: imageData?.name || `image_${imageData.id}`,
          imageIndex: imageData?.id,
          annotations: pixelRects,
        };

        if (existingIndex !== -1) {
          updated[existingIndex] = annotationData;
        } else {
          updated.push(annotationData);
        }
        return updated;
      });

      // If not on last image, move to next
      if (currentIndex < datasetLength - 1 && imageLoaded) {
        const nextIndex = currentIndex + 1;
        goToIndex(nextIndex);
      }
    } else {
      // Show error message if save failed
      alert("Failed to save annotation data. Please try again.");
    }
  };

  const handleNext = () => {
    if (currentIndex >= datasetLength - 1) return;
    const nextIndex = currentIndex + 1;
    goToIndex(nextIndex);
  };

  const handlePrev = () => {
    if (currentIndex <= 0) return;
    const prevIndex = currentIndex - 1;
    goToIndex(prevIndex);
  };

  const handleNull = async () => {
    if (currentIndex >= datasetLength - 1) return;

    const currentImageData = {
      imageName: imageData?.name || `image_${currentIndex}`,
      imageIndex: currentIndex,
      classes: classes,
      annotations: null,
    };

    const success = await saveLabelData(baseUrl, projectName, userData.userName, version, task, currentImageData);
    if (success) {
      setAllAnnotations((prev) => {
        const updated = [...prev];
        const existingIndex = updated.findIndex(
          (item) => item.imageIndex === currentImageData.imageIndex
        );
        const { classes, ...imageDataWithoutClasses } = currentImageData;
        if (existingIndex !== -1) {
          updated[existingIndex] = imageDataWithoutClasses;
        } else {
          updated.push(imageDataWithoutClasses);
        }
        return updated;
      });

      if (imageLoaded) {
        const nextIndex = currentIndex + 1;
        goToIndex(nextIndex);
      }
    } else {
      alert("Failed to save annotation data. Please try again.");
    }
  };

  // ------------zoom logic--------------

  // const handleZoom = (direction) => {
  //   const stage = stageRef.current;
  //   const scaleBy = 1.1;
  //   const oldScale = stage.scaleX();
  //   const center = {
  //     x: stage.width() / 2,
  //     y: stage.height() / 2,
  //   };

  //   const newScale =
  //     direction === "in" ? oldScale * scaleBy : oldScale / scaleBy;
  //   setZoomLevel(newScale);

  //   stage.scale({ x: newScale, y: newScale });

  //   // Adjust position to zoom toward center
  //   const mousePointTo = {
  //     x: (center.x - stage.x()) / oldScale,
  //     y: (center.y - stage.y()) / oldScale,
  //   };

  //   const newPos = {
  //     x: center.x - mousePointTo.x * newScale,
  //     y: center.y - mousePointTo.y * newScale,
  //   };

  //   stage.position(newPos);
  //   stage.batchDraw();
  // };

  const handleZoom = (direction, pointer) => {
    const stage = stageRef.current;
    if (!stage) return;

    const scaleBy = 1.1;
    const oldScale = stage.scaleX();
    const newScale = direction === "in" ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.1, Math.min(newScale, 10));
    console.log('pointer', pointer)
    // Provide a fallback if pointer is not valid
    const center =
      pointer && typeof pointer.x === "number" && typeof pointer.y === "number"
        ? pointer
        : { x: stage.width() / 2, y: stage.height() / 2 };

    // Calculate logical point in the image that should stay under the cursor
    const mousePointTo = {
      x: (center.x - stage.x()) / oldScale,
      y: (center.y - stage.y()) / oldScale
    };

    // Move the stage so the scaling keeps the zoom focal point under the pointer
    const newPos = {
      x: center.x - mousePointTo.x * clampedScale,
      y: center.y - mousePointTo.y * clampedScale
    };

    stage.scale({ x: clampedScale, y: clampedScale });
    stage.position(newPos);
    setZoomLevel(clampedScale);
    stage.batchDraw();
  };

  const handleResetZoom = () => {
    const stage = stageRef.current;
    stage.scale({ x: 1, y: 1 });
    stage.position({ x: 0, y: 0 });
    stage.batchDraw();
    setZoomLevel(1);
  };

  //   ------------zoom end--------------

  // Magic inference handler
  const handleMagicInference = async () => {
    if (!projectName || imageData?.id == null) return;
    setInferenceLoading(true);
    try {
      const result = await fetchInferenceResults(baseUrl, projectName, imageData.id);
      setInferenceData(Array.isArray(result.inference) ? result.inference : []);
    } catch (err) {
      console.log('infer error;', err);
      alert("Failed to fetch inference results");
    } finally {
      setInferenceLoading(false);
    }
  };

  if (!imageLoaded || !image) {
    return (
      <div className="max-w-md mx-auto p-6 text-center h-screen w-scree">
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>
              Loading image {currentIndex + 1}...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10">
      <Navbar />
      <div className="flex w-screen fixed h-[calc(100vh-3.5rem)] mt-14">
        {/* Sidebar */}
        <LeftBar
          classes={classes}
          setClasses={setClasses}
          setShowClassModal={setShowClassModal}
          setModalMode={setModalMode}
          setNewClassName={setNewClassName}
          projectName={projectName}

          rectangles={rectangles}
          setRectangles={setRectangles}
          selectedRectForModal={selectedRectForModal}
          setSelectedRectForModal={setSelectedRectForModal}
          setShowRectModal={setShowRectModal}
          setRectModalPosition={setRectModalPosition}
          stageRef={stageRef}
          onMagic={handleMagicInference}
          inferenceLoading={inferenceLoading}
          ProjectOverviewLink={ProjectOverviewLink}
        />
        {/* main content */}
        <div className="flex-1 flex flex-col overflow-hidden h-full">
          {/* img part */}
          {/* Loading overlay - appears on top of existing content */}
          {loadingCurrent && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>
                  Running inference and loading image {currentIndex + 1}...
                </span>
              </div>
            </div>
          )}

          <div className="flex-1 flex justify-center items-center min-h-0 w-full h-full">
            <div
              className="relative mx-auto h-full w-full"
              style={{
                width: "100%",
                height: "100%",
                padding: 0,
                margin: 0,
              }}
            >
              <KonvaStage
                dimensions={dimensions}
                tool={tool}
                rectangles={rectangles}
                setIsDrawing={setIsDrawing}
                imgRef={imgRef}
                image={image}
                stageRef={stageRef}
                setRectangles={setRectangles}
                isDrawing={isDrawing}
                setRectModalPosition={setRectModalPosition}
                setShowRectModal={setShowRectModal}
                setSelectedRectForModal={setSelectedRectForModal}
                selectedRectForModal={selectedRectForModal}
                isLocked={isLocked}
                setShowSegments={setShowSegments}
                showSegments={showSegments}
                onZoom={handleZoom}
              />
            </div>
          </div>

          <div className="flex-shrink-0 ">
            <div className="flex items-center justify-between p-1  border-gray-200">
              <button
                onClick={handlePrev}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <FiChevronLeft className="mr-1" />
                Previous
              </button>

              <div className="flex flex-col items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  Image {currentIndex + 1} of {datasetLength}
                </span>
                <h3 className="text-sm font-medium text-gray-600">
                  {imageData?.name || `Image ${currentIndex + 1}`}
                </h3>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleNext}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Next
                  <FiChevronRight className="ml-1" />
                </button>
                <button
                  onClick={handleSaveNext}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Save & Next
                  <FiChevronRight className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Tools */}
        <RightBar
          setTool={setTool}
          tool={tool}
          zoomLevel={zoomLevel}
          handleZoom={handleZoom}
          handleResetZoom={handleResetZoom}
          setRectangles={setRectangles}
          selectedRectForModal={selectedRectForModal}
          setSelectedRectForModal={setSelectedRectForModal}
          setShowRectModal={setShowRectModal}
          setIsLocked={setIsLocked}
          isLocked={isLocked}
          handleNull={handleNull}
          setMaster={setMaster}
          setShowSegments={setShowSegments}
          showSegments={showSegments}
          
        />

        {/* classesmodal */}
        {showClassModal && (
          <ClassModal
            modalMode={modalMode}
            newClassName={newClassName}
            setNewClassName={setNewClassName}
            setShowClassModal={setShowClassModal}
            handleSubmit={handleSubmit}
          />
        )}
        {showRectModal && (
          <RectClassModal
            position={rectModalPosition}
            classes={classes}
            selectedClass={selectedClassForRect}
            setSelectedClass={setSelectedClassForRect}
            onClose={() => setShowRectModal(false)}
            onSave={(selectedClass) => {
              setRectangles((prev) =>
                prev.map((rect) =>
                  rect.id === selectedRectForModal?.id
                    ? { ...rect, class: selectedClass }
                    : rect
                )
              );
              setShowRectModal(false);
            }}
          />
        )}
      </div>
    </div>

  );
}

export default LabelComponent;
