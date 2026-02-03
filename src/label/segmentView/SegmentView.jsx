import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { v4 as uuidv4 } from 'uuid';
import InferenceGuide from "./InferenceGuide";
import RefinementControlPanel from "./RefinementControlPanel";
import { fetchInferenceResults, fetchDirectInferenceResults, sendInclusionExclutionPoints } from "../utils/inferenceUtils";
import Navbar from "../components/Navbar";
import {
  saveSegmentData,
  getProjectClasses,
  saveProjectClasses,
  fetchImageDetails,
  getProjectSegmentAnnotation,
  getBaseUrlFromBackLink,
  getTaskFromBackLink,
} from "../utils/crudFunctions";

import ClassModal from "./ClassModal";
import LeftBar from "./LeftBar";
import RightBar from "./RightBar";
import SegmentClassModal from "./SegmentClassModal";
import KonvaStage from "./KonvaStage";



function SegmentComponent() {
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

  // Derive a simple username variable for API calls and props
  const userName = userData.userName;

  const [currentIndex, setCurrentIndex] = useState(parseInt(imageId) - 1 || 0);

  const [image, setImage] = useState(null);
  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);
  const [imageData, setImageData] = useState({});
  const [classes, setClasses] = useState([]);
  const [showClassModal, setShowClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [modalMode, setModalMode] = useState("add");
  const [tool, setTool] = useState("move");
  const [segments, setSegments] = useState([]);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  const [segmentModalPosition, setSegmentModalPosition] = useState({
    x: 0,
    y: 0,
  });
  const [selectedSegmentForModal, setSelectedSegmentForModal] = useState(null);
  const [selectedClassForSegment, setSelectedClassForSegment] = useState({});
  const [isLocked, setIsLocked] = useState(false);
  const [allAnnotations, setAllAnnotations] = useState([]);
  const [datasetLength, setDatasetLength] = useState(() => {
    const savedLength = localStorage.getItem(`${projectName}_datasetLength`);
    return savedLength ? parseInt(savedLength) : 0;
  });

  const [showSegments, setShowSegments] = useState(true);

  const [inferenceData, setInferenceData] = useState([]);
  const [inferenceLoading, setInferenceLoading] = useState(false);
  const [directInferenceMode, setDirectInferenceMode] = useState(false);

  const [directInferenceLoading, setDirectInferenceLoading] = useState(false);

  const stageRef = useRef(null);

  const navigate = useNavigate();

  // Replace individual dimension states with a single dimensions state
  const [dimensions, setDimensions] = useState({
    original: { width: 0, height: 0 },
    rendered: { width: 0, height: 0 },
    scale: 1,
  });

  // Direct Inference Points: include and exclude
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoverTimer, setHoverTimer] = useState(null);
  const [hoverInferenceResult, setHoverInferenceResult] = useState(null);
  const [showMask, setShowMask] = useState(false);
  const [inferComplexity, setInferComplexity] = useState("50");
  const [lockedHoverSegment, setLockedHoverSegment] = useState(null);
  const [inclusionPoints, setInclusionPoints] = useState([]);
  const [exclusionPoints, setExclusionPoints] = useState([]);

  const [samActive, setSamActive] = useState(false)

  // useEffect(() => { console.log('segments>>>', segments) }, [segments])
  const imgRef = useRef(null);
  const currentImageRef = useRef(null);

  const imageCacheRef = useRef(new Map()); // index -> imageDetails
  const inflightRef = useRef(new Map());



  const cleanupResources = () => {
    if (currentImageRef.current) {
      if (currentImageRef.current.src?.startsWith('blob:')) {
        URL.revokeObjectURL(currentImageRef.current.src);
      }
      currentImageRef.current.onload = null;
      currentImageRef.current.onerror = null;
      currentImageRef.current = null;
    }
  };

  const isValidIndex = (index) =>
    Number.isInteger(index) &&
    index >= 0 &&
    index < datasetLength;

  // new
  const getImageDetails = (index) => {
    // 1️⃣ Cache hit
    if (imageCacheRef.current.has(index)) {
      return Promise.resolve(imageCacheRef.current.get(index));
    }

    // 2️⃣ Already fetching → reuse promise
    if (inflightRef.current.has(index)) {
      return inflightRef.current.get(index).promise;
    }

    // 3️⃣ Start new fetch
    const controller = new AbortController();

    const promise = fetchImageDetails(
      baseUrl,
      projectName,
      task,
      version,
      userData.userName,
      index,
      controller.signal
    )
      .then((data) => {
        imageCacheRef.current.set(index, data);
        inflightRef.current.delete(index);
        return data;
      })
      .catch((err) => {
        inflightRef.current.delete(index);
        throw err;
      });

    inflightRef.current.set(index, { promise, controller });

    return promise;
  };

  const loadCurrentImage = async () => {
    if (isNaN(currentIndex)) return;

    cleanupResources();
    setLoadingCurrent(true);
    setImage(null);


    setImageData({

    });


    try {
      const imageDetails = await getImageDetails(currentIndex);

      if (!imageDetails?.image_url) {
        throw new Error("No image_url received");
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
        img.onerror = () => reject(new Error("Failed to load image"));
      });

      // 🔥 CORE CHANGE: load via URL, NOT base64
      img.src =
        `${baseUrl}${imageDetails.image_url}` +
        `?username=${userData.userName}&task=${task}&version=${version}`;

      await imageLoadPromise;

      setImage(img);

      // 🔥 Store URL instead of base64
      setImageData({
        id: imageDetails.id,
        name: imageDetails.filename,
        url: img.src,
      });

      // Dimensions (unchanged logic)
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

      // Prefetch next
      const nextIndex = currentIndex + 1;
      if (isValidIndex(nextIndex)) {
        prefetchImage(nextIndex);
      }

      // Cache eviction (unchanged)
      const allowed = new Set([
        currentIndex - 1,
        currentIndex,
        currentIndex + 1,
      ]);

      for (const key of imageCacheRef.current.keys()) {
        if (!allowed.has(key)) {
          imageCacheRef.current.delete(key);
        }
      }

    } catch (error) {
      if (error.name !== "CanceledError") {
        console.error("Error loading image:", error);
      }
      setImageLoaded(false);
    } finally {
      setLoadingCurrent(false);
    }
  };

  const prefetchImage = async (index) => {
    if (!isValidIndex(index)) return;
    if (imageCacheRef.current.has(index)) return;
    if (inflightRef.current.has(index)) return;

    const meta = await getImageDetails(index);
    const img = new Image();
    img.src =
      `${baseUrl}${meta.image_url}` +
      `?username=${userData.userName}&task=${task}&version=${version}`;
  };



  useEffect(() => {
    if (!isValidIndex(currentIndex)) return;
    loadCurrentImage();
  }, [currentIndex, projectName, datasetLength]);

  useEffect(() => {
    return () => {
      inflightRef.current.forEach(({ controller }) => {
        controller.abort();
      });
      inflightRef.current.clear();
      cleanupResources();
      setImage(null); // Clear image state
    };
  }, []);

  // ----------------------end images ------------------



  // Load classes from database



  const loadClasses = async () => {
    try {
      const backendClasses = await getProjectClasses(baseUrl, projectName, userName, version, task);
      // console.log("Loaded classes from backend:", backendClasses);
      const sorted = backendClasses.classes.sort((a, b) => a.index - b.index);
      setClasses(sorted);
      // await saveClasses(backendClasses);
    } catch (error) {
      console.error("Failed to load classes:", error);
    }
  };

  useEffect(() => {
    loadClasses();

  }, []);

  // Load annotations
  useEffect(() => {
    // console.log("Loading annotations for project:", projectName);
    getProjectSegmentAnnotation(baseUrl, projectName, userName, version, task).then((saved) => {
      // console.log("Loaded annotations:", saved);
      if (saved.length > 0) {

        setAllAnnotations(saved);
      }
    });
  }, [projectName]);



  // Dynamic resizing
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

  function inferenceToSegments(inferenceData, classes) {
    return inferenceData.map((inf, idx) => {
      // If inf.class is missing or empty, assign a default class name
      let className = '';
      if (inf.class && typeof inf.class === 'string' && inf.class.trim() !== '') {
        className = inf.class.split(' ').slice(1).join(' '); // e.g., "67 cell phone" -> "cell phone"
      } else {
        className = 'Unlabeled'; // or any default you prefer
      }
      const matchedClass = classes.find(cls => cls.name === className || cls.id === className);

      return {
        id: uuidv4(),
        points: inf.points,
        label: matchedClass
          ? {
            color: matchedClass.color,
            id: matchedClass.id || matchedClass.name,
            index: matchedClass.index,
            name: matchedClass.name,
          }
          : {
            color: "#FF00FF", // fallback color
            id: className,
            index: -1,
            name: className,
          },
      };
    });
  }

  // Load existing segments for current image
  useEffect(() => {
    if (!image) return;
    // console.log("Loading segments for current image:", currentIndex, allAnnotations);
    const existingAnnotations = allAnnotations.find((ann) => {
      return ann.imageIndex === currentIndex;
    });

    if (existingAnnotations && existingAnnotations.segments) {
      // Keep points in original coordinates - no scaling needed here
      console.log('in existing ann')
      setSegments(existingAnnotations.segments);
    } else if (
      inferenceData.length > 0
    ) {
      console.log("Using inference data for segments:");
      setSegments(inferenceToSegments(inferenceData, classes));
      // } else if (hoverInferenceResult && hoverInferenceResult.length > 0) {
      //   console.log("Using hover inference data for segments:");
      //   setSegments(inferenceToSegments(hoverInferenceResult, classes));
      // }
    } else {
      console.log('setting empty segments')
      setSegments([]);
    }
  }, [currentIndex, image, allAnnotations, inferenceData, classes]);


  // Navigation and URL handling

  const goToIndex = useCallback((newIndex) => {
    if (newIndex < 0 || newIndex >= datasetLength) return;
    cleanupResources();
    setCurrentIndex(newIndex);
    navigate(`/image-segment/${backLink}/${projectId}/${projectName}/${version}/image/${newIndex + 1}`, {
      replace: true,
    });
  }, [datasetLength, userName, projectName, navigate]);

  // Save segments to annotations
  const handleSaveNext = async () => {
    if (currentIndex >= datasetLength - 1) {
      const currentImageData = {
        imageName: imageData?.name || `image_${imageData.id}`,
        imageIndex: imageData?.id,
        classes: classes,
        segments: segments.map((segment) => ({
          id: segment.id,
          points: segment.points.map((point) => {
            // Ensure we're working with numbers
            const x = typeof point[0] === "number" ? point[0] : 0;
            const y = typeof point[1] === "number" ? point[1] : 0;
            return [x, y];
          }),
          label: segment.label || null,
        })),
      };
      // console.log("Current Image Data:", currentImageData);
      const success = await saveSegmentData(baseUrl, projectName, currentImageData, userName, version, task);

      if (success) {
        // Update local state
        setAllAnnotations((prev) => {
          // Create a new array without the current image's data (if it exists)
          const otherAnnotations = prev.filter(
            (item) => item.imageIndex !== currentImageData.imageIndex
          );

          // If we have segments, add the updated data, otherwise don't include it
          if (segments.length > 0) {
            // console.log("Saving segments:", [...otherAnnotations, currentImageData]);
            return [...otherAnnotations, currentImageData];
          } else {
            // If no segments, remove this image from annotations
            // console.log("No segments to save, removing image from annotations.", otherAnnotations);
            return otherAnnotations;
          }
        });
      } else {
        alert("Failed to save segmentation data. Please try again.");
      }
      return;
    }

    // Similar logic for non-last images
    const currentImageData = {
      imageName: imageData?.name || `image_${imageData.id}`,
      imageIndex: imageData?.id,
      classes: classes,
      segments: segments.map((segment) => ({
        id: segment.id,
        points: segment.points.map((point) => {
          const x = typeof point[0] === "number" ? point[0] : 0;
          const y = typeof point[1] === "number" ? point[1] : 0;
          return [x, y];
        }),
        label: segment.label || null,
      })),
    };
    // console.log("Current Image Data:", currentImageData);
    const success = await saveSegmentData(baseUrl, projectName, currentImageData, userName, version, task);

    if (success) {
      setAllAnnotations((prev) => {
        // Create a new array without the current image's data (if it exists)
        const otherAnnotations = prev.filter(
          (item) => item.imageIndex !== currentImageData.imageIndex
        );

        // If we have segments, add the updated data, otherwise don't include it
        if (segments.length > 0) {
          // console.log("Saving segments:", [...otherAnnotations, currentImageData]);
          return [...otherAnnotations, currentImageData];
        } else {
          // If no segments, remove this image from annotations
          // console.log("No segments to save, removing image from annotations.", otherAnnotations);
          return otherAnnotations;
        }
      });

      if (imageLoaded) {
        const nextIndex = currentIndex + 1;
        goToIndex(nextIndex);
      }
    } else {
      alert("Failed to save segmentation data. Please try again.");
    }
  };

  const handleNull = async () => {
    if (currentIndex >= datasetLength - 1) return;

    const currentImageData = {
      imageName: imageData?.name || `image_${currentIndex}`,
      imageIndex: currentIndex,
      classes: classes,
      segments: null,
    };

    const success = await saveSegmentData(baseUrl, projectName, currentImageData, userName, version, task);
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
    }
    else {
      alert("Failed to save segmentation data. Please try again.");
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


  // Enhanced zoom functionality with cursor-based zooming
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

  // Select a segment
  const handleSegmentClick = (segmentId) => {
    if (tool !== "select" || isLocked) return;

    const segment = segments.find((s) => s.id === segmentId);
    if (!segment) return;

    setSelectedSegmentForModal(segment);
    setSelectedClassForSegment(segment.label || "");

    // Calculate modal position (center of segment)
    const centerX =
      segment.points.reduce((sum, p) => sum + p.x, 0) / segment.points.length;
    const centerY =
      segment.points.reduce((sum, p) => sum + p.y, 0) / segment.points.length;

    setSegmentModalPosition({ x: centerX, y: centerY });
    setShowSegmentModal(true);
  };

  // Delete a segment
  const deleteSegment = (segmentId) => {
    setSegments(segments.filter((segment) => segment.id !== segmentId));
  };

  // Delete all segment
  const deleteAllSegment = (segmentId) => {
    setSegments([]);
  };

  // Handle class creation
  const handleSubmit = async () => {
    const name = newClassName.trim();
    if (!name) return;

    if (classes.some((cls) => cls.name === name)) {
      console.error("Class name must be unique.");
      return;
    }

    try {
      const newClasses = [...classes, { name }];
      setClasses(newClasses);
      setNewClassName("");
      // await saveClasses(newClasses);
      await saveProjectClasses(baseUrl, newClasses, projectName, userName, version, task);
      await loadClasses();
    } catch (error) {
      console.error("Failed to add class:", error);
    }
  };



  useEffect(() => {
    setSamActive(false)
  }, [currentIndex])

  // Direct Inference Handler (now only hover-based)
  const handleDirectInferenceSubmit = async () => {
    // No-op: direct inference is now handled by hover
    alert('Direct inference is now hover-based. Hover over the image for 2 seconds to run inference at a point.');
  };

  // Handler for hover in direct inference mode
  const handleStageHover = (point) => {
    if (!directInferenceMode || lockedHoverSegment) return;
    console.log('in handle stage hover');
    if (hoverTimer) clearTimeout(hoverTimer);
    setHoveredPoint(point);
    // setHoverInferenceResult(null);
    // Start timer for 2 seconds
    const timer = setTimeout(async () => {
      setDirectInferenceLoading(true);
      try {
        const result = await fetchDirectInferenceResults(baseUrl, projectName, imageData.id, point, userName, version, task);
        if (!samActive) {
          setSamActive(true)
        }
        const newPoints = result.inference?.[0].points || [];
        const newSegment = {
          id: uuidv4(),
          points: newPoints,
          label:
          {
            color: "#90E0EF", // fallback color
            id: null,
            index: -1,
            name: "",
          },
        }
        setHoverInferenceResult(newSegment || {});
        // setHoverInferenceResult(prev => [...(prev || []), ...(Array.isArray(result.inference) ? result.inference : [])]);
        console.log('Ran Hover Inference at Point:', point);
      } catch (err) {
        setHoverInferenceResult(null);
      } finally {
        setDirectInferenceLoading(false);
      }
    }, 1000);
    setHoverTimer(timer);
  };

  // Cleanup timer on mouse leave
  const handleStageMouseLeave = () => {
    if (hoverTimer) clearTimeout(hoverTimer);
    setHoveredPoint(null);
    // if (!lockedHoverSegment) setHoverInferenceResult(null);
  };

  const [pointHistory, setPointHistory] = useState({
    inclusion: [[]],
    exclusion: [[]],
    currentIndex: 0
  });
  const [batchMode, setBatchMode] = useState(false);
  const [pendingPoints, setPendingPoints] = useState({
    inclusion: [],
    exclusion: []
  });

  // Common handler for inclusion/exclusion points
  // Replace the existing handleInclusionExclusionPoints with this enhanced version
  const handleInclusionExclusionPoints = async (newInclusionPoints, newExclusionPoints, skipUpdate = false) => {
    setInclusionPoints(newInclusionPoints);
    setExclusionPoints(newExclusionPoints);

    // Update history
    setPointHistory(prev => ({
      inclusion: [...prev.inclusion.slice(0, prev.currentIndex + 1), newInclusionPoints],
      exclusion: [...prev.exclusion.slice(0, prev.currentIndex + 1), newExclusionPoints],
      currentIndex: prev.currentIndex + 1
    }));

    if (batchMode || skipUpdate) {
      setPendingPoints({ inclusion: newInclusionPoints, exclusion: newExclusionPoints });
      return;
    }

    try {
      const result = await sendInclusionExclutionPoints(
        baseUrl,
        projectName,
        imageData.id,
        newInclusionPoints,
        newExclusionPoints,
        userName,
        version,
        task
      );

      const newPoints = result.inference?.[0].points || [];
      if (lockedHoverSegment && newPoints.length > 0) {
        const newSegment = {
          id: uuidv4(),
          points: newPoints,
          label: {
            color: "#90E0EF",
            id: null,
            index: -1,
            name: "",
          },
        };
        setHoverInferenceResult(newSegment || {});
        setSegments(segments.filter(seg => seg.id !== lockedHoverSegment.id));
      }
    } catch (err) {
      console.error("Failed to send inclusion/exclusion points", err);
    }
  };

  // Add undo/redo functions
  const undoPoints = () => {
    if (pointHistory.currentIndex > 0) {
      const newIndex = pointHistory.currentIndex - 1;
      setPointHistory(prev => ({ ...prev, currentIndex: newIndex }));
      const newInclusion = pointHistory.inclusion[newIndex];
      const newExclusion = pointHistory.exclusion[newIndex];
      handleInclusionExclusionPoints(newInclusion, newExclusion, true);
    }
  };

  const redoPoints = () => {
    if (pointHistory.currentIndex < pointHistory.inclusion.length - 1) {
      const newIndex = pointHistory.currentIndex + 1;
      setPointHistory(prev => ({ ...prev, currentIndex: newIndex }));
      const newInclusion = pointHistory.inclusion[newIndex];
      const newExclusion = pointHistory.exclusion[newIndex];
      handleInclusionExclusionPoints(newInclusion, newExclusion, true);
    }
  };

  // Batch processing function
  const submitBatchPoints = async () => {
    setBatchMode(false);
    await handleInclusionExclusionPoints(pendingPoints.inclusion, pendingPoints.exclusion);
    setPendingPoints({ inclusion: [], exclusion: [] });
  };



  // if (!imageData?.url) {
  //   return (
  //     <div className="max-w-md mx-auto p-6 text-center text-gray-500">
  //       {loadingCurrent ? 'Loading image...' : 'No image to display'}
  //     </div>
  //   );
  // }
  return (
    <div className="relative z-10">
      <Navbar />
      <div className="flex w-screen fixed h-[calc(100vh-3.5rem)] mt-14">
        <InferenceGuide
          mode={directInferenceMode ? 'directInference' : tool}
          lockedHoverSegment={lockedHoverSegment}
          inclusionPoints={inclusionPoints}
          exclusionPoints={exclusionPoints}
        />

        <RefinementControlPanel
          lockedHoverSegment={lockedHoverSegment}
          inclusionPoints={inclusionPoints}
          exclusionPoints={exclusionPoints}
          batchMode={batchMode}
          setBatchMode={setBatchMode}
          undoPoints={undoPoints}
          redoPoints={redoPoints}
          submitBatchPoints={submitBatchPoints}
          pointHistory={pointHistory}
          inferComplexity={inferComplexity}
          setInferComplexity={setInferComplexity}
          onUnlock={() => {
            setLockedHoverSegment(null);
            setHoverInferenceResult(null);
            setDirectInferenceMode(true);
            setInclusionPoints([]);
            setExclusionPoints([]);
          }}
          onFinishRefinement={() => {
            if (!hoverInferenceResult) return;

            setSegments(prev => {
              // Remove the locked segment if it exists and add the refined result
              const filteredSegments = prev.filter(seg => seg.id !== lockedHoverSegment?.id);
              return [...filteredSegments, hoverInferenceResult];
            });

            setSelectedSegmentForModal(hoverInferenceResult);
            setShowSegmentModal(true);
            setInclusionPoints([]);
            setExclusionPoints([]);
          }}

        />



        {/* Left Sidebar */}
        <LeftBar
          classes={classes}
          setClasses={setClasses}
          setShowClassModal={setShowClassModal}
          setModalMode={setModalMode}
          setNewClassName={setNewClassName}
          setSegments={setSegments}
          projectName={projectName}
          userName={userName}
          segments={segments}
          selectedSegmentForModal={selectedSegmentForModal}
          setSelectedSegmentForModal={setSelectedSegmentForModal}
          setShowSegmentModal={setShowSegmentModal}
          setSegmentModalPosition={setSegmentModalPosition}
          stageRef={stageRef}
          scale={dimensions.scale}

          inferenceLoading={inferenceLoading}
          ProjectOverviewLink={ProjectOverviewLink}
          handleDirectInferenceSubmit={handleDirectInferenceSubmit}
          directInferenceLoading={directInferenceLoading}
          samActive={samActive}
        />

        <div className="flex-1 flex flex-col overflow-hidden h-full">
          {/* img part */}
          {/* Loading overlay - appears on top of existing content */}
          {!imageData?.url && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>
                  {loadingCurrent ? `Loading image ${currentIndex + 1}...` : 'No image to display'}
                </span>
              </div>
            </div>
          )}
          <div className=" flex-1 flex justify-center items-center min-h-0 w-full h-full">
            <div
              className="relative  mx-auto h-full w-full"
              style={{
                width: "100%",
                height: "100%",
                padding: 0,
                margin: 0,
              }}
            >
              {/* Conditional rendering for direct inference mode */}
              <KonvaStage
                tool={tool}
                segments={segments}
                setHoverInferenceResult={setHoverInferenceResult}
                setIsDrawing={setIsDrawing}
                imgRef={imgRef}
                image={image}
                stageRef={stageRef}
                dimensions={dimensions}
                setSegments={setSegments}
                isDrawing={isDrawing}
                selectedSegmentForModal={selectedSegmentForModal}
                setSelectedSegmentForModal={setSelectedSegmentForModal}
                setSegmentModalPosition={setSegmentModalPosition}
                setShowSegmentModal={setShowSegmentModal}
                isLocked={isLocked}
                currentPoints={currentPoints}
                setCurrentPoints={setCurrentPoints}
                directInferenceMode={directInferenceMode}
                setShowSegments={setShowSegments}
                showSegments={showSegments}
                onHover={handleStageHover}
                onMouseLeave={handleStageMouseLeave}
                hoverInferenceResult={hoverInferenceResult}
                setDirectInferenceMode={setDirectInferenceMode}
                showMask={showMask}
                setShowMask={setShowMask}
                lockedHoverSegment={lockedHoverSegment}
                setLockedHoverSegment={setLockedHoverSegment}
                inclusionPoints={inclusionPoints}
                setInclusionPoints={setInclusionPoints}
                exclusionPoints={exclusionPoints}
                setExclusionPoints={setExclusionPoints}
                onAddInclusionPoint={async (pointsArr) => {
                  handleInclusionExclusionPoints(pointsArr, exclusionPoints);
                }}
                onAddExclusionPoint={async (pointsArr) => {
                  handleInclusionExclusionPoints(inclusionPoints, pointsArr);
                }}
                undoPoints={undoPoints}
                redoPoints={redoPoints}
                setBatchMode={setBatchMode}
                batchMode={batchMode}
                submitBatchPoints={submitBatchPoints}
                onZoom={handleZoom}
              />
            </div>
          </div>
          <div className="flex-shrink-0 border-t ">
            <div className="flex items-center justify-between p-1 border-t border-gray-200">
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
          segments={segments}
          setSegments={setSegments}
          selectedSegmentForModal={selectedSegmentForModal}
          setSelectedSegmentForModal={setSelectedSegmentForModal}
          setIsLocked={setIsLocked}
          isLocked={isLocked}
          handleNull={handleNull}
          deleteSegment={deleteSegment}
          setShowSegments={setShowSegments}
          showSegments={showSegments}
          deleteAllSegment={deleteAllSegment}
          setShowSegmentModal={setShowSegmentModal}
          setDirectInferenceMode={setDirectInferenceMode}
          directInferenceMode={directInferenceMode}
          showMask={showMask}
          setShowMask={setShowMask}
        />

        {/* Class Modal */}
        {showClassModal && (
          <ClassModal
            modalMode={modalMode}
            newClassName={newClassName}
            setNewClassName={setNewClassName}
            setShowClassModal={setShowClassModal}
            handleSubmit={handleSubmit}
          />
        )}

        {/* Segment Class Modal */}
        {showSegmentModal && (
          <SegmentClassModal
            position={segmentModalPosition}
            classes={classes}
            selectedClass={selectedClassForSegment}
            setSelectedClass={setSelectedClassForSegment}
            onClose={() => setShowSegmentModal(false)}
            onSave={(selectedClass) => {
              setSegments((prev) =>
                prev.map((segment) =>
                  segment.id === selectedSegmentForModal.id
                    ? { ...segment, label: selectedClass }
                    : segment
                )
              );
              // Clean up refinement state
              setLockedHoverSegment(null);
              setDirectInferenceMode(false);
              setInclusionPoints([]);
              setExclusionPoints([]);
              setHoverInferenceResult(null);
              setShowSegmentModal(false);
            }}
          />
        )}


        {/* {directInferenceMode && <ComplexitySlider inferComplexity={inferComplexity} setInferComplexity={setInferComplexity} />} */}

      </div>
    </div>
  );
}

export default SegmentComponent;


