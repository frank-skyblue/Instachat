import { Line } from 'react-konva'
import { LineObj } from '../typeDef/LineObj'

const getLineRender = (lines: LineObj[]) => {
  const lineRender = (
    <>
      {
        lines.map((line: LineObj, i: number) => (
          <Line
            key={i}
            points={line.points}
            stroke={line.strokeColor}
            strokeWidth={line.tool === 'eraser' ? line.strokeSize * 5 : line.strokeSize}
            tension={0.5}
            lineCap="round"
            globalCompositeOperation={
              line.tool === 'eraser' ? 'destination-out' : 'source-over'
            }
          />
        ))
      }
    </>
  )

  return lineRender
}

export default getLineRender