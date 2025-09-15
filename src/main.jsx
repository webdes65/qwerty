import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import store from "./redux_toolkit/store";
import App from "./App";
import "./index.css";
import "./styles/customSelect.css";
import "./styles/toggleListen.css";
import "./styles/joyride.css";
import { MqttProvider } from "./context/MqttProvider.jsx";

const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args.join(" ");
  if (
    message.includes("React Router Future Flag Warning") ||
    message.includes("v7_startTransition") ||
    message.includes("v7_relativeSplatPath") ||
    message.includes("Layout was forced")
  ) {
    return;
  }
  originalWarn(...args);
};

const originalError = console.error;
console.error = (...args) => {
  const message = args.join(" ");
  if (
    message.includes("Source map error") ||
    message.includes("JSON.parse: unexpected character")
  ) {
    return;
  }
  originalError(...args);
};

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Router>
        <MqttProvider>
          <App />
        </MqttProvider>
      </Router>
    </QueryClientProvider>
  </Provider>,
);
