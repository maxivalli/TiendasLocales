import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { App } from "./App.jsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { registerSW } from "virtual:pwa-register";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain="dev-o1hla43pri3h7cvl.us.auth0.com"
    clientId="sQO7mPVWHtDSBUpFtajxUHKQrSQ0y9Q9"
    authorizationParams={{
      redirect_uri: "https://tiendaslocales.com.ar/",
    }}
  >
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </Auth0Provider>
);

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Hay una actualización. ¿Deseas actualizar?")) {
      updateSW();
    }
  },
});
