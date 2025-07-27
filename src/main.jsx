import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/customSelect.css";
import "./styles/toggleListen.css";
import "./styles/joyride.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { register, registerServiceWorker } from "./services/serviceWorkerRegistration";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Router>
);

// registerServiceWorker();
// register();
