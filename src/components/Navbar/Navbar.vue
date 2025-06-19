<template>
  <nav class="navbar navbar-expand-lg sticky-top shadow">
    <div
      class="container-fluid d-flex justify-content-between align-items-center"
    >
      <!-- Logo + Texto -->
      <router-link class="navbar-brand d-flex align-items-center gap-2" to="/">
        <img
          src="../../assets/logoDevChallenge.svg"
          alt="Logo del proyecto"
          class="logo-navbar"
        />
        <span class="brand-text">
          <span class="brand-dev">DEV</span
          ><span class="brand-challenge">CHALLENGE</span>
        </span>
      </router-link>

      <!-- Botón cerrar sesión -->
      <button class="btn btn-danger btn-sm text-white" @click="cerrarSesion">
        Cerrar sesión
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const usuario = ref(null);
const router = useRouter();
const auth = getAuth();

// // Detectar usuario autenticado
// onMounted(() => {
//   onAuthStateChanged(auth, (user) => {
//     usuario.value = user;
//     console.log("Datos del usuario:", user);
//   });
// });

// Cerrar sesión
const cerrarSesion = async () => {
  try {
    await signOut(auth);
    router.push("/login");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
</script>

<style scoped>
.navbar {
  min-height: 70px;
  background-color: white;
}

.navbar-brand {
  font-weight: bold;
}

.logo-navbar {
  max-height: 32px;
  width: auto;
  object-fit: contain;
}

.brand-text {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  display: flex;
  gap: 0.25rem;
  align-items: baseline;
  text-transform: capitalize;
}

.brand-dev {
  color: var(--color-primary); /* Usa tu variable personalizada */
}

.brand-challenge {
  color: #555; /* Contraste suave */
}

/* Responsive */
@media (max-width: 576px) {
  .brand-text {
    font-size: 1.3rem;
  }
}
</style>
