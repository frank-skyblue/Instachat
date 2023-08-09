import session from "express-session";
import { Server, Socket } from "socket.io";
import { CanvasData } from "types/canvas.types";

class CustomSocket extends Socket {
  currRoom: string = "";
}

const initSocket = (server: any, sessionHandler: any) => {
  const io = new Server(undefined, {
    cors: {
      origin: process.env.NODE_ENV === "production" ? [process.env.REACT_FRONTEND_URL!, process.env.REACT_FRONTEND_URL_WWW!] : "http://localhost:3000",
      credentials: true,
    },
  });

  io.listen(server);

  io.use((socket, next) => {
    sessionHandler(socket.request, {}, next);
  });
  
  io.on("connection", (tempSocket: Socket) => {
    const socket = tempSocket as CustomSocket;

    if (!(socket.request as any).session.user) {
      socket.disconnect();
    }

    socket.on("draw_line", (data: any) => {
      socket.to(socket.currRoom).emit("draw_line", data);
    });

    socket.on("draw_shape", (data: any) => {
      socket.to(socket.currRoom).emit("draw_shape", data);
    });

    socket.on("delete_shape", (data: any) => {
      socket.to(socket.currRoom).emit("delete_shape", data);
    });

    socket.on("clear_lines", () => {
      socket.to(socket.currRoom).emit("clear_lines", null);
    });

    socket.on("clear_shapes", () => {
      socket.to(socket.currRoom).emit("clear_shapes", null);
    });

    socket.on("start_room", () => {
      const roomId = socketRoomId(socket);
      if (socket.rooms.size <= 1) {
        socket.join(roomId);
        socket.currRoom = roomId;
        io.to(socket.id).emit("room_started", { roomId });
      } else {
        io.to(socket.id).emit("already_in_room");
      }
    });

    socket.on("join_room", async ({ room }) => {
      if (socket.rooms.size > 1) {
        io.to(socket.id).emit("already_in_room");
      } else if (!io.sockets.adapter.rooms.has(room)) {
        io.to(socket.id).emit("no_room");
      } else {
        socket.join(room);
        socket.currRoom = room;

        io.to(socket.id).emit("room_joined");
        socket.to(socket.currRoom).emit("new_caller", { callerId: createPeerId(socket) });
        
        // So the person who just joined can have the previous state of the canvas
        const roomOwner = getOwner(room);
        io.to(roomOwner).emit("send_canvas", { receiver: socket.id });
      }
    });

    socket.on("send_canvas", ({ receiver, data }: { receiver: string, data: CanvasData }) => {
      const { lines, squares, triangles, circles } = data;
      io.to(receiver).emit("prev_lines", { prevLines: lines });
      io.to(receiver).emit("prev_shapes", { prevShapes: squares, shape: "square" });
      io.to(receiver).emit("prev_shapes", { prevShapes: circles, shape: "circle" });
      io.to(receiver).emit("prev_shapes", { prevShapes: triangles, shape: "triangle" });
    });

    socket.on("leave_room", () => {
      leaveRoom(socket);
    });

    socket.on("disconnect", () => {
      if (socket.currRoom) {
        leaveRoom(socket);
      }
    });
  });
}

const leaveRoom = (socket: CustomSocket) => {
  socket.leave(socket.currRoom);
  if (socket.currRoom === socketRoomId(socket)) {
    // If the owner left, kick everyone out
    socket.to(socket.currRoom).emit("room_ended");
  } else {
    socket.to(socket.currRoom).emit("room_left", { callerId: createPeerId(socket) });
  }
  socket.currRoom = "";
}

const ROOM_ID_PREFIX = "room.";

const socketRoomId = (socket: Socket) => {
  return ROOM_ID_PREFIX + socket.id;
}

const getOwner = (roomId: string) => {
  return roomId.slice(ROOM_ID_PREFIX.length);
}

export const createPeerId = (socket: Socket) => {
  return 'a' + socket.id + 'b'
}

export default initSocket;
