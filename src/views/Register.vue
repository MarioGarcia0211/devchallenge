<template>
  <div class="container-register">
    <div class="card card-register shadow-lg">
      <div class="card-body card-body-register">
        <!-- Logo -->
        <div class="text-center">
          <img
            src="../assets/logo.png"
            alt="Logo de la empresa"
            class="img-fluid"
            style="
              max-height: 60px;
              object-fit: contain;
              padding: 0;
              margin: 0 auto 10px auto;
              display: block;
            "
          />
        </div>
        <!-- Titulo -->
        <h1 class="text-center mb-4">Registrarse</h1>

        <!-- Paso 1: Selección de tipo de usuario -->
        <Step1UserType
          v-if="pasoActual === 1"
          @seleccionar-tipo="manejarSeleccionTipoUsuario"
        />

        <!-- PASOS PARA Persona -->
        <PersonStep2BasicData
          v-if="tipoUsuario === 'persona' && pasoActual === 2"
          v-model="datosPersona"
          @siguiente="siguientePaso"
          @anterior="pasoActual--"
        />

        <PersonStep3Technologies
          v-if="tipoUsuario === 'persona' && pasoActual === 3"
          v-model="datosPersona"
          @siguiente="siguientePaso"
          @anterior="pasoActual--"
        />

        <PersonStep4Contact
          v-if="tipoUsuario === 'persona' && pasoActual === 4"
          v-model="datosPersona"
          @enviar="registrarPersona"
          @anterior="pasoActual--"
        />

        <p class="mt-3 text-center">
          ¿Ya tienes una cuenta?
          <router-link to="/login">Inicia sesión</router-link>
        </p>
      </div>
    </div>
  </div>
  <!-- Toast -->
  <Toast ref="toastRef" />
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { registrarUsuario } from "../services/authServices";
import Toast from "../components/Toast/Toast.vue";
import Step1UserType from "../components/Register.vue/Step1UserType.vue";
import PersonStep2BasicData from "../components/Register.vue/PersonStep2BasicData.vue";
import PersonStep3Technologies from "../components/Register.vue/PersonStep3Technologies.vue";
import PersonStep4Contact from "../components/Register.vue/PersonStep4Contact.vue";

const router = useRouter();
const pasoActual = ref(1);
const tipoUsuario = ref("");
const toastRef = ref(null);

// Datos de Persona
const datosPersona = reactive({
  tipoUsuario: "",
  nombres: "",
  apellidos: "",
  tipoDocumento: "",
  numeroDocumento: "",
  fotoPerfil: "",
  ciudad: "",
  pais: "",
  descripcion: "",
  tecnologias: [],
  habilidades: [],
  recursos: [],
  preferenciasTrabajo: [],
  hojaDeVida: "",
  whatsapp: "",
  correo: "",
  contrasena: "",
});

// Datos de Empresa
const datosEmpresa = reactive({
  tipoUsuario: "",
  tipoEmpresa: "",
  nombreEmpresa: "",
  nit: "",
  ciudad: "",
  pais: "",
  industria: "",
  otraIndustria: "",
  logo: "",
  paginaWeb: "",
  descripcion: "",
  contacto: "",
  whatsapp: "",
  correo: "",
  contrasena: "",
});

const manejarSeleccionTipoUsuario = ({ tipo, tipoEmpresa }) => {
  tipoUsuario.value = tipo;
  pasoActual.value = 2;

  if (tipo === "persona") {
    datosPersona.tipoUsuario = tipo;
  } else if (tipo === "empresa") {
    datosEmpresa.tipoUsuario = tipo;
    datosEmpresa.tipoEmpresa = tipoEmpresa || "";
  }
};

const siguientePaso = () => {
  pasoActual.value++;
};

const registrarPersona = async () => {
  try {
    const datos = { ...datosPersona };
    await registrarUsuario(datos.correo, datos.contrasena, "persona", datos);
    toastRef.value?.mostrarToast("success", "Registro exitoso");
    router.push("/login");
  } catch (error) {
    console.error("Error al registrar persona:", error);
  }
};

const registrarEmpresa = async () => {
  try {
    const datos = { ...datosEmpresa };

    await registrarUsuario(datos.correo, datos.contrasena, "empresa", datos);
    toastRef.value?.mostrarToast("success", "Registro exitoso");
    router.push("/login");
  } catch (error) {
    console.error("Error al registrar empresa:", error);
  }
};
</script>

<style scoped>
.container-register {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.card-register {
  width: 100%;
  max-width: 900px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: var(--color-white);
}

.card-body-register {
  padding: 2rem;
}

.card-body-register h1 {
  text-transform: uppercase;
  font-weight: bold;
  font-size: 1.8rem;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  color: var(--color-gray-dark);
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
</style>
