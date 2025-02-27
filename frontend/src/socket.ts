import { io } from "socket.io-client";
import { useAuthStore } from "./stores/authStore";

const token = useAuthStore.getState().token;

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  // one can send an auth token in the query if needed:
  query: { token },
});

export default socket;
