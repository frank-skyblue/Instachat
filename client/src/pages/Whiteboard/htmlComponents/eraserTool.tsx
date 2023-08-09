import React from 'react'
import { Button } from 'react-bootstrap';
import socket from "../../helpers/socket";


const getEraserTool = (clearLines: () => void, clearShapes: () => void) => {

  const clearAll = () => {
    clearLines();
    clearShapes();
    socket.emit('clear_lines', null);
    socket.emit('clear_shapes', null);
  }
  const eraserTool = (<Button variant="outline-light" className='clear ms-auto' onClick={clearAll}></Button>);


  return eraserTool
}

export default getEraserTool