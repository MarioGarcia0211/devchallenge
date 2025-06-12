<template>
  <router-view />
</template>

<script>
export default {
  watch: {
    $route(to) {
      this.setBodyClass(to.path);
    },
  },
  mounted() {
    this.setBodyClass(this.$route.path);
  },
  methods: {
    setBodyClass(path) {
      document.body.className = "";

      if (path === "/login" || path === "/register") {
        document.body.classList.add("bg-login");
      } else if (path === "/") {
        document.body.classList.add("bg-default");
      } else {
        document.body.classList.add("bg-default");
      }
    },
  },
};
</script>
