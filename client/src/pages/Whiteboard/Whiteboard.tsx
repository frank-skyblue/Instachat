import React, { useEffect } from "react";
import { Stage, Layer } from 'react-konva';
import { Container } from 'react-bootstrap';
import "./Whiteboard.css"

// Custom hooks
import useLines from "./customHooks/useLines"
import useShapes from "./customHooks/useShapes"
import useClientSize from "./customHooks/useClientSize";
import useProperties from "./customHooks/useProperties";
import useTools from "./customHooks/useTools";

// Mouse action handlers
import useLineHandlers from "./handlers/lineHandler";
import useShapeHandlers from "./handlers/shapeHandler"

// JSX Components
import getEraserTool from "./htmlComponents/eraserTool";
import getColorTool from "./htmlComponents/colorTool";
import getShapesTool from "./htmlComponents/shapesTool";
import getSizeTool from "./htmlComponents/sizeTool";
import getLineRender from "./htmlComponents/lineRender";
import getShapeRender from "./htmlComponents/shapeRender";
import getToolSelector from "./htmlComponents/toolSelect";
import socket from "../helpers/socket";

interface WhiteboardProps { }

export const Whiteboard: React.FC<WhiteboardProps> = () => {
  // Mode (line or shape) and tool (pen, eraser or shape)
  const [mode, setMode] = React.useState('line');

  // Custom hooks
  const { lines, setLines, clearLines } = useLines();
  const { squares, setSquares, circles, setCircles, triangles, setTriangles, clearShapes } = useShapes();
  const { tool, setTool, toolRef } = useTools(setMode); // Tool control

  // Size, Color, Shape properties
  const { sizes, colors, shapes, sizeValue, setSizeValue, colorValue, setColorValue, shapeValue, setShapeValue } = useProperties();

  // Mouse action handlers
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useLineHandlers(lines, setLines, tool, sizeValue, colorValue);
  const { handleMouseDownShape, handleMouseMoveShape, handleMouseUpShape } = useShapeHandlers(
    squares, setSquares, circles, setCircles, triangles, setTriangles, sizeValue, shapeValue, colorValue);

  // HTML components
  const colorTool = getColorTool(colors, colorValue, setColorValue);
  const shapesTool = getShapesTool(colors, shapes, colorValue, setColorValue, shapeValue, setShapeValue);
  const eraserTool = getEraserTool(clearLines, clearShapes);
  const sizeTool = getSizeTool(sizes, sizeValue, setSizeValue)
  const toolSelector = getToolSelector(tool, setTool);
  const lineRender = getLineRender(lines);
  const { squareRender, circleRender, triangleRender } = getShapeRender(squares, setSquares, circles, setCircles, triangles, setTriangles, tool);

  const { height, width, ref }: { height: number, width: number, ref: any } = useClientSize();

  useEffect(() => {
    socket.removeAllListeners("send_canvas");
    socket.on("send_canvas", ({ receiver }) => {
      const data = { lines, squares, triangles, circles };
      socket.emit("send_canvas", { receiver, data });
    })

    return () => {
      socket.removeAllListeners("send_canvas");
    }
  }, [lines, squares, triangles, circles]);

  return (
    <div className='board_wrapper' ref={ref}>
      <Stage
        width={width} //Should utilize canvasSize
        height={height} //Should utilize canvasSize
        onMouseDown={mode === "line" ? handleMouseDown : handleMouseDownShape}
        onMousemove={mode === "line" ? handleMouseMove : handleMouseMoveShape}
        onMouseup={mode === "line" ? handleMouseUp : handleMouseUpShape}
      >
        <Layer>
          {lineRender}
          {circleRender}
          {squareRender}
          {triangleRender}
        </Layer>
      </Stage>
      <Container fluid className="d-flex px-1" ref={toolRef} >
        {toolSelector}
        {tool === "pen" ? colorTool : (tool === "eraser" ? eraserTool : shapesTool)}
        {sizeTool}
      </Container>
    </div >
  );
};
