import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  getDoc,
  collectionGroup,
  onSnapshot
} from "firebase/firestore";

export const obtenerPostulacionRetoPorEmpresa = async (empresaId, estadoFiltrado) => {
  try {
    const retosRef = collection(db, "retos");
    const q = query(retosRef, where("idUsuarioEmpresa", "==", empresaId));
    const retosSnapshot = await getDocs(q);

    const todasLasPostulaciones = [];

    for (const retoDoc of retosSnapshot.docs) {
      const retoId = retoDoc.id;
      const retoData = retoDoc.data();

      const postulacionesRef = collection(db, "retos", retoId, "postulacionReto");
      const postulacionesSnap = await getDocs(postulacionesRef);

      for (const postDoc of postulacionesSnap.docs) {
        const postData = postDoc.data();

        if (postData.estado !== estadoFiltrado) continue;

        // Obtener datos del usuario
        const userRef = doc(db, "usuarios", postData.idPersona, "persona", "datos");
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : null;

        todasLasPostulaciones.push({
          id: postDoc.id,
          ...postData,
          devChallenge: {
            id: retoId,
            ...retoData,
          },
          datosUsuario: {
            id: postData.idPersona,
            ...userData,
          },
        });
      }
    }

    return todasLasPostulaciones;
  } catch (error) {
    console.error("Error al obtener postulaciones de retos:", error);
    return [];
  }
};

export const obtenerPostulacionVacantePorEmpresa = async (empresaId, estadoFiltrado) => {
  try {
    const vacantesRef = collection(db, "vacantes");
    const q = query(vacantesRef, where("idUsuarioEmpresa", "==", empresaId));
    const vacantesSnapshot = await getDocs(q);

    const todasLasPostulaciones = [];

    for (const vacanteDoc of vacantesSnapshot.docs) {
      const vacanteId = vacanteDoc.id;
      const vacanteData = vacanteDoc.data();

      const postulacionesRef = collection(db, "vacantes", vacanteId, "postulacionVacante");
      const postulacionesSnap = await getDocs(postulacionesRef);

      for (const postDoc of postulacionesSnap.docs) {
        const postData = postDoc.data();

        if (postData.estado !== estadoFiltrado) continue;

        // Obtener datos del usuario
        const userRef = doc(db, "usuarios", postData.idPersona, "persona", "datos");
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : null;

        todasLasPostulaciones.push({
          id: postDoc.id,
          ...postData,
          devChallenge: {
            id: vacanteId,
            ...vacanteData,
          },
          datosUsuario: {
            id: postData.idPersona,
            ...userData,
          },
        });
      }
    }

    return todasLasPostulaciones;
  } catch (error) {
    console.error("Error al obtener postulaciones de vacantes:", error);
    return [];
  }
};

export const editarPostulacionReto = async (retoId, postulacionId, nuevosDatos) => {
  try {
    const postulacionRef = doc(db, "retos", retoId, "postulacionReto", postulacionId);
    await updateDoc(postulacionRef, {
      ...nuevosDatos,
      fechaActualizacion: serverTimestamp(),
    });
    console.log("Postulación actualizada correctamente");
  } catch (error) {
    console.error("Error al editar la postulación:", error);
  }
};

export const editarPostulacionVacante = async (vacanteId, postulacionId, nuevosDatos) => {
  try {
    const postulacionRef = doc(db, "vacantes", vacanteId, "postulacionVacante", postulacionId);
    await updateDoc(postulacionRef, {
      ...nuevosDatos,
      fechaActualizacion: serverTimestamp(),
    });
    console.log("Postulación actualizada correctamente");
  } catch (error) {
    console.error("Error al editar la postulación:", error);
  }
};

