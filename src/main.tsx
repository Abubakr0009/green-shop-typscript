// src/main.tsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App"; // .jsx emas, TypeScriptda avtomatik .tsx faylni tanlaydi
import { BrowserRouter as Router } from "react-router-dom";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import store from "./redux"; // to'g'ridan-to'g'ri redux/index dan emas, store dan import qilish tavsiya
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Provider store={store}>
        <ConfigProvider>
          <QueryClientProvider client={queryClient}>
            <Router>
              <App />
            </Router>
          </QueryClientProvider>
        </ConfigProvider>
      </Provider>
    </StrictMode>
  );
}
