import React from 'react'

// Ensures whiteboard conforms to window on load
// Credit to Bruce Smith, from stackoverflow
// https://stackoverflow.com/questions/58222004/how-to-get-parent-width-height-in-react-using-hooks?fbclid=IwAR2Fa78YadHx8uxGTOwHa-Zb6zF4ONp5rfTlKPq4qtvCjMhDk4M10bEp5Ps
const useClientSize = () => {
  const [dimensions, setDimensions] = React.useState({ height: 0, width: 0 })
  const ref = React.useCallback(node => {
    if (node != null) {
      setDimensions({ height: node.parentNode.offsetHeight, width: node.parentNode.offsetWidth });
    }
  }, []);
  return { height: dimensions.height - 45, width: dimensions.width, ref }
}

export default useClientSize