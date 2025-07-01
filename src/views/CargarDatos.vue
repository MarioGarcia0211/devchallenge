<!-- src/views/CargarRetos.vue -->
<template>
  <div class="container py-4">
    <h2>Cargar Retos</h2>
    <button class="btn btn-primary" @click="subirRetos">Subir retos</button>
  </div>
</template>

<script>
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export default {
  name: "CargarRetos",
  methods: {
    obtenerElementosAleatorios(array, cantidad) {
      const copia = [...array];
      const resultado = [];

      for (let i = 0; i < cantidad && copia.length > 0; i++) {
        const index = Math.floor(Math.random() * copia.length);
        resultado.push(copia.splice(index, 1)[0]);
      }

      return resultado;
    },

    async subirRetos() {
      const retosRef = collection(db, "retos");

      const tecnologiasDisponibles = [
        "React",
        "Vue.js",
        "Angular",
        "Marketing Digital",
        "Soporte",
        "Svelte",
        "Ember.js",
        "Backbone.js",
        "Django",
        "Flask",
        "Ruby on Rails",
        "Spring",
        "Laravel",
        "ASP.NET",
        "Express.js",
        "NestJS",
        "Google Cloud",
        "AWS",
        "Azure",
        "Firebase",
        "MongoDB",
        "MySQL",
        "PostgreSQL",
        "SQLite",
        "Redis",
        "DynamoDB",
      ];

      const programacionDisponible = [
        "Frontend",
        "Backend",
        "Fullstack",
        "Mobile",
        "Desktop",
        "Web",
        "API",
        "Microservicios",
        "Monolítico",
        "Serverless",
        "Cloud",
        "On-premise",
      ];

      const lenguajesDisponibles = [
        "JavaScript",
        "TypeScript",
        "Python",
        "Java",
        "C#",
        "PHP",
        "Ruby",
        "Go",
        "Swift",
        "Kotlin",
        "Rust",
        "Scala",
        "Perl",
        "R",
        "Haskell",
        "Lua",
        "Dart",
        "Objective-C",
        "Clojure",
        "F#",
        "Erlang",
        "Julia",
        "COBOL",
        "Fortran",
        "Ada",
        "Lisp",
        "Scheme",
        "Prolog",
        "Smalltalk",
        "Pascal",
        "Basic",
        "Assembly",
        "C",
        "C++",
      ];

      for (let i = 1; i <= 100; i++) {
        const ahora = Timestamp.fromDate(new Date());

        const reto = {
          descripcion: `Descripción del reto ${i}`,
          estado: "abierto",
          idUsuarioEmpresa: "XRkyfcB6zsNwt4nv2mpLa2UOHyS2",
          nombreReto: `Reto de prueba ${i}`,
          fechaCreacion: ahora,
          fechaActualizacion: ahora,
          lenguajes: this.obtenerElementosAleatorios(
            lenguajesDisponibles,
            this.numeroAleatorio(2, 5)
          ),
          programacion: this.obtenerElementosAleatorios(
            programacionDisponible,
            this.numeroAleatorio(1, 4)
          ),
          tecnologias: this.obtenerElementosAleatorios(
            tecnologiasDisponibles,
            this.numeroAleatorio(2, 6)
          ),
        };

        try {
          await addDoc(retosRef, reto);
          console.log(`✅ Reto ${i} subido`);
        } catch (error) {
          console.error(`❌ Error en el reto ${i}`, error);
        }
      }
    },

    numeroAleatorio(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
  },
};
</script>
