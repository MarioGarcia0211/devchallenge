<template>
  <!-- Login -->
  <div class="container-login">
    <div class="card card-login shadow-lg">
      <div class="card-body card-body-login">
        <!-- Logo -->
        <div class="text-center">
          <img
            src="../assets/logoDevChallenge.svg"
            alt="Logo de la empresa"
            class="img-fluid"
            style="
              max-height: 50px;
              object-fit: contain;
              padding: 0;
              margin: 0 auto 10px auto;
              display: block;
            "
          />
        </div>

        <!-- Titulo -->
        <h1 class="text-center">Iniciar Sesión</h1>

        <form @submit.prevent="login">
          <!-- Correo -->
          <div class="mb-3">
            <label class="form-label">Correo electrónico</label>
            <input type="email" class="form-control" v-model="correo" />
          </div>

          <!-- Contraseña -->
          <div class="mb-3">
            <label class="form-label">Contraseña</label>
            <div class="input-group">
              <input
                :type="mostrarClave ? 'text' : 'password'"
                class="form-control"
                v-model="clave"
              />
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="mostrarClave = !mostrarClave"
                :aria-label="
                  mostrarClave ? 'Ocultar contraseña' : 'Mostrar contraseña'
                "
              >
                <i :class="mostrarClave ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Botón -->
          <div class="d-grid">
            <button type="submit" class="btn btn-primary">
              Iniciar Sesión
            </button>
          </div>
        </form>

        <!-- Enlace a la vista de registro -->
        <p class="mt-3 text-center">
          ¿No tienes cuenta?
          <router-link to="/register">Regístrate aquí</router-link>
        </p>
      </div>
    </div>
  </div>

  <!-- Toast -->
  <Toast ref="toastRef" />
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { iniciarSesion } from "../services/authServices";
import { obtenerTipoUsuario } from "../services/userServices";
import Toast from "../components/Toast/Toast.vue";

const correo = ref("");
const clave = ref("");
const router = useRouter();
const toastRef = ref(null);
const mostrarClave = ref(false);

const login = async () => {
  if (!correo.value || !clave.value) {
    toastRef.value?.mostrarToast("error", "Todos los campos son obligatorios");
    return;
  }

  try {
    const usuario = await iniciarSesion(correo.value, clave.value);
    if (!usuario || !usuario.uid) {
      throw new Error("No se pudo obtener la información del usuario.");
    }
    const tipoUsuario = await obtenerTipoUsuario(usuario.uid);
    if (tipoUsuario === "persona") {
      router.push("/user-profile");
    } else if (tipoUsuario === "empresa") {
      router.push("/company-profile");
    } else {
      console.log("tipo de usuario desconocido");
    }
  } catch (error) {
    toastRef.value?.mostrarToast("error", error);
  }
};
</script>

<style scoped>
.container-login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.card-login {
  width: 100%;
  max-width: 400px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: var(--color-white);
}

.card-body-login {
  padding: 2rem;
}

.card-body-login h1 {
  text-transform: uppercase;
  font-weight: bold;
  font-size: 1.8rem;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  color: var(--color-gray-dark);
}

.input-group {
  border: 1px solid var(--color-gray);
  border-radius: 10px;
  overflow: hidden;
}

.input-group .form-control {
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.input-group .btn {
  border: none;
  background-color: transparent;
  color: var(--color-primary);
  font-size: 1.2rem;
}

.input-group:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 5px var(--color-primary-light);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-group .btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.text-center a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
}

.text-center a:hover {
  text-decoration: underline;
  color: var(--color-primary-dark);
}

@media (max-width: 480px) {
  .card-body-login {
    padding: 1.5rem;
  }

  .btn-primary {
    font-size: 14px;
    padding: 8px;
  }
}
</style>
