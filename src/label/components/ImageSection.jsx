import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiImage } from "react-icons/fi";
import { FaCheck, FaTimes, FaExclamation } from "react-icons/fa";
import { FixedSizeGrid as Grid } from "react-window";

const ImageSection = ({
  images,
  allAnnotations,
  backLink,
  projectId,
  version,
  task,
  projectName,
  labelOrSegment,
}) => {
  // console.log('Rendering ImageSection');
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const imagesPerPage = 48; // 4 columns x 12 rows

  // Calculate initial dimensions
  const calculateDimensions = () => {
    const containerPadding = 2;
    const gapSize = 8;
    const availableWidth = window.innerWidth - containerPadding;
    const columnWidth = Math.floor((availableWidth - gapSize * 3) / 4);
    const rowHeight = columnWidth + gapSize;

    return {
      columnWidth,
      rowHeight,
      containerWidth: availableWidth,
    };
  };

  const [dimensions, setDimensions] = useState(calculateDimensions());

  // Memoized filtered images
  const filteredImages = useMemo(() => {
    return images.filter((image) => {
      const matchedAnnotation = allAnnotations.find(
        (ann) => ann.imageIndex === image.id || ann.imageName === image.name
      );

      if (filter === "all") return true;
      if (filter === "labeled") {
        if (matchedAnnotation?.annotations) {
          return matchedAnnotation.annotations.length > 0;
        } else if (matchedAnnotation?.segments) {
          return matchedAnnotation.segments.length > 0;
        }
        return false;
      }
      if (filter === "null") {
        return (
          matchedAnnotation &&
          ((matchedAnnotation.annotations?.length === 0) ||
            (matchedAnnotation.segments?.length === 0))
        );
      }
      if (filter === "not-labeled") return !matchedAnnotation;
      return true;
    });
  }, [images, allAnnotations, filter]);

  // Paginated images
  const paginatedImages = useMemo(() => {
    return filteredImages.slice(
      (page - 1) * imagesPerPage,
      page * imagesPerPage
    );
  }, [filteredImages, page]);

  // Handle window resize with debounce
  useEffect(() => {
    const debounce = (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };

    const handleResize = debounce(() => {
      setDimensions(calculateDimensions());
    }, 100);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // Optimized Cell component
  const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * 4 + columnIndex;
    if (index >= paginatedImages.length) return null;

    const image = paginatedImages[index];
    const matchedAnnotation = allAnnotations.find(
      (ann) => ann.imageIndex === image.id || ann.imageName === image.name
    );

    let cornerColor = "bg-yellow-400";
    let StatusIcon = FaExclamation;
    let hasAnnotations = false;

    if (matchedAnnotation) {
      hasAnnotations =
        (matchedAnnotation.annotations?.length > 0) ||
        (matchedAnnotation.segments?.length > 0);

      if (hasAnnotations) {
        cornerColor = "bg-green-500";
        StatusIcon = FaCheck;
      } else {
        cornerColor = "bg-red-500";
        StatusIcon = FaTimes;
      }
    }

    const cellStyle = {
      ...style,
      width: `${dimensions.columnWidth}px`,
      padding: "4px",
    };

    const prefix = labelOrSegment === "bbox" ? "image-label" : "image-segment";
    // console.log('prefix',labelOrSegment);
    // path="/image-label/:backLink/:projectId/:projectName/:version"
    return (
      <div
        style={cellStyle}
        onClick={() => navigate(
          `/${prefix}/${backLink}/${projectId}/${projectName}/${version}/image/${image.id}`
        )}
      >
        <div className="relative group cursor-pointer w-full h-full">
          <div className={`absolute top-0 left-0 w-6 h-6 flex justify-center items-center rounded-tl-md z-10 ${cornerColor}`}>
            <StatusIcon className="w-3 h-3 text-white" />
          </div>

          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden w-full h-full">
            <img
              src={image.data}
              alt={image.name}
              className="w-full h-full object-cover transition group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="absolute rounded inset-2 bg-gradient-to-t from-black/30 to-transparent transition flex items-end p-2">
            <p className="text-white text-sm truncate w-full">
              {image.name.split("/").pop()}
            </p>
            <p className="text-white text-xl w-full">{image.id}</p>
          </div>
        </div>
      </div>
    );
  }, [paginatedImages, allAnnotations, dimensions, navigate, projectName, labelOrSegment]);


  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
        <div className="flex items-center mb-6">
          <div className="bg-indigo-100 p-2 rounded-lg mr-3">
            <FiImage className="text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Images</h2>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm border-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="all">All</option>
              <option value="labeled">Labeled</option>
              <option value="null">Null</option>
              <option value="not-labeled">Not Labeled</option>
            </select>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              {paginatedImages.length > 0 ? (
                <>Images {paginatedImages[0].id + 1} - {paginatedImages[paginatedImages.length - 1].id + 1} ({images.length} total)</>
              ) : (
                <>No images</>
              )}
            </span>
          </div>
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiImage className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-500 mb-4">
              {filter === "all"
                ? "No images found in this project"
                : `No ${filter.replace("-", " ")} images found`}
            </p>
            {filter !== "all" && (
              <button
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all mr-2"
                onClick={() => setFilter("all")}
              >
                Show all images
              </button>
            )}
            <button
              className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
              onClick={() => navigate(`/add-project`)}
            >
              <FiPlus className="mr-2" />
              Upload Images
            </button>
          </div>
        ) : (
          <>
            <div className="h-[600px] w-full overflow-y-hidden flex justify-center overflow-x-auto">
              <Grid
                columnCount={4}
                columnWidth={dimensions.columnWidth}
                height={600}
                rowCount={Math.ceil(paginatedImages.length / 4)}
                rowHeight={dimensions.rowHeight}
                width={dimensions.containerWidth}
              >
                {Cell}
              </Grid>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="mx-4 flex items-center">
                Page {page} of{" "}
                {Math.ceil(filteredImages.length / imagesPerPage)}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * imagesPerPage >= filteredImages.length}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageSection;