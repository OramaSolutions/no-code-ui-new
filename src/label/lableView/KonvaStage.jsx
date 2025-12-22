import React, { useState, useEffect, useRef } from "react";

import {
  Stage,
  Layer,
  Rect,
  Image as KonvaImage,
  Group,
  Label,
  Tag,
  Text,
  Line,
  Transformer,
} from "react-konva";

const KonvaStage = ({
  dimensions,
  tool,
  rectangles,
  setIsDrawing,
  imgRef,
  image,
  stageRef,
  setRectangles,
  isDrawing,
  setRectModalPosition,
  setShowRectModal,
  setSelectedRectForModal,
  selectedRectForModal,
  isLocked,
  showSegments,
  setShowSegments,
  onZoom,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const transformerRef = useRef();
  const imageObjRef = useRef(null);

  // Handle image loading
  useEffect(() => {
    if (!image) return;
    console.log('rects in konva stage:', rectangles)
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

  const handleStageMouseDown = (e) => {
    const isStage = e.target === e.target.getStage();
    const isImage = e.target.getClassName() === "Image";
    if (isStage || isImage) {
      setSelectedRectForModal(null);
    }

    if (tool !== "rectangle") return;
    const stage = e.target.getStage();

    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const pointerPosition = transform.point(stage.getPointerPosition());

    // console.log('DEBUG - MouseDown - Pointer Position:', pointerPosition);

    setRectangles([
      ...rectangles,
      {
        x: pointerPosition.x,
        y: pointerPosition.y,
        startX: pointerPosition.x,
        startY: pointerPosition.y,
        width: 5,
        height: 5,
        class: "",
        id: Date.now().toString(),
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      },
    ]);
    // console.log('DEBUG - MouseDown - Current rectangles:', rectangles);
    setIsDrawing(true);
  };

  const handleStageMouseMove = (e) => {
    const stage = e.target.getStage();
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const pointerPosition = transform.point(stage.getPointerPosition());

    setMousePos({ x: pointerPosition.x, y: pointerPosition.y });
    if (!isDrawing || rectangles.length === 0) return;

    const lastIndex = rectangles.length - 1;
    const lastRect = rectangles[lastIndex];

    const startX = lastRect.startX ?? lastRect.x;
    const startY = lastRect.startY ?? lastRect.y;

    const newX = pointerPosition.x;
    const newY = pointerPosition.y;

    const x = Math.min(startX, newX);
    const y = Math.min(startY, newY);
    const width = Math.abs(newX - startX);
    const height = Math.abs(newY - startY);

    // console.log('DEBUG - MouseMove - Rectangle State:', {
    //   lastRect,
    //   startX,
    //   startY,
    //   newX,
    //   newY,
    //   calculated: { x, y, width, height }
    // });

    const updatedRectangles = [...rectangles];
    updatedRectangles[lastIndex] = {
      ...lastRect,
      x,
      y,
      width,
      height,
    };

    setRectangles(updatedRectangles);
  };

  const handleStageMouseUp = (e) => {
    // console.log('DEBUG - MouseUp - Current rectangles:', rectangles);
    setIsDrawing(false);

    if (rectangles.length > 0) {
      const lastRect = rectangles[rectangles.length - 1];
      // console.log('DEBUG - MouseUp - Last rectangle:', lastRect);

      if (lastRect.width < 10 || lastRect.height < 10) {
        // console.log('DEBUG - MouseUp - Removing small rectangle');
        setRectangles(rectangles.slice(0, -1));
      } else {
        handleRectClick(e, lastRect);
      }
    }
  };

  const handleDragStart = (e) => {
    // console.log('DEBUG - DragStart - Rectangle:', e.target);
    e.cancelBubble = true;
    e.target.setAttr("initialX", e.target.x());
    e.target.setAttr("initialY", e.target.y());
  };

  const handleDragEnd = (e) => {
    const id = e.target.id();
    const initialX = e.target.getAttr("initialX");
    const initialY = e.target.getAttr("initialY");

    const dx = e.target.x() - initialX;
    const dy = e.target.y() - initialY;

    // console.log('DEBUG - DragEnd - Movement:', { dx, dy });

    const updatedRectangles = rectangles.map((rect) => {
      if (isLocked || rect.id === id) {
        const newRect = {
          ...rect,
          x: rect.id === id ? e.target.x() : rect.x + dx,
          y: rect.id === id ? e.target.y() : rect.y + dy,
        };
        // console.log('DEBUG - DragEnd - Updated rectangle:', newRect);
        return newRect;
      }
      return rect;
    });
    setRectangles(updatedRectangles);
  };

  const handleTransformEnd = (e) => {
    const node = e.target;
    const id = node.id();

    // console.log('DEBUG - TransformEnd - Node:', {
    //   id,
    //   x: node.x(),
    //   y: node.y(),
    //   width: node.width(),
    //   height: node.height(),
    //   scaleX: node.scaleX(),
    //   scaleY: node.scaleY()
    // });

    const updatedRectangles = rectangles.map((rect) => {
      if (rect.id === id) {
        const newRect = {
          ...rect,
          x: node.x(),
          y: node.y(),
          width: node.width() * node.scaleX(),
          height: node.height() * node.scaleY(),
          scaleX: 1,
          scaleY: 1,
        };
        // console.log('DEBUG - TransformEnd - Updated rectangle:', newRect);
        return newRect;
      }
      return rect;
    });

    node.scaleX(1);
    node.scaleY(1);
    setRectangles(updatedRectangles);
  };

  // for bakcspace to remove rect
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName.toLowerCase();
      const isInput = tag === "input" || tag === "textarea";

      // Don't intercept keys if user is typing in an input
      if (isInput) return;
      if (e.key === "Backspace") {
        e.preventDefault();
        if (selectedRectForModal) {
          setRectangles((prev) =>
            prev.filter((rect) => rect.id !== selectedRectForModal?.id)
          );
          setSelectedRectForModal(null);
        } else {
          setRectangles((prev) => prev.slice(0, -1));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rectangles, selectedRectForModal]);

  // for attaching transformer to selected rect
  useEffect(() => {
    const stage = stageRef.current;
    const transformer = transformerRef.current;
    if (!stage || !transformer) return;

    if (tool !== "move") {
      transformer.nodes([]);
      return;
    }

    if (selectedRectForModal) {
      const node = stage.findOne(`#${selectedRectForModal.id}`);
      const currentNodes = transformer.nodes();

      // Compare by ID instead of object reference
      if (
        node &&
        (!currentNodes.length ||
          currentNodes[0].id() !== selectedRectForModal.id)
      ) {
        transformer.nodes([node]);

        transformer.getLayer().batchDraw();
      }
    } else {
      transformer.nodes([]);
    }
  }, [selectedRectForModal, tool]);

  const handleRectClick = (e, rect) => {
    e.cancelBubble = true;

    const isStage = e.target === e.target.getStage();
    const isImage = e.target.getClassName() === "Image";
    if (isStage || isImage) return;

    const stage = e.target.getStage();
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

    const targetRect = { ...rectangles.find((r) => r.id === rect.id) };
    if (!targetRect) return;

    setSelectedRectForModal(targetRect);
    setRectModalPosition({
      x: modalX,
      y: modalY,
    });
    setShowRectModal(true);
  };

  const handleStageWheel = (e) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    if (e.evt.deltaY < 0) {
      // Zoom in
      if (typeof onZoom === 'function') {
        console.log('Zooming in KS', pointerPosition);
        onZoom("in", pointerPosition);
      }
    } else if (e.evt.deltaY > 0) {
      // Zoom out
      if (typeof onZoom === 'function') {
        console.log('Zooming out KS', pointerPosition);
        onZoom("out", pointerPosition);
      }
    }
  };

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

      {isImageLoaded ? (
        <Stage
          ref={stageRef}
          width={dimensions.rendered.width}
          height={dimensions.rendered.height}
          onMouseDown={handleStageMouseDown}
          onWheel={handleStageWheel}
          onMouseMove={handleStageMouseMove}
          onMouseUp={(e) => handleStageMouseUp(e)}
          draggable={tool === "move"}
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

            {tool === "rectangle" && (
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
                  strokeWidth={1}
                  dash={[4, 4]}
                  listening={false}
                />
                <Line
                  key="horizontal-line"
                  points={[0, mousePos.y, dimensions.rendered.width, mousePos.y]}
                  stroke="#999"
                  strokeWidth={1}
                  dash={[4, 4]}
                  listening={false}
                />
              </>
            )}

            {showSegments && rectangles.map((rect, index) => (
              <Rect
                key={rect.id ? rect.id : index}
                id={rect.id}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                fill={
                  rect.class.color
                    ? rect.class?.color
                    : "rgba(0, 161, 255, 0.3)"
                }
                opacity={0.3}
                stroke={
                  isLocked
                    ? "#ff0000"
                    : selectedRectForModal?.id === rect.id
                      ? "#030303"
                      : rect.class.color
                        ? rect.class?.color
                        : "#03a1fc"
                }
                strokeWidth={selectedRectForModal?.id === rect.id ? 2 : 2}
                draggable={tool === "move"}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onTransformEnd={handleTransformEnd}
                onClick={(e) => {
                  e.cancelBubble = true;
                  if (tool === "move") handleRectClick(e, rect);
                }}
                onTap={(e) => {
                  e.cancelBubble = true;
                  if (tool === "move") handleRectClick(e, rect);
                }}
                hitStrokeWidth={20}
                perfectDrawEnabled={false}
                transformEnabled={
                  tool === "move" && selectedRectForModal?.id === rect.id
                }
              />
            ))}

            <Transformer
              ref={transformerRef}
              key="transformer"
              rotateEnabled={false}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 10 || newBox.height < 10) {
                  return oldBox;
                }
                return newBox;
              }}
              anchorSize={6}
              borderStroke="#00a1ff"
              borderStrokeWidth={1}
            />
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
