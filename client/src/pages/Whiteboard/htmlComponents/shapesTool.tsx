import React from 'react'
import { ButtonGroup, ToggleButton } from 'react-bootstrap'

const getShapesTool = (colors: {
  name: string; value: string; alias: string;
}[], shapes: {
  name: string; value: string;
}[],
  colorValue: string, setColorValue: React.Dispatch<React.SetStateAction<string>>,
  shapeValue: string, setShapeValue: React.Dispatch<React.SetStateAction<string>>) => {
  const shapesTool = (
    <div>
      <ButtonGroup className="ms-3" >
        {colors.map((color, idx) => (
          <ToggleButton
            key={idx}
            id={`color-${idx}`}
            className={`bg-${color.alias} shapesColorTool`}
            type="radio"
            variant="outline-white"
            size="lg"
            name="color"
            value={color.value}
            checked={colorValue === color.value}
            onChange={(e) => setColorValue(e.currentTarget.value)}
          >
          </ToggleButton>
        ))}
      </ButtonGroup>
      <ButtonGroup className="ms-3" >
        {shapes.map((shape, idx) => (
          <ToggleButton
            key={idx}
            id={`shape-${idx}`}
            type="radio"
            variant="outline-dark"
            size="sm"
            name="shape"
            value={shape.value}
            checked={shapeValue === shape.value}
            onChange={(e) => setShapeValue(e.currentTarget.value)}
          >{shape.value}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </div>
  )

  return shapesTool
}

export default getShapesTool