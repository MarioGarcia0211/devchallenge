import { createRouter, createWebHistory } from "vue-router";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import PersonProfileLayout from "../views/PersonProfileLayout.vue";
import PersonProfile from "../components/Person/Profile/PersonProfile.vue";
import CompanyProfileLayout from "../views/CompanyProfileLayout.vue";
import CompanyProfile from "../components/Company/Profile/CompanyProfile.vue";
import CompanyChallenge from "../components/Company/Challenge/CompanyChallenge.vue";
import CompanyVancant from "../components/Company/Vacant/CompanyVacant.vue";
import Challenge from "../views/Challenge.vue";
import Vacant from "../views/Vacant.vue";
import PersonChallenge from "../components/Person/Challenge/PersonChallenge.vue";
import PersonVacant from "../components/Person/Vacant/PersonVacant.vue";

// Definición de rutas
const routes = [
  {
    path: "/", // Ruta raíz
    redirect: "/login", // Redirige automáticamente al login
  },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
  // Perfil de usuario (persona)
  {
    path: "/user-profile",
    name: "userProfile",
    component: PersonProfileLayout,
    meta: { requiresAuth: true, role: "persona" }, // Requiere estar autenticado y tener rol "persona"
    redirect: "/user-profile/profile", // Redirige a la subruta "profile"
    children: [
      { path: "profile", name: "", component: PersonProfile, props: true },
      { path: "challenge", name: "", component: PersonChallenge },
      { path: "vacant", name: "", component: PersonVacant },

    ],
  },
  // Perfil de usuario (empresa)
  {
    path: "/company-profile",
    name: "companyProfile",
    component: CompanyProfileLayout,
    meta: { requiresAuth: true, role: "empresa" }, // Requiere estar autenticado y tener rol "empresa"
    redirect: "/company-profile/profile", // Redirige a la subruta "profile"
    children: [
      { path: "profile", name: "", component: CompanyProfile, props: true },
      { path: "challenge", name: "", component: CompanyChallenge },
      { path: "vacant", name: "", component: CompanyVancant},
    ],
  },
  // Retos
  {
    path: "/challenge",
    name: "",
    component: Challenge,
  }, 
  // Vacantes
  {
    path: "/vacant",
    name: "",
    component: Vacant,
  },
];

// Crear el router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protección de rutas con guardias globales
router.beforeEach(async (to, from, next) => {
  // Detecta si la ruta requiere autenticación
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // Si la ruta tiene una meta con el rol requerido, se guarda en expectedRole
  const expectedRole = to.meta.role;

  // Esperamos que Firebase confirme si hay un usuario logueado (incluso si es un refresh)
  const currentUser = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });

  // Si está logueado e intenta ir a login o register, lo redirigimos a su perfil según su tipo
  if (currentUser && (to.path === "/login" || to.path === "/register")) {
    const userDoc = await getDoc(doc(db, "usuarios", currentUser.uid));
    const tipoUsuario = userDoc.exists() ? userDoc.data().tipoUsuario : null;

    if (tipoUsuario === "persona") return next("/user-profile");
    if (tipoUsuario === "empresa") return next("/company-profile");
    return next(); // Si no tiene tipo definido, dejamos continuar
  }

  // Si la ruta no necesita autenticación, dejar pasar
  if (!requiresAuth) return next();

  // Si la ruta necesita autenticación y no hay usuario, redirigir al login
  if (!currentUser) return next("/login");

  try {
    // Buscar el documento del usuario en Firestore
    const userDoc = await getDoc(doc(db, "usuarios", currentUser.uid));
    if (!userDoc.exists()) return next("/login");

    const userRole = userDoc.data().tipoUsuario;

    // Si el rol no coincide con el esperado, redirigir al perfil correcto
    if (expectedRole && userRole !== expectedRole) {
      return next(
        userRole === "persona" ? "/user-profile" : "/company-profile"
      );
    }

    // Todo correcto, continuar a la ruta
    return next();
  } catch (error) {
    console.error("Error en protección de rutas:", error);
    return next("/login"); // Ante cualquier error, redirigimos al login
  }
});

// Exportamos el router para usarlo en la app
export default router;
