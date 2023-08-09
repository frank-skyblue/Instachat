import React from 'react'
import socket from "../../helpers/socket";
import { SquareObj, CircleObj, TriangleObj } from "../typeDef/ShapeObj"


const useShapes = () => {
  const [squares, setSquares] = React.useState<SquareObj[]>([]);
  const [circles, setCircles] = React.useState<CircleObj[]>([]);
  const [triangles, setTriangles] = React.useState<TriangleObj[]>([]);

  React.useEffect(() => {
    socket.removeAllListeners('draw_shape');
    socket.on('draw_shape', ({ content, shape }: any) => {
      if (shape === "circle") {
        setCircles(circles => [...circles, content]);
      }
      else if (shape === "square") {
        setSquares(squares => [...squares, content]);
      }
      else {
        setTriangles(triangles => [...triangles, content]);
      }
    });

    socket.removeAllListeners('prev_shapes');
    socket.on('prev_shapes', ({ prevShapes, shape }) => {
      if (shape === "circle") {
        setCircles(circles => [...circles, ...prevShapes]);
      }
      else if (shape === "square") {
        setSquares(squares => [...squares, ...prevShapes]);
      }
      else {
        setTriangles(triangles => [...triangles, ...prevShapes]);
      }
    })

    socket.removeAllListeners('delete_shape');
    socket.on('delete_shape', ({ content, shape }: any) => {
      if (shape === "circle") {
        setCircles((circles) => {
          let newCircles = [...circles];
          let deleteTargetIndex = circles.findIndex((circle) =>
            circle.x === content.del_x && circle.y === content.del_y
          )
          newCircles.splice(deleteTargetIndex, 1)
          return newCircles;
        })
      }
      else if (shape === "square") {
        setSquares((squares) => {
          let newSquares = [...squares];
          let deleteTargetIndex = squares.findIndex((square) =>
            square.x === content.del_x && square.y === content.del_y
          )
          newSquares.splice(deleteTargetIndex, 1)
          return newSquares;
        })
      }
      else {
        setTriangles((triangles) => {
          let newTriangles = [...triangles];
          let deleteTargetIndex = triangles.findIndex((triangle) =>
            triangle.x === content.del_x && triangle.y === content.del_y
          )
          newTriangles.splice(deleteTargetIndex, 1)
          return newTriangles;
        })
      }
    });

    socket.removeAllListeners('clear_shapes');
    socket.on('clear_shapes', () => {
      clearShapes();
    });

    return () => {
      socket.removeAllListeners('draw_shape');
      socket.removeAllListeners('prev_shapes');
      socket.removeAllListeners('delete_shape');
      socket.removeAllListeners('clear_shapes');
    }
  }, [circles, squares, triangles]);

  const clearShapes = () => {
    setCircles([]);
    setSquares([]);
    setTriangles([]);
  }

  return { squares, setSquares, circles, setCircles, triangles, setTriangles, clearShapes };
}

export default useShapes