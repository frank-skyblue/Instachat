import React from 'react'
import socket from "../../helpers/socket";
import { LineObj } from "../typeDef/LineObj"

const useLineHandlers = (lines: LineObj[], setLines: React.Dispatch<React.SetStateAction<LineObj[]>>,
  tool: string, sizeValue: string, colorValue: string) => {
  const [currLine, setCurrline] = React.useState(-1);
  const isDrawing = React.useRef(false);

  // The basics of these handlers were taken from Konva
  // https://konvajs.org/docs/react/Free_Drawing.html
  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const lineId = socket.id + Date.now();
    const line = { id: lineId, tool, points: [pos.x, pos.y], strokeSize: Number.parseInt(sizeValue), strokeColor: colorValue };
    setLines(lines => [...lines, line]);
    socket.emit('draw_line', { content: line });
    setCurrline(lines.length);
  };

  const handleMouseMove = (e: any) => {
    // no drawing - skipping
    if (!isDrawing.current || currLine < 0) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    setLines(lines => {
      const newLines = lines.map(line => { return { ...line } });
      let lastLine = newLines[currLine];
      // add point
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      socket.emit('draw_line', { content: { id: lastLine.id, tool, points: [point.x, point.y], strokeSize: Number.parseInt(sizeValue), strokeColor: colorValue } })

      // replace last
      newLines.splice(currLine, 1, lastLine);
      return newLines;
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    setCurrline(-1);
  };

  return { handleMouseDown, handleMouseMove, handleMouseUp };
}

export default useLineHandlers