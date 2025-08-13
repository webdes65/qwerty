import Echo from "laravel-echo";
import Pusher from "pusher-js";
import Cookies from "universal-cookie";

window.Pusher = Pusher;
const cookies = new Cookies();
const token = cookies.get("bms_access_token");

const echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_KEY,
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  wsHost: import.meta.env.VITE_ECHO_HOST,
  wsPort: 443,
  // wssPort: 443,
  forceTLS: true,
  // enabledTransports: ["ws", "ws"],
  enabledTransports: "ws",
  authEndpoint: import.meta.env.VITE_ECHO_AUTH_ENDPOINT,
  auth: {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
});

export default echo;
