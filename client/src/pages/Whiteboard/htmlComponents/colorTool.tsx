import React from 'react'
import { ButtonGroup, ToggleButton } from 'react-bootstrap';

const getColorTool = (colors: {
  name: string; value: string; alias: string;
}[], colorValue: string, setColorValue: React.Dispatch<React.SetStateAction<string>>) => {
  const colorTool = (<ButtonGroup className="ms-3" >
    {colors.map((color, idx) => (
      <ToggleButton
        key={idx}
        id={`color-${idx}`}
        className={`bg-${color.alias}`}
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
  </ButtonGroup>);

  return colorTool
}

export default getColorTool