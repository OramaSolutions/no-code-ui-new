import React, { useState, useEffect, useRef } from "react";
import Konva from 'konva';
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Group,
  Line,
  Circle,
  Transformer,
  Text,
} from "react-konva";
import { v4 as uuidv4 } from 'uuid';
const KonvaStage = ({
  tool,
  segments,
  setIsDrawing,
  imgRef,
  image,
  stageRef,
  dimensions,
  setSegments,
  isDrawing,
  selectedSegmentForModal,
  setSelectedSegmentForModal,
  setSegmentModalPosition,
  setShowSegmentModal,
  currentPoints,
  setCurrentPoints,
  isLocked,
  showSegments,
  hoverInferenceResult,
  directInferenceMode = false,
  onHover,
  onMouseLeave,
  showMask,
  setShowMask,
  setDirectInferenceMode,
  lockedHoverSegment,
  setLockedHoverSegment,
  onAddInclusionPoint,
  onAddExclusionPoint,
  setHoverInferenceResult,
  inclusionPoints,
  setInclusionPoints,
  exclusionPoints,
  setExclusionPoints,
  undoPoints,
  redoPoints,
  setBatchMode,
  batchMode,
  submitBatchPoints,
  onZoom
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scaleForDots, setScaleForDots] = useState(1);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const transformerRef = useRef();
  const imageObjRef = useRef(null);
  const hoverTimerRef = useRef(null);
  const lastHoverPosRef = useRef(null);

  // Handle image loading
  useEffect(() => {
    if (!image) return;

    const img = new window.Image();
    img.onload = () => {
      imageObjRef.current = img;
      setIsImageLoaded(true);
    };
    img.src = image.src;

    return () => {
      img.onload = null;
    };
  }, [image]);

  // Hover logic for direct inference
  const handleStageMouseMove = (e) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;
    const scale = stage.scaleX();
    setScaleForDots(scale);
    const x = (pointerPosition.x - stage.x()) / scale;
    const y = (pointerPosition.y - stage.y()) / scale;
    setMousePos({ x, y });

    // Direct inference hover logic
    if (directInferenceMode) {
      // If position changed, reset timer
      if (!lastHoverPosRef.current ||
        Math.abs(lastHoverPosRef.current.x - x) > 2 ||
        Math.abs(lastHoverPosRef.current.y - y) > 2) {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        lastHoverPosRef.current = { x, y };
        if (onMouseLeave) onMouseLeave();
        hoverTimerRef.current = setTimeout(() => {
          if (onHover) onHover([x / dimensions.scale, y / dimensions.scale]);
        }, 1000);
      }
    }

    // Handle point dragging
    if (selectedPoint) {
      // //console.log('Dragging point', selectedPoint);
      const dx = x - selectedPoint.startX;
      const dy = y - selectedPoint.startY;

      setSegments(prevSegments => {
        return prevSegments.map(segment => {
          if (segment.id === selectedPoint.segmentId) {
            const newPoints = [...segment.points];
            newPoints[selectedPoint.pointIndex] = [
              selectedPoint.originalPoints[selectedPoint.pointIndex][0] + dx / dimensions.scale,
              selectedPoint.originalPoints[selectedPoint.pointIndex][1] + dy / dimensions.scale
            ];

            return {
              ...segment,
              points: newPoints
            };
          }
          return segment;
        });
      });
    }
  };

  // Cleanup timer on mouse leave
  const handleStageMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    lastHoverPosRef.current = null;
    if (onMouseLeave) onMouseLeave();
    if (!lockedHoverSegment) { setHoverInferenceResult(null); }// <-- Add this line
  };

  useEffect(() => {
    //console.log('Segments updated:', segments);
  }, [segments])





  const handleStageMouseDown = (e) => {
    // if (isLocked) return;
    const stage = e.target.getStage();

    const stageRect = stage.container().getBoundingClientRect();
    const pointerPosition = stage.getPointerPosition();
    const scale = stage.scaleX();
    const x = (pointerPosition.x - stage.x()) / scale;
    const y = (pointerPosition.y - stage.y()) / scale;
    const modalWidth = 200;
    const modalHeight = 150;

    let modalX = stageRect.left + pointerPosition.x;
    let modalY = stageRect.top + pointerPosition.y;

    if (modalX + modalWidth > window.innerWidth) {
      modalX = pointerPosition.x - 50;
    }

    if (modalY + modalHeight > window.innerHeight) {
      modalY = pointerPosition.y - 50;
    }

    modalX = Math.max(10, Math.min(modalX, window.innerWidth - modalWidth - 10));
    modalY = Math.max(10, Math.min(modalY, window.innerHeight - modalHeight - 10));
    // If hover inference result is present and not locked, lock it on left click
    if (directInferenceMode && hoverInferenceResult && !lockedHoverSegment && e.evt.button === 0) {
      //console.log('in locking')
      // Find the segment that contains the clicked point
      const found = hoverInferenceResult
      if (found) {
        //console.log('Locking hover segment:', found);
        // setDirectInferenceMode(false);
        setLockedHoverSegment(found);
        setSegments(prev => {
          //console.log('prev and locked segments:', prev, found);
          return [...prev, found]
        })
        // setHoverInferenceResult(null);
        setSelectedSegmentForModal(found);
        setSegmentModalPosition({
          x: modalX,
          y: modalY,
        });
        setShowSegmentModal(true);
        return;
      }
    }

    // If locked, handle inclusion point (left click)
    if (lockedHoverSegment) {
      // Shift + Left Click for inclusion points

      if (e.evt.button === 0) {
        //console.log('in inc')
        const newArr = [...inclusionPoints, [x / dimensions.scale, y / dimensions.scale]];
        setInclusionPoints(newArr);
        onAddInclusionPoint(newArr);
        setShowSegmentModal(false);
        return;
      }
      // Shift + Right Click for exclusion points
      if (e.evt.button === 2) {
        //console.log('in exc')
        const newArr = [...exclusionPoints, [x / dimensions.scale, y / dimensions.scale]];
        setExclusionPoints(newArr);
        onAddExclusionPoint(newArr);
        setShowSegmentModal(false);
        return;
      }
    }

    // No click logic for direct inference mode
    if (directInferenceMode) {
      return;
    }

    // Check if we're clicking on a point of an existing segment
    if (tool === "move" && !isDrawing) {
      const clickedOn = e.target;

      //console.log('Clicked on:', clickedOn);
      // If we clicked on a point circle
      if (clickedOn.getClassName() === "Circle") {
        // const segmentId = clickedOn.parent.attrs.id;
        const segmentId = clickedOn.attrs.segmentId;
        // //console.log('Clicked on point of segment:', segmentId);
        const pointName = clickedOn.name();
        const pointIndex = parseInt(pointName.split('-')[1]);
        if (isNaN(pointIndex)) {
          console.error('Failed to parse point index from:', pointName);
          return;
        }
        //console.log('x', x, 'y', y, 'clickedOn', clickedOn, 'segmentId', segmentId, 'pointIndex', pointIndex);
        const segment = segments.find(s => s.id === segmentId);
        //console.log('Found segment for point drag:', segments, segmentId, segment);
        if (segment) {
          setSelectedPoint({
            segmentId,
            pointIndex,
            startX: x,
            startY: y,
            originalPoints: [...segment.points]
          });
          e.cancelBubble = true;
          return;
        }
      }
    }

    // Polygon creation logic
    if (tool === "polygon" && e.evt.button === 0) {
      if (!isDrawing) {
        setIsDrawing(true);
        setCurrentPoints([[x, y]]);
      } else {
        setCurrentPoints([...currentPoints, [x, y]]);
      }
    }
  };

  const handleStageMouseUp = (e) => {
    if (selectedPoint) {
      setSelectedPoint(null);
    }
  };

  const handleStageKeyDown = (e) => {
    if (tool !== "polygon") return;

    // Delete last point with Backspace while drawing
    if (e.key === "Backspace" && isDrawing && currentPoints.length > 0) {
      e.preventDefault();
      setCurrentPoints(currentPoints.slice(0, -1));
      if (currentPoints.length === 1) {
        setIsDrawing(false);
      }
    }
    // Complete polygon with Enter
    else if (e.key === "Enter" && isDrawing && currentPoints.length >= 3) {
      e.preventDefault();
      completePolygon(e);
    }
  };

  const handleSegmentClick = (e) => {
    e.cancelBubble = true;
    if (tool !== "move" || isLocked) return;
    if (transformerRef.current) {
      transformerRef.current.nodes([]);
    }
    //console.log('=== CLICK DEBUG ===');
    //console.log('e.target:', e.target);
    //console.log('e.target.id():', e.target.id());
    //console.log('Available segments:', segments.map(s => s.id));

    const segmentId = e.target.id();
    const segment = segments.find(s => s.id === segmentId);

    //console.log('Looking for segmentId:', segmentId);
    //console.log('Found segment:', segment);
    //console.log('===================');

    if (!segment) {
      console.warn('Clicked segment could not be found for id:', segmentId);
      return;
    }

    //console.log('handleSegmentClick', segment);



    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const stageRect = stage.container().getBoundingClientRect();
    const modalWidth = 200;
    const modalHeight = 150;
    //console.log('pointer pos', pos)
    let modalX = stageRect.left + pos.x;
    let modalY = stageRect.top + pos.y;

    if (modalX + modalWidth > window.innerWidth) {
      modalX = pos.x - 50;
    }

    if (modalY + modalHeight > window.innerHeight) {
      modalY = pos.y - 50;
    }

    modalX = Math.max(10, Math.min(modalX, window.innerWidth - modalWidth - 10));
    modalY = Math.max(10, Math.min(modalY, window.innerHeight - modalHeight - 10));

    setSelectedSegmentForModal(segment);
    setSegmentModalPosition({
      x: modalX,
      y: modalY,
    });
    setShowSegmentModal(true);
  };

  const completePolygon = (e) => {
    if (currentPoints.length < 3) return;

    // Convert points to original image coordinates when saving
    const newSegment = {
      id: uuidv4(),
      points: currentPoints.map((point) => [
        point[0] / dimensions.scale,
        point[1] / dimensions.scale,
      ]),
      label: "",
    };

    setSegments([...segments, newSegment]);
    setCurrentPoints([]);
    setIsDrawing(false);

    const stage = stageRef.current;
    const pos = stage.getPointerPosition();
    const stageRect = stage.container().getBoundingClientRect();
    const modalWidth = 200;
    const modalHeight = 150;

    let modalX = stageRect.left + pos.x;
    let modalY = stageRect.top + pos.y;

    if (modalX + modalWidth > window.innerWidth) {
      modalX = pos.x - 50;
    }

    if (modalY + modalHeight > window.innerHeight) {
      modalY = pos.y - 50;
    }

    modalX = Math.max(10, Math.min(modalX, window.innerWidth - modalWidth - 10));
    modalY = Math.max(10, Math.min(modalY, window.innerHeight - modalHeight - 10));

    setSelectedSegmentForModal(newSegment);
    setSegmentModalPosition({
      x: modalX,
      y: modalY,
    });
    setShowSegmentModal(true);
  };

  // Modify context menu for direct inference mode
  const handleStageContextMenu = (e) => {
    e.evt.preventDefault();


    const stage = e.target.getStage();

    // Case 1: If drawing, complete the polygon only if we have at least 3 points
    if (isDrawing && currentPoints.length >= 3) {
      completePolygon(e);
    }
    // Case 2: If right-clicked on existing polygon
    else if (e.target !== stage && tool === "move") {
      const shape = e.target;
      const segment = segments.find((s) => s.id === shape.id());
      if (segment) {
        const pos = stage.getPointerPosition();
        const stageRect = stage.container().getBoundingClientRect();

        setSelectedSegmentForModal(segment);
        setSegmentModalPosition({
          x: stageRect.left + pos.x,
          y: stageRect.top + pos.y,
        });
        setShowSegmentModal(true);
      }
    }
    // Case 3: If right-clicked while drawing but with less than 3 points, cancel drawing
    else if (isDrawing) {
      setCurrentPoints([]);
      setIsDrawing(false);
    }
  };

  // Remove all previous keydown listeners and use a single handler for Backspace/Shift+Backspace
  useEffect(() => {

    const handleKeyDown = (e) => {
      const tag = e.target.tagName.toLowerCase();
      const isInput = tag === "input" || tag === "textarea";
      if (isInput) return;

      // Undo/Redo (Ctrl+Z, Ctrl+Shift+Z)
      if (lockedHoverSegment && e.ctrlKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          if (typeof undoPoints === 'function') undoPoints();
          return;
        }
        if (e.key === 'z' && e.shiftKey) {
          e.preventDefault();
          if (typeof redoPoints === 'function') redoPoints();
          return;
        }
      }

      // Toggle batch mode (B key)
      if (lockedHoverSegment && e.key === 'b' && !e.ctrlKey) {
        e.preventDefault();
        if (typeof setBatchMode === 'function') setBatchMode(prev => !prev);
        return;
      }

      // Submit batch (Enter in batch mode)
      if (lockedHoverSegment && batchMode && e.key === 'Enter') {
        e.preventDefault();
        if (typeof submitBatchPoints === 'function') submitBatchPoints();
        return;
      }

      // Existing inclusion/exclusion point removal logic...
      if (lockedHoverSegment) {
        if (e.key === "Backspace" && e.shiftKey && exclusionPoints.length > 0) {
          e.preventDefault();
          const newArr = exclusionPoints.slice(0, -1);
          setExclusionPoints(newArr);
          if (typeof onAddExclusionPoint === 'function') onAddExclusionPoint(newArr);
          return;
        }
        if (e.key === "Backspace" && !e.shiftKey && inclusionPoints.length > 0) {
          e.preventDefault();
          const newArr = inclusionPoints.slice(0, -1);
          setInclusionPoints(newArr);
          if (typeof onAddInclusionPoint === 'function') onAddInclusionPoint(newArr);
          return;
        }
      }

      // 2. Polygon drawing points removal
      if (tool === "polygon" && isDrawing && currentPoints.length > 0) {
        if (e.key === "Backspace") {
          e.preventDefault();
          setCurrentPoints(currentPoints.slice(0, -1));
          if (currentPoints.length === 1) {
            setIsDrawing(false);
          }
          return;
        }
      }

      // 3. Delete selected segment (lowest priority)
      if (e.key === "Backspace" && !isDrawing && selectedSegmentForModal) {
        e.preventDefault();
        setSegments((prev) =>
          prev.filter((segment) => segment.id !== selectedSegmentForModal.id)
        );
        setSelectedSegmentForModal(null);
        return;
      }

      // 4. Complete polygon with Enter (keep this for polygon tool)
      if (tool === "polygon" && isDrawing && currentPoints.length >= 3 && e.key === "Enter") {
        e.preventDefault();
        completePolygon(e);
        return;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lockedHoverSegment,
    batchMode,
    inclusionPoints,
    exclusionPoints,
    setInclusionPoints,
    setExclusionPoints,
    onAddInclusionPoint,
    onAddExclusionPoint,
    tool,
    isDrawing,
    currentPoints,
    selectedSegmentForModal,
    setSegments,
    undoPoints,
    redoPoints,
    setBatchMode,
    submitBatchPoints,
    completePolygon])
  // Attach transformer to selected segment
  useEffect(() => {
    const stage = stageRef.current;
    const transformer = transformerRef.current;
    if (!stage || !transformer) return;

    if (tool !== "move") {
      transformer.nodes([]);
      return;
    }

    if (selectedSegmentForModal) {
      const node = stage.findOne(`#${selectedSegmentForModal.id}`);
      const currentNodes = transformer.nodes();

      if (
        node &&
        (!currentNodes.length ||
          currentNodes[0].id() !== selectedSegmentForModal.id)
      ) {
        transformer.nodes([node]);
        transformer.getLayer().batchDraw();
      }
    } else {
      transformer.nodes([]);
    }
  }, [selectedSegmentForModal, tool]);


  const handleStageWheel = (e) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    if (e.evt.deltaY < 0) {
      // Zoom in
      if (typeof onZoom === 'function') {
        //console.log('Zooming in KS', pointerPosition);
        onZoom("in", pointerPosition);
      }
    } else if (e.evt.deltaY > 0) {
      // Zoom out
      if (typeof onZoom === 'function') {
        //console.log('Zooming out KS', pointerPosition);
        onZoom("out", pointerPosition);
      }
    }
  };


  // Utility: check if point is inside polygon
  function isPointInPolygon(point, polygon) {
    let x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xi = polygon[i][0], yi = polygon[i][1];
      let xj = polygon[j][0], yj = polygon[j][1];
      let intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-10) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  const renderSegments = () => {
    return segments.map((segment) => {
      const screenPoints = segment.points.map((point) => [
        point[0] * dimensions.scale,
        point[1] * dimensions.scale,
      ]);

      return (
        <Group key={segment.id} draggable={false}>
          {screenPoints.length > 0 && showSegments && (
            <>
              {/* Main visible polygon */}
              <Line
                points={screenPoints.flat()}
                closed
                fill={
                  selectedSegmentForModal?.id === segment.id ? "rgba(0, 119, 255, 0.3)" : segment.label?.color
                    ? `${segment.label.color}4D`
                    : "rgba(0, 161, 255, 0.3)"
                }
                stroke={
                  lockedHoverSegment?.id === segment.id
                    ? "#0077ff"
                    : selectedSegmentForModal?.id === segment.id
                      ? "#030303"
                      : segment.label?.color || "#03a1fc"
                }
                strokeWidth={(
                  lockedHoverSegment?.id === segment.id || selectedSegmentForModal?.id === segment.id
                    ? 2
                    : 1
                ) / scaleForDots}
                perfectDrawEnabled={false}
                listening={true}
                id={segment.id}
                onClick={handleSegmentClick}
              />

              {/* Invisible larger hit area for easier clicking */}
              <Line
                points={screenPoints.flat()}
                closed
                fill="transparent"
                stroke="transparent"
                strokeWidth={15 / scaleForDots} // Large invisible stroke
                perfectDrawEnabled={false}
                listening={true}
                id={segment.id}
                onClick={handleSegmentClick}
              />

              {/* Points rendering */}
              {screenPoints.map((point, i) => (
                <React.Fragment key={`${segment.id}-point-${i}`}>
                  {!showMask && <Circle
                    key={`${segment.id}-target-${i}`}
                    segmentId={segment.id}
                    name={`point-${i}`}
                    x={point[0]}
                    y={point[1]}
                    radius={6 / scaleForDots}
                    fill="rgba(0,0,0,0)"
                    listening={!isLocked}
                    draggable={false}
                  />}
                  {!showMask && <Circle
                    key={`${segment.id}-point-${i}`}
                    segmentId={segment.id}
                    name={`point-${i}`}
                    x={point[0]}
                    y={point[1]}
                    radius={4 / scaleForDots}
                    fill={selectedPoint?.segmentId === segment.id && selectedPoint?.pointIndex === i ? "#00ff00" : "red"}
                    stroke="black"
                    strokeWidth={1 / scaleForDots}
                    listening={!isLocked}
                    draggable={false}
                  />}
                </React.Fragment>
              ))}
            </>
          )}
        </Group>
      );
    });
  };


  function renderHoverSegment() {
    if (
      hoverInferenceResult &&

      hoverInferenceResult.points &&
      hoverInferenceResult.points.length > 0
    ) {
      const screenPoints = hoverInferenceResult.points.map((point) => [
        point[0] * dimensions.scale,
        point[1] * dimensions.scale,
      ]);
      // //console.log('rendersing hover segment in', hoverInferenceResult)
      return (
        <Group>
          <Line
            points={screenPoints.flat()}
            closed
            fill="rgba(0,255,0,0.3)"
            stroke="#00ff00"
            strokeWidth={2 / scaleForDots}
          />
        </Group>
      );
    }
    return null;
  }

  useEffect(() => {
    return () => {
      // Cleanup any running animations when component unmounts
      if (stageRef.current) {
        const stage = stageRef.current;
        const layer = stage.findOne('Layer');
        if (layer) {
          layer.find('Circle').forEach(circle => {
            if (circle._cleanupTimer) {
              clearTimeout(circle._cleanupTimer);
            }
            if (circle._animation) {
              circle._animation.stop();
              // circle._animation.destroy();
            }
          });
        }
      }
    };
  }, []);




  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Hidden image for dimension measurement */}

      {image && (
        <img
          ref={imgRef}
          src={image.src}
          alt="object"
          className="object-contain absolute opacity-0 w-full h-full"
          style={{
            pointerEvents: "none",
            maxWidth: "100%",
            maxHeight: "100vh",
            padding: 0,
            margin: 0,
          }}
        />
      )}
      {isImageLoaded && dimensions.original.width > 0 && dimensions.original.height > 0 ? (
        <Stage
          ref={stageRef}
          width={dimensions.rendered.width}
          height={dimensions.rendered.height}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleStageMouseMove}
          onMouseUp={handleStageMouseUp}
          onWheel={handleStageWheel}
          onContextMenu={handleStageContextMenu}
          onMouseLeave={handleStageMouseLeave}
          draggable={directInferenceMode || (tool === "move" && !selectedPoint && !isDrawing)}
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100vh",
            display: "block",
            margin: "auto",
          }}
        >
          <Layer key="main-layer">
            <KonvaImage
              image={imageObjRef.current}
              key="background-image"
              width={dimensions.rendered.width}
              height={dimensions.rendered.height}
              x={0}
              y={0}
              listening={false}
            />



            <>
              {/* Guide lines for polygon drawing */}
              {tool === "polygon" && (
                <>
                  <Line
                    key="vertical-line"
                    points={[
                      mousePos.x,
                      0,
                      mousePos.x,
                      dimensions.rendered.height,
                    ]}
                    stroke="#999"
                    strokeWidth={1 / scaleForDots}
                    dash={[4, 4]}
                    listening={false}
                  />
                  <Line
                    key="horizontal-line"
                    points={[
                      0,
                      mousePos.y,
                      dimensions.rendered.width,
                      mousePos.y,
                    ]}
                    stroke="#999"
                    strokeWidth={1 / scaleForDots}
                    dash={[4, 4]}
                    listening={false}
                  />
                  {/* Drawing instructions */}
                  {/* <Text
                    x={10}
                    y={10}
                    text={`Points: ${currentPoints.length} (Min: 3)\nRight-click to complete\nBackspace to delete last point\nEnter to complete`}
                    fontSize={14}
                    fill="#666"
                    padding={5}
                    align="left"
                  /> */}
                </>
              )}
              {/* Hovered segment overlay */}
              {renderHoverSegment()}
              {/* Completed segments */}
              {renderSegments()}
              {/* Current polygon being drawn */}
              {isDrawing && currentPoints.length > 0 && (
                <Group>
                  <Line
                    points={currentPoints.flat()}
                    stroke={currentPoints.length >= 3 ? "#00ff00" : "#ff0000"}
                    strokeWidth={2 / scaleForDots}
                  />
                  {currentPoints.map((point, i) => (
                    <Circle
                      key={`current-point-${i}`}
                      x={point[0]}
                      y={point[1]}
                      radius={2 / scaleForDots}
                      fill={i === currentPoints.length - 1 ? "#00ff00" : "red"}
                      stroke="black"
                      strokeWidth={1 / scaleForDots}
                    />
                  ))}
                  {/* Line from last point to mouse position */}
                  {currentPoints.length > 0 && mousePos && (
                    <Line
                      points={[
                        currentPoints[currentPoints.length - 1][0],
                        currentPoints[currentPoints.length - 1][1],
                        mousePos.x,
                        mousePos.y,
                      ]}
                      stroke={currentPoints.length >= 2 ? "#00ff00" : "#ff0000"}
                      strokeWidth={2 / scaleForDots}
                      dash={[4, 4]}
                    />
                  )}
                  {/* Line from first point to mouse position when we have 2+ points */}
                  {currentPoints.length >= 2 && mousePos && (
                    <Line
                      points={[
                        currentPoints[0][0],
                        currentPoints[0][1],
                        mousePos.x,
                        mousePos.y,
                      ]}
                      stroke={currentPoints.length >= 3 ? "#00ff00" : "#ff0000"}
                      strokeWidth={2 / scaleForDots}
                      dash={[4, 4]}
                    />
                  )}
                </Group>
              )}
              {/* Inclusion and Exclusion Points */}
              {/* Show inclusion points as green circles */}

              {lockedHoverSegment && inclusionPoints && inclusionPoints.map((pt, idx) => (
                <Group key={`inclusion-group-${idx}`}>
                  <Circle
                    x={pt[0] * dimensions.scale}
                    y={pt[1] * dimensions.scale}
                    radius={5 / scaleForDots}
                    fill="#00ff00"
                    stroke="#fff"
                    strokeWidth={2 / scaleForDots}
                    listening={false}
                    opacity={0.9}
                  />
                  {/* Animated ring for newest point */}
                  {idx === inclusionPoints.length - 1 && (
                    <Circle
                      x={pt[0] * dimensions.scale}
                      y={pt[1] * dimensions.scale}
                      radius={8 / scaleForDots}
                      stroke="#00ff00"
                      strokeWidth={2 / scaleForDots}
                      listening={false}
                      opacity={0.6}
                      ref={(node) => {
                        if (node) {
                          const anim = new Konva.Animation((frame) => {
                            const scale = Math.sin(frame.time * 0.005) * 0.3 + 1;
                            node.scaleX(scale);
                            node.scaleY(scale);
                          }, node.getLayer());
                          anim.start();
                          setTimeout(() => anim.stop(), 2000);
                        }
                      }}
                    />
                  )}
                </Group>
              ))}

              {lockedHoverSegment && exclusionPoints && exclusionPoints.map((pt, idx) => (
                <Group key={`exclusion-group-${idx}`}>
                  <Circle
                    x={pt[0] * dimensions.scale}
                    y={pt[1] * dimensions.scale}
                    radius={5 / scaleForDots}
                    fill="#ff4444"
                    stroke="#fff"
                    strokeWidth={2 / scaleForDots}
                    listening={false}
                    opacity={0.9}
                  />
                  {/* Animated ring for newest point */}
                  {idx === exclusionPoints.length - 1 && (
                    <Circle
                      x={pt[0] * dimensions.scale}
                      y={pt[1] * dimensions.scale}
                      radius={8 / scaleForDots}
                      stroke="#ff4444"
                      strokeWidth={2 / scaleForDots}
                      listening={false}
                      opacity={0.6}
                      ref={(node) => {
                        if (node) {
                          const anim = new Konva.Animation((frame) => {
                            const scale = Math.sin(frame.time * 0.005) * 0.3 + 1;
                            node.scaleX(scale);
                            node.scaleY(scale);
                          }, node.getLayer());
                          anim.start();
                          const timer = setTimeout(() => {
                            anim.stop();

                          }, 2000);

                          // Store cleanup function on the node
                          node._cleanupTimer = timer;
                          node._animation = anim;
                        }
                      }}
                    />
                  )}
                </Group>
              ))}

            </>

          </Layer>
        </Stage>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <p>Loading image...</p>
        </div>
      )}
    </div>
  );
};

export default KonvaStage;