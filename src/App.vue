<template>
  <div v-if="loadingApp" class="loading-overlay">
    <div class="spinner-border text-primary" role="status"></div>
  </div>

  <router-view v-else />
</template>

<script>
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config"; // Ajusta la ruta si es diferente

export default {
  data() {
    return {
      loadingApp: true,
    };
  },
  watch: {
    $route(to) {
      this.setBodyClass(to.path);
    },
  },
  mounted() {
    this.setBodyClass(this.$route.path);
    this.inicializarApp();
  },
  methods: {
    setBodyClass(path) {
      document.body.className = "";

      if (path === "/login" || path === "/register") {
        document.body.classList.add("bg-login");
      } else {
        document.body.classList.add("bg-default");
      }
    },

    async inicializarApp() {
      return new Promise((resolve) => {
        // Espera a que Firebase detecte si hay usuario autenticado
        onAuthStateChanged(auth, (user) => {
          // Puedes hacer algo con el usuario si lo necesitas
          this.loadingApp = false;
          resolve();
        });
      });
    },
  },
};
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
