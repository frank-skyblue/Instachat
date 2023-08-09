import { io } from "socket.io-client";

const uri = process.env.NODE_ENV === "production" ? process.env.REACT_APP_SOCKET_URL_PROD : process.env.REACT_APP_SOCKET_URL;

const socket = io(uri!, { autoConnect: false });
export default socket;

export const connectSocket = async () => {
  try {
    socket.io.opts.withCredentials = true;
    socket.connect();
  } catch (e) {
  }
}
