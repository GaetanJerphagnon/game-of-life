import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";

import tooltip from "./directives/tooltip.js";
import "@/assets/tooltip.css";

createApp(App)
  .use(router)
  .use(store)
  .directive("tooltip", tooltip)
  .mount("#app");
