<template>
  <div class="card shadow rounded overflow-hidden">
    <!-- Encabezado con degradado -->
    <div class="card-header-gradient"></div>

    <!-- Cuerpo de la tarjeta -->
    <div class="card-body">
      <div class="row g-3 align-items-center text-center text-md-start">
        <!-- Imagen -->
        <div class="col-12 col-md-2 d-flex justify-content-center">
          <div class="image-wrapper">
            <img
              :src="imagenPerfil"
              alt="Foto de perfil"
              class="profile-photo"
            />
          </div>
        </div>

        <!-- Contenido dinámico -->
        <div class="col-12 col-md-10">
          <h4 class="fs-4 mb-1">{{ titulo }}</h4>
          <p class="text-muted mb-2">{{ subtitulo }}</p>

          <!-- Datos adicionales -->
          <div
            class="d-flex flex-column flex-sm-row flex-wrap align-items-center align-items-sm-start justify-content-center justify-content-sm-start text-muted mb-3 gap-3"
          >
            <!-- Tipo de usuario o empresa -->
            <template v-if="tipo === 'persona'">
              <div class="d-flex align-items-center gap-2 flex-wrap">
                <i class="bi bi-building-fill-gear icon"></i>
                <span
                  v-for="(pref, index) in perfil.preferenciasTrabajo"
                  :key="index"
                  class="badge custom-badge"
                >
                  {{ pref }}
                </span>
              </div>
            </template>

            <template v-else>
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-building-fill-gear icon"></i>
                <span>{{ perfil.tipoEmpresa }}</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-bag-dash-fill icon"></i>
                <span>{{ perfil.industria }}</span>
              </div>
            </template>

            <!-- Ciudad -->
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-geo-alt-fill icon"></i>
              <span>{{ perfil.ciudad }}</span>
            </div>
          </div>

          <!-- Botones solo si es persona -->
          <div
            v-if="tipo === 'persona'"
            class="d-flex flex-wrap justify-content-center justify-content-md-end gap-2"
          >
            <router-link to="/challenge" class="btn custom-btn btn-sm">
              <i class="bi bi-trophy me-1"></i>
              Retos Disponibles
            </router-link>
            <router-link to="/vacant" class="btn custom-btn btn-sm">
              <i class="bi bi-briefcase me-1"></i>
              Ver Vacantes
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import defaultProfile from "../../assets/logoDevChallenge.svg";

const props = defineProps({
  perfil: Object,
  tipo: String, // "persona" o "empresa"
});

// Imagen dinámica con fallback
const imagenPerfil = computed(() => {
  const imagen =
    props.tipo === "persona" ? props.perfil.fotoPerfil : props.perfil.logo;

  return imagen && imagen.trim() !== "" ? imagen : defaultProfile;
});

// Título
const titulo = computed(() =>
  props.tipo === "persona"
    ? `${props.perfil.nombres} ${props.perfil.apellidos}`
    : props.perfil.nombreEmpresa
);

// Subtítulo
const subtitulo = computed(() => {
  if (props.tipo === "persona") {
    const mapa = {
      "Cédula de Ciudadanía": "CC",
      "Tarjeta de Identidad": "TI",
      "Tarjeta de Extranjería": "TE",
      Pasaporte: "PAS",
    };
    const abreviado = mapa[props.perfil.tipoDocumento] || "";
    return `${abreviado} ${props.perfil.numeroDocumento}`;
  } else {
    return `NIT ${props.perfil.nit}`;
  }
});
</script>

<style scoped>
.card-header-gradient {
  height: 40px;
  margin: 0 -1.5rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background: linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6);
}

.image-wrapper {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border: 3px solid white;
  background-color: #f8fafc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.icon {
  color: var(--color-primary);
  font-size: 1.1rem;
}

.custom-btn {
  background-color: white;
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
  transition: all 0.3s ease;
}

.custom-btn:hover {
  background-color: var(--color-primary);
  color: white;
  text-decoration: none;
}
</style>
