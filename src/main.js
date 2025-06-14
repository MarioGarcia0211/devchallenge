import { createApp } from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import './assets/styles/variables.css';
import "./style.css";
import router from "./router";
import App from "./App.vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";


const toastOptions = {
  position: "top-right",
  timeout: 4000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  transition: "Vue-Toastification__bounce",
  icon: true,
  maxToasts: 5,
  newestOnTop: true,
};

const app = createApp(App);

app.use(router);
app.use(Toast, toastOptions);

app.mount("#app");
