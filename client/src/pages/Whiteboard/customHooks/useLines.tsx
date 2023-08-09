import React from 'react'
import socket from "../../helpers/socket";
import { LineObj } from '../typeDef/LineObj';

const useLines = () => {
  const [lines, setLines] = React.useState<LineObj[]>([]);

  React.useEffect(() => {
    socket.removeAllListeners('draw_line');
    socket.on('draw_line', ({ content }: any) => {
      setLines(lines => {
        const lineIndex = lines.findIndex(line => line.id === content.id);
        const newLines = lines.map(line => { return { ...line } });
        if (lineIndex < 0) {
          newLines.push(content);
          return newLines;
        } else {
          newLines[lineIndex].points = newLines[lineIndex].points.concat(content.points);
          return newLines;
        }
      });
    });

    socket.removeAllListeners("prev_lines");
    socket.on("prev_lines", ({ prevLines }: any) => {
      setLines(lines => {
        return lines.concat(prevLines);
      });
    })

    socket.removeAllListeners('clear_lines');
    socket.on('clear_lines', () => {
      clearLines();
    });

    return () => {
      socket.removeAllListeners('draw_line');
      socket.removeAllListeners("prev_lines");
      socket.removeAllListeners('clear_lines');
    }
  }, [lines]);


  const clearLines = () => {
    setLines([]);
  }

  return { lines, setLines, clearLines };
}

export default useLines