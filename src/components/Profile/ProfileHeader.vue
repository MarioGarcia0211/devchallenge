<template>
  <div class="card shadow rounded overflow-hidden">
    <!-- Encabezado con degradado -->
    <div class="card-header-gradient"></div>

    <!-- Cuerpo de la tarjeta -->
    <div class="card-body">
      <div class="row g-3 align-items-center text-center text-md-start">
        <!-- Imagen -->
        <div class="col-12 col-md-2 d-flex justify-content-center">
          <div class="avatar-border position-relative">
            <div class="avatar-inner">
              <img
                :src="imagenPerfil"
                alt="Foto de perfil"
                class="avatar-img"
                loading="lazy"
              />
            </div>

            <!-- Ícono editable -->
            <button
              class="edit-icon-btn"
              @click="$emit('editar-foto', perfil)"
              title="Editar imagen"
            >
              <i class="bi bi-pencil-fill"></i>
            </button>
          </div>
        </div>

        <!-- Contenido dinámico -->
        <div
          class="col-12 col-md-10 d-flex flex-column align-items-center align-items-md-start text-center text-md-start mx-auto"
        >
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
            class="w-100 d-flex flex-wrap justify-content-center justify-content-md-end gap-2"
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
  height: 50px;
  margin: -1.5rem -1.5rem 0 -1.5rem;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
  background: linear-gradient(90deg, #8b5cf6, #3b82f6, #06b6d4);
  box-shadow: inset 0 -1px 2px rgba(255, 255, 255, 0.2);
}

.avatar-border {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-dark)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  position: relative;
}

.avatar-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: white;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
}

.avatar-border:hover .avatar-inner {
  transform: scale(1.05);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* Botón de edición */
.edit-icon-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: white;
  border: 2px solid var(--color-primary);
  color: var(--color-primary-dark);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.edit-icon-btn:hover {
  background-color: var(--color-primary);
  color: white;
  transform: scale(1.08);
}

/* Íconos generales */
.icon {
  color: var(--color-primary-dark);
  font-size: 1.1rem;
}

.custom-badge {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
  padding: 0.35em 0.7em;
  font-size: 0.75rem;
  border-radius: 12px;
  font-weight: 500;
}

h4 {
  font-weight: 700;
  color: var(--color-primary-dark);
}

.text-muted {
  font-size: 0.9rem;
  color: var(--color-gray-dark) !important;
}

/* Botones personalizados */
.custom-btn {
  background-color: white;
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
  transition: all 0.3s ease;
  font-weight: 500;
  padding: 0.4rem 1rem;
  border-radius: 999px;
}

.custom-btn:hover {
  background-color: var(--color-primary);
  color: white;
  text-decoration: none;
}

/* Responsive mejoras */
@media (max-width: 576px) {
  .avatar-border {
    width: 100px;
    height: 100px;
  }

  .edit-icon-btn {
    width: 30px;
    height: 30px;
    font-size: 0.85rem;
  }

  h4 {
    font-size: 1.1rem;
  }

  .custom-btn {
    width: 100%;
  }
}
</style>
