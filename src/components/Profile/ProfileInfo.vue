<!-- components/ProfileInfo.vue -->
<template>
  <div class="row g-4">
    <div class="col-md-4">
      <!-- Información -->
      <div class="card custom-card mb-3">
        <div class="card-body">
          <h6 class="section-title">INFORMACIÓN</h6>
          <p class="mb-2">
            <!-- <i class="bi bi-flag-fill me-2 icon"></i> -->
            <strong>País:</strong> {{ perfil.pais || "No especificado" }}
          </p>

          <!-- Persona: habilidades y tecnologías -->
          <template v-if="tipo === 'persona'">
            <p class="mb-2">
              <!-- <i class="bi bi-lightbulb me-2 icon"></i> -->
              <strong>Habilidades:</strong>
              <span v-if="perfil.habilidades?.length" class="d-block mt-1">
                <span
                  v-for="(h, i) in perfil.habilidades"
                  :key="'hab-' + i"
                  class="badge rounded-pill custom-badge me-1 mb-1"
                >
                  {{ h }}
                </span>
              </span>
              <span v-else>No especificado</span>
            </p>

            <p class="mb-2">
              <!-- <i class="bi bi-code-slash me-2 icon"></i> -->
              <strong>Programación:</strong>
              <span v-if="perfil.tecnologias?.length" class="d-block mt-1">
                <span
                  v-for="(tec, i) in perfil.tecnologias"
                  :key="'tec-' + i"
                  class="badge rounded-pill custom-badge me-1 mb-1"
                >
                  {{ tec }}
                </span>
              </span>
              <span v-else>No especificado</span>
            </p>
          </template>

          <!-- Empresa: sitio web -->
          <template v-else>
            <p class="mb-2">
              <!-- <i class="bi bi-globe2 me-2 icon"></i> -->
              <strong>Sitio web:</strong>
              {{ perfil.paginaWeb || "No disponible" }}
            </p>
          </template>

          <!-- Contacto -->
          <h6 class="section-title mt-4">CONTACTOS</h6>
          <p class="mb-2">
            <!-- <i class="bi bi-telephone-fill me-2 icon"></i> -->
            <strong>Teléfono:</strong> {{ perfil.whatsapp || "No disponible" }}
          </p>
          <p class="mb-0">
            <!-- <i class="bi bi-envelope-fill me-2 icon"></i> -->
            <strong>Correo:</strong> {{ perfil.correo || "No disponible" }}
          </p>
        </div>
      </div>

      <!-- Descripción -->
      <div class="card custom-card">
        <div class="card-body">
          <h6 class="section-title">DESCRIPCIÓN</h6>
          <p class="mb-0">
            {{ perfil.descripcion || "Sin descripción proporcionada." }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  perfil: Object,
  tipo: String, // "persona" o "empresa"
});
</script>

<style scoped>
/* strong {
  color: #8b5cf6;
} */
.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}
.icon {
  color: var(--color-primary);
  font-size: 1.1rem;
}
</style>
