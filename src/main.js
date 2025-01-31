import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import { VueQueryPlugin } from "@tanstack/vue-query";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

import router from "./router/index";
import App from "./App.vue";
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
app.use(VueQueryPlugin);

app.mount("#app");
