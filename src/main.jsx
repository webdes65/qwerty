import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import store from "./redux_toolkit/store";
import App from "./App";
import { MqttProvider } from "./context/MqttProvider.jsx";
import "./index.css";
import "@styles/customSelectStyles.css";
import "@styles/toggleListenStyles.css";
import "@styles/joyrideStyles.css";
import "@styles/antdStyles.css";

const nativeConsole = console;

const originalWarn = nativeConsole.warn;
nativeConsole.warn = (...args) => {
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

const originalError = nativeConsole.error;
nativeConsole.error = (...args) => {
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
