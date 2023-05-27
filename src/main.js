import { createApp } from "vue";
import { createPinia } from "pinia";
import { createAuth0 } from "@auth0/auth0-vue";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

const production = true;

app.use(createPinia());
app.use(router);
app.use(
  createAuth0({
    domain: "dev-50f4e6m1x3lgsmgu.us.auth0.com",
    clientId: "pLjAz4iRagIEUEN8pnWrAah8MLiA7cMt",
    authorizationParams: {
      redirect_uri: production
        ? "https://homemadeticketseller.me/callback"
        : "http://localhost:5173/callback",
      audience: "https://stefanocando.me/",
      scope: "openid profile email",
    },
    // audience: import.meta.env.VITE_API_AUDIENCE,
    // scope: 'openid profile email'
  })
);
app.mount("#app");
