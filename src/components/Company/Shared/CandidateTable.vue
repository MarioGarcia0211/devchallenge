<template>
  <div class="table-responsive">
    <table class="table table-bordered text-center align-middle">
      <thead class="table-light">
        <tr>
          <th>Participante</th>
          <th>Estado</th>
          <th>Contacto</th>
          <th>Ubicación</th>
          <th>Fecha de postulación</th>
          <th>Acciones</th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  postulaciones: Object,
});
</script>

<style scoped>
.table th,
.table td {
  white-space: nowrap;
  vertical-align: middle;
  padding: 1rem 2.1rem;
}

img {
  object-fit: cover;
}

/* Color morado personalizado */
.text-purple {
  color: #6f42c1;
}

.link-personalizado {
  text-decoration: none;
  font-weight: normal;
  color: black;
}

.link-personalizado:hover {
  text-decoration: underline;
}
</style>
