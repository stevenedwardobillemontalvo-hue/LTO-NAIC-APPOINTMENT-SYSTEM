import { io } from "socket.io-client";

export const socket = io("https://lto-naic-appointment-server.onrender.com", {
  transports: ["websocket"],
});
