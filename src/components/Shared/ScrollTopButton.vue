<template>
  <button
    v-show="showScrollTop"
    class="btn-scroll-top"
    @click="scrollToTop"
    title="Volver arriba"
  >
    <i class="bi bi-arrow-up"></i>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const showScrollTop = ref(false);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.btn-scroll-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 50%;
  padding: 0.75rem 1rem;
  font-size: 1.25rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease;
}

.btn-scroll-top:hover {
  background-color: var(--color-primary-dark);
}
</style>
