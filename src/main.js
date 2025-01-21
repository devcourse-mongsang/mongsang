import { createPinia } from "pinia";
import router from "./router/index";
import "./assets/styles/index.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { createApp } from "vue";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
});

app.use(router);
app.use(pinia);
app.use(vuetify);
app.mount("#app");
