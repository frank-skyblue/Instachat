interface LineObj {
  id: string,
  tool: string,
  points: number[],
  strokeSize: number,
  strokeColor: string,
}

interface SquareObj {
  id: string,
  x: number,
  y: number,
  sides: 4,
  radius: number,
  fill: string,
  rotationDeg: 45,
}

interface CircleObj {
  id: string,
  x: number,
  y: number,
  radius: number,
  fill: string,
}

interface TriangleObj {
  id: string,
  x: number,
  y: number,
  sides: 3,
  radius: number,
  fill: string,
}

interface CanvasData {
  lines: LineObj[],
  squares: SquareObj[],
  circles: CircleObj[],
  triangles: TriangleObj[],
}

export type { CanvasData }