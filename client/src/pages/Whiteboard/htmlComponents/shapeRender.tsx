import React from 'react'
import { Circle, RegularPolygon } from 'react-konva';
import socket from "../../helpers/socket";
import { SquareObj, CircleObj, TriangleObj } from '../typeDef/ShapeObj';

const getShapeRender = (squares: SquareObj[], setSquares: React.Dispatch<React.SetStateAction<SquareObj[]>>,
  circles: CircleObj[], setCircles: React.Dispatch<React.SetStateAction<CircleObj[]>>,
  triangles: TriangleObj[], setTriangles: React.Dispatch<React.SetStateAction<TriangleObj[]>>,
  tool: string) => {

  const squareRender = (
    <>
      {squares.map((square: SquareObj, i: number) => (
        <RegularPolygon
          key={i}
          x={square.x}
          y={square.y}
          sides={square.sides}
          radius={square.radius}
          rotation={square.rotationDeg}
          fill={square.fill}
          onClick={(e) => {
            if (tool === "eraser") {
              let del_x = e.target.attrs.x;
              let del_y = e.target.attrs.y;
              setSquares((squares) => {
                let newSquares = [...squares];
                let deleteTargetIndex = squares.findIndex((square) =>
                  square.x === del_x && square.y === del_y
                )
                newSquares.splice(deleteTargetIndex, 1)
                return newSquares;
              })
              socket.emit('delete_shape', { content: { del_x, del_y }, shape: "square" });
            }
          }}
        />
      ))}
    </>
  )

  const circleRender = (
    <>
      {circles.map((circle: CircleObj, i: number) => (
        <Circle
          key={i}
          x={circle.x}
          y={circle.y}
          radius={circle.radius}
          fill={circle.fill}
          onClick={(e) => {
            if (tool === "eraser") {
              let del_x = e.target.attrs.x;
              let del_y = e.target.attrs.y;
              setCircles((circles) => {
                let newCircles = [...circles];
                let deleteTargetIndex = circles.findIndex((circle) =>
                  circle.x === del_x && circle.y === del_y
                )
                newCircles.splice(deleteTargetIndex, 1)
                return newCircles;
              })
              socket.emit('delete_shape', { content: { del_x, del_y }, shape: "circle" });
            }
          }}
        />
      ))}
    </>
  )

  const triangleRender = (
    <>
      {triangles.map((triangle: TriangleObj, i: number) => (
        <RegularPolygon
          key={i}
          x={triangle.x}
          y={triangle.y}
          sides={triangle.sides}
          radius={triangle.radius}
          fill={triangle.fill}
          onClick={(e) => {
            if (tool === "eraser") {
              let del_x = e.target.attrs.x;
              let del_y = e.target.attrs.y;
              setTriangles((triangles) => {
                let newTriangles = [...triangles];
                let deleteTargetIndex = triangles.findIndex((triangle) =>
                  triangle.x === del_x && triangle.y === del_y
                )
                newTriangles.splice(deleteTargetIndex, 1)
                return newTriangles;
              })
              socket.emit('delete_shape', { content: { del_x, del_y }, shape: "triangle" });
            }
          }}
        />
      ))}
    </>
  )
  return { squareRender, circleRender, triangleRender }
}

export default getShapeRender