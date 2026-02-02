import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import OverviewHeader from "./components/OverviewHeader";
import ClassesSection from "./components/ClassesSection";
import Navbar from "./components/Navbar";
// import { prepareDataset, trainNow, scheduleTraining, getTrainingStatus, getAllFinetunedModels, chooseModelAndReset } from "./utils/trainFunctions";
import { FiClock } from "react-icons/fi";
import { useSelector } from "react-redux";
import {
  FiX,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";


import {
  saveProjectClasses,
  getProjectClasses,
  addImages,
  getProjectAnnotations,
  getProjectSegmentAnnotation,
  getProjectOcrAnnotations,
  getProjectThumbnails,
  getProjectStats,
  setAnnotationType,
  getBaseUrlFromBackLink,
  getTaskFromBackLink,
} from "./utils/crudFunctions"



// import AnnotaionHeatmap from "../components/AnnotaionHeatmap";
import ImageSection from "./components/ImageSection";
import { CLASS_COLORS } from "./utils/classColors";



function ProjectOverview() {
  const { backLink, projectId, projectName, version } = useParams();
  if (!backLink || !projectId || !projectName || !version) {
    throw new Error("Invalid route params");
  }
  const backURL = `/${backLink}/${projectId}/${projectName}/${version}`;

  // Get baseUrl from backLink
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

  const [images, setImages] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newClassName, setNewClassName] = useState("");
  const [editingClass, setEditingClass] = useState(null);
  const [editClassValue, setEditClassValue] = useState("");

  const [allAnnotations, setAllAnnotations] = useState([]);

  const [labelOrSegment, setLabelOrSegment] = useState(null);
  const [loadingType, setLoadingType] = useState(false);
  const [datasetLength, setDatasetLength] = useState(() => {
    const savedLength = localStorage.getItem(`${projectName}_datasetLength`);
    return savedLength ? parseInt(savedLength) : 0;
  });

  const [showStatsDropdown, setShowStatsDropdown] = useState(false);
  const [stats, setStats] = useState(null);




  const fetchAnnotationType = async () => {
    const stats = await getProjectStats(
      baseUrl,
      projectName,
      userData.userName,
      version,
      task
    );

    const normalizedStats = {
      annotationType: stats.annotation_type,

      updatedAt: Date.now(), // important
      totalImages: stats.total_images,
      labeledImages: stats.labeled_images,
      unlabeledImages: stats.unlabeled_images,
      completionPercentage: stats.completion_percentage,
    };
    const STATS_STORAGE_KEY = `project_stats:${projectName}:${version}:${task}`;
   
    localStorage.setItem(
      STATS_STORAGE_KEY,
      JSON.stringify(normalizedStats)
    );

    return {
      type: stats.annotation_type,
      stats: {
        annotationType: stats.annotation_type,
        createdAt: null,
        createdBy: null,
        updatedAt: null,
        totalImages: stats.total_images,
        labeledImages: stats.labeled_images,
        unlabeledImages: stats.unlabeled_images,
        completionPercentage: stats.completion_percentage,
      },
    };
  };

  // useEffect(() => {
  //   fetchAnnotationType()
  // }, [projectName])

  const handleTypeChange = async (type) => {
    try {
      setLoadingType(true);
      const success = await setAnnotationType(baseUrl, projectName, type, userData.userName, version, task);
      if (success) {
        setLabelOrSegment(type);
      }
    } catch (error) {
      console.error("Failed to update annotation type:", error);
    } finally {
      setLoadingType(false);
    }
  };

  // ------------------------project type end----------------------------

  // initialization and loading data --------------------
  // Get the stored project name and compare
  useEffect(() => {

    initializeProject();

  }, [projectName]);

  const initializeProject = useCallback(
    async () => {
      let isMounted = true;

      try {
        setLoading(true);
        // setProjectName(projectName);
        // 1. First get the project type
        const { type, stats } = await fetchAnnotationType();

        setLabelOrSegment(type);

        // console.log("Fetched annotation type:", type);
        setStats(stats);

        const [loadedClasses, loadedImages, loadedAnnotations] =
          await Promise.all([
            loadClasses(true),
            loadImages(true),
            loadAnnotations(true, type),
          ]);

        if (isMounted) {
          setClasses(loadedClasses.classes || []);
          setImages(loadedImages);
          // console.log("loadedAnnotations>>>>>", loadedAnnotations);
          setAllAnnotations(loadedAnnotations);
        }
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    },
    [projectName]
  );

  // using backend classes only
  const loadClasses = async (useBackendData) => {
    try {
      // console.log("backendClasses");
      const backendClasses = await getProjectClasses(baseUrl, projectName, userData.userName, version, task);

      // await saveClasses(backendClasses); // Save to IndexedDB for future use

      return backendClasses;

      // console.log("localClasses");
      // return await getClasses(); // From IndexedDB
    } catch (error) {
      console.error("Failed to load classes:", error);
      return [];
    }
  };

  const loadImages = async (useBackendData) => {
    try {
      if (useBackendData) {
        // let startIndex = 0;
        // let endIndex = 10;
        // let isInitialLoad = true;
        // console.log('passing the username as', userData.userName)
        const result = await getProjectThumbnails(
          baseUrl,
          projectName,
          userData.userName,
          version,
          task
        );
        // console.log('backendImages', result);
        if (result.datasetLength) {
          setDatasetLength(result.datasetLength);
          localStorage.setItem(
            `${projectName}_datasetLength`,
            result.datasetLength.toString()
          );
        }
        // console.log("Images loaded from backend.", result.images);
        return result.images || [];
      }

      // For local loading, implement pagination
      // console.log("local images");
      // return await getImages();
    } catch (error) {
      console.error("Failed to load images:", error);
      return [];
    }
  };

  // going to use annotations from backend only
  const loadAnnotations = async (useBackendData, type) => {
    try {
      if (!type) return [];
      // console.log("backendAnnotations");
      let backendAnnotations = [];
      if (type === "bbox") {
        backendAnnotations = await getProjectAnnotations(baseUrl, projectName, userData.userName, version, task);
      } else if (type === "segment") {
        backendAnnotations = await getProjectSegmentAnnotation(baseUrl, projectName, userData.userName, version, task);
      }
      else if (type === "ocr") {
        backendAnnotations = await getProjectOcrAnnotations(baseUrl, projectName, userData.userName, version, task);
      }


      // console.log("backendAnnotations", backendAnnotations);
      // await saveAnnotations(backendAnnotations);

      return backendAnnotations;


    } catch (error) {
      console.error("Failed to load annotations:", error);
      return [];
    }
  };
  // revoke object URLs when they're no longer needed: CLEANUP
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.data);
      });
    };
  }, [images]);

  // initialization and loading data --------------------

  // class manangement --------------------------------
  const handleAddClass = async () => {
    const names = newClassName.trim();
    if (!names) return;

    // Split by comma and trim each name
    const classNames = names
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name);

    if (classNames.length === 0) return;

    // Check for duplicates
    const duplicates = classNames.filter((name) =>
      classes.some((cls) => cls.name === name)
    );

    if (duplicates.length > 0) {
      console.error(
        `Class names must be unique. Duplicates found: ${duplicates.join(", ")}`
      );
      return;
    }

    try {
      const newClasses = [...classes];
      const startIndex = classes.length;

      // Add each new class
      for (let i = 0; i < classNames.length; i++) {
        const name = classNames[i];
        const index = startIndex + i;
        const color = CLASS_COLORS[index % CLASS_COLORS.length];

        const newClass = {
          id: name,
          name,
          color,
          index,
        };

        newClasses.push(newClass);
      }

      setClasses(newClasses);
      setNewClassName("");

      // Save to both IndexedDB and backend
      // await saveClasses(newClasses);
      await saveProjectClasses(baseUrl, newClasses, projectName, userData.userName, version, task);
      await loadClasses();
    } catch (error) {
      console.error("Failed to add classes:", error);
    }
  };

  const handleEditClass = async (oldName) => {
    const newName = editClassValue.trim();
    if (!newName) return;

    // Prevent duplicate name
    if (classes.some((cls) => cls.name === newName)) {
      console.error("Class name must be unique.");
      return;
    }

    const updatedClasses = classes.map((cls) =>
      cls.name === oldName
        ? { ...cls, name: newName, id: newName } // Update both name and id
        : cls
    );

    try {
      setClasses(updatedClasses);
      // await saveClasses(updatedClasses);
      await saveProjectClasses(baseUrl, updatedClasses, projectName, userData.userName, version, task);
      setEditingClass(null);
      setEditClassValue("");
      await loadClasses();
    } catch (error) {
      console.error("Failed to edit class:", error);
    }
  };

  const handleDeleteClass = async (nameToDelete) => {
    const updatedClasses = classes
      .filter((cls) => cls.name !== nameToDelete)
      .map((cls, idx) => ({
        ...cls,
        index: idx,
      }));

    setClasses(updatedClasses);
    // await saveClasses(updatedClasses);
    await saveProjectClasses(baseUrl, updatedClasses, projectName, userData.userName, version, task);
    await loadClasses();
  };






  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-gray-500">
          Loading project data...
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto bg-  w-full">
      <Navbar />

      <div className=" w-screen max-w-7xl mx-auto px-4 ">
        {/* Header Section */}
        <OverviewHeader
          backURL={backURL}
          projectName={projectName}
          datasetLength={datasetLength}
          handleTypeChange={handleTypeChange}
          loadingType={loadingType}
          labelOrSegment={labelOrSegment}

          setShowStatsDropdown={setShowStatsDropdown}
          stats={stats}
          showStatsDropdown={showStatsDropdown}

        />



        <div className="flex flex-col gap-8">
          {/* Classes Section */}
          <ClassesSection newClassName={newClassName}
            setNewClassName={setNewClassName}
            handleAddClass={handleAddClass}
            classes={classes}
            editingClass={editingClass}
            editClassValue={editClassValue}
            setEditClassValue={setEditClassValue}
            setEditingClass={setEditingClass}
            handleEditClass={handleEditClass}
            handleDeleteClass={handleDeleteClass}

          />

          {/* Images Section */}
          <ImageSection
            images={images}
            allAnnotations={allAnnotations || []}
            projectId={projectId}
            baseUrl={baseUrl}
            version={version}
            task={task}
            userName={userData.userName}
            backLink={backLink}
            projectName={projectName}
            labelOrSegment={labelOrSegment}
          />
        </div>
      </div>

    </div>
  );
}

export default ProjectOverview;

