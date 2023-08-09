import React from 'react'

const useTools = (setMode: React.Dispatch<React.SetStateAction<string>>) => {

  const [tool, setTool] = React.useState('pen');
  const toolRef = React.useCallback(node => {
    if (node != null) {
      if (tool === "pen") {
        setMode("line");
        node.parentNode.classList.add("pencil-cursor");
        node.parentNode.classList.remove("eraser-cursor");
      }
      else if (tool === "shapes") {
        setMode("shape");
        node.parentNode.classList.add("pencil-cursor");
        node.parentNode.classList.remove("eraser-cursor");
      }
      else {
        setMode("line");
        node.parentNode.classList.add("eraser-cursor");
        node.parentNode.classList.remove("pencil-cursor");
      }
    }
  }, [tool])

  return { tool, setTool, toolRef };
}

export default useTools