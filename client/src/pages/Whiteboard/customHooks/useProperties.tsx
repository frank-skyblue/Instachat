import React from 'react'

const useProperties = () => {
  const [sizeValue, setSizeValue] = React.useState('1');
  const sizes = [
    { name: 'Small', value: '1' },
    { name: 'Medium', value: '5' },
    { name: 'Large', value: '20' },
  ];

  // Color selection
  const [colorValue, setColorValue] = React.useState('#212529');
  const colors = [
    { name: 'black', value: '#212529', alias: "dark" },
    { name: 'red', value: '#dc3545', alias: "danger" },
    { name: 'blue', value: '#0d6efd', alias: "primary" },
    { name: 'yellow', value: '#ffc107', alias: "warning" },
  ];

  // Shapes selection
  const [shapeValue, setShapeValue] = React.useState('square');
  const shapes = [
    { name: 'square', value: 'square' },
    { name: 'circle', value: 'circle' },
    { name: 'triangle', value: 'triangle' },
  ];

  return { sizes, colors, shapes, sizeValue, setSizeValue, colorValue, setColorValue, shapeValue, setShapeValue }
}

export default useProperties