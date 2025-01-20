import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import router from "./router/index";
import App from "./App.vue";

import "vuetify/styles";
import "./assets/styles/index.css";

const vuetify = createVuetify({
  components,
  directives,
});

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(vuetify);

app.mount("#app");
