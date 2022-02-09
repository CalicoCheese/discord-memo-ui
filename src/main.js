import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "vue-loading-overlay/dist/vue-loading.css";
import "./index.sass";

createApp(App).use(router).mount("#app");
