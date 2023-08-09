import React from 'react'

const getToolSelector = (tool: string, setTool: React.Dispatch<React.SetStateAction<string>>) => {
  return (<select
    className='btn border btn-sm'
    value={tool}
    onChange={(e) => {
      setTool(e.target.value);
    }}
  >
    <option value="pen">Pencil</option>
    <option value="eraser">Eraser</option>
    <option value="shapes">Shape</option>
  </select>)
}

export default getToolSelector