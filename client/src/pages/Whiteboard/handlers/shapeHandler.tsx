import React from 'react'
import socket from "../../helpers/socket";
import { CircleObj, SquareObj, TriangleObj } from '../typeDef/ShapeObj';

const useShapeHandlers = (squares: SquareObj[], setSquares: React.Dispatch<React.SetStateAction<SquareObj[]>>,
  circles: CircleObj[], setCircles: React.Dispatch<React.SetStateAction<CircleObj[]>>,
  triangles: TriangleObj[], setTriangles: React.Dispatch<React.SetStateAction<TriangleObj[]>>,
  sizeValue: string, shapeValue: string, colorValue: string) => {
  const isDrawingShapes = React.useRef(false);

  const handleMouseDownShape = (e: any) => {
    isDrawingShapes.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const shapeId = socket.id + Date.now();
    if (shapeValue === "circle") {
      const circle: CircleObj = { id: shapeId, x: pos.x, y: pos.y, fill: colorValue, radius: (Number.parseInt(sizeValue) + 10) * 2 };
      setCircles(circles => [...circles, circle]);
      socket.emit('draw_shape', { content: circle, shape: "circle" });
    }
    else if (shapeValue === "square") {
      const square: SquareObj = { id: shapeId, x: pos.x, y: pos.y, sides: 4, rotationDeg: 45, fill: colorValue, radius: (Number.parseInt(sizeValue) + 10) * 2 };
      setSquares(squares => [...squares, square])
      socket.emit('draw_shape', { content: square, shape: "square" });
    }
    else {
      const triangle: TriangleObj = { id: shapeId, x: pos.x, y: pos.y, sides: 3, fill: colorValue, radius: (Number.parseInt(sizeValue) + 10) * 2 }
      setTriangles(triangles => [...triangles, triangle])
      socket.emit('draw_shape', { content: triangle, shape: "triangle" });
    }
  };

  // Do nothing function
  const handleMouseMoveShape = (e: any) => {
    if (!isDrawingShapes.current)
      return;
  };

  // Do nothing function
  const handleMouseUpShape = () => {
    isDrawingShapes.current = false;
  };

  return { handleMouseDownShape, handleMouseMoveShape, handleMouseUpShape }
}

export default useShapeHandlers


