import { createApp } from "vue";
import "./style.css";
import router from "./router";
import App from "./App.vue";

// Estilos y scripts de Bootstrap
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

// Importación del toast
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Configuración opcional del toast
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

// Registro del router y del toast
app.use(router);
app.use(Toast, toastOptions);

// Montaje de la app
app.mount("#app");
