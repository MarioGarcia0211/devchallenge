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
              <strong>Sitio web: </strong>
              <a
                v-if="perfil.paginaWeb"
                :href="
                  perfil.paginaWeb.startsWith('http')
                    ? perfil.paginaWeb
                    : 'https://' + perfil.paginaWeb
                "
                class="custom-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ perfil.paginaWeb }}
              </a>
              <span v-else>No disponible</span>
            </p>
          </template>

          <!-- Contacto -->
          <h6 class="section-title mt-4">CONTACTOS</h6>
          <p class="mb-2">
            <strong>Teléfono: </strong>
            <a
              v-if="perfil.whatsapp"
              :href="'https://wa.me/' + perfil.whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              class="custom-link"
            >
              {{ perfil.whatsapp }}
            </a>
            <span v-else>No disponible</span>
          </p>
          <p class="mb-0">
            <strong>Correo: </strong>
            <a
              v-if="perfil.correo"
              :href="'mailto:' + perfil.correo"
              class="custom-link"
            >
              {{ perfil.correo }}
            </a>
            <span v-else>No disponible</span>
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
.custom-card {
  border: 1px solid var(--color-gray-light);
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease;
}
.section-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-primary-dark);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
  border-left: 3px solid var(--color-primary);
  padding-left: 0.5rem;
}

p {
  font-size: 0.9rem;
  color: var(--color-gray-dark);
}

.custom-badge {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.4em 0.8em;
  border-radius: 999px;
}

.badge + .badge {
  margin-left: 0.25rem;
}

.card-body {
  padding: 1rem 1.25rem;
}

.custom-link {
  color: var(--color-dark);
  text-decoration: none;
  transition: color 0.2s ease;
  word-break: break-all;
}

.custom-link:hover {
  color: var(--color-primary);
  text-decoration: underline;
}
</style>
