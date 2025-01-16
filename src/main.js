import { createPinia } from "pinia";
import router from "./router/index";
import "./assets/styles/index.css";

import { createApp } from "vue";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.mount("#app");
