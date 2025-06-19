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
} from "firebase/firestore";

//Funcion para crear una vacante
export const crearVacante = async (vacante) => {
  try {
    const vacanteConFecha = {
      ...vacante,
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "vacantes"), vacanteConFecha);
    return docRef.id;
  } catch (error) {
    console.error("Error al crear el vacante:", error);
    throw error;
  }
};

//Funcion para obtener vacantes por empresa
export const obtenerVacantesPorEmpresa = async (empresa) => {
  try {
    const q = query(
      collection(db, "vacantes"),
      where("idUsuarioEmpresa", "==", empresa),
      orderBy("fechaCreacion", "desc")
    );

    const querySnapshot = await getDocs(q);

    const vacantes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return vacantes;
  } catch (error) {
    console.error("Error al obtener los vacantes:", error);
    throw error;
  }
};

// Función para actualizar un vacante existente
export const actualizarVacante = async (idVacante, datosActualizados) => {
  try {
    const vacanteRef = doc(db, "vacantes", idVacante);
    await updateDoc(vacanteRef, {
      ...datosActualizados,
      fechaActualizacion: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error al actualizar el vacante:", error);
    throw error;
  }
};

// Función para eliminar un vacante por su ID
export const eliminarVacantePorID = async (idVacante) => {
  try {
    const vacanteRef = doc(db, "vacantes", idVacante);
    await deleteDoc(vacanteRef);
  } catch (error) {
    console.error("Error al eliminar el vacante:", error);
    throw error;
  }
};

export const obtenerVacanteConEmpresa = async () => {
  try {
    const q = query(collection(db, "vacantes"), orderBy("fechaCreacion", "desc"));
    const querySnapshot = await getDocs(q);

    const vacantes = [];

    for (const documento of querySnapshot.docs) {
      const vacanteData = documento.data();
      const empresaId = vacanteData.idUsuarioEmpresa;

      let empresaData = null;

      try {
        const empresaDocRef = doc(
          db,
          "usuarios",
          empresaId,
          "empresa",
          "datos"
        );
        const empresaDocSnap = await getDoc(empresaDocRef);
        if (empresaDocSnap.exists()) {
          empresaData = empresaDocSnap.data();
        }
      } catch (e) {
        console.warn(`Error obteniendo empresa para usuario ${empresaId}:`, e);
      }

      vacantes.push({
        id: documento.id,
        ...vacanteData,
        empresa: empresaData, // se agrega la info de la empresa
      });
    }

    return vacantes;
  } catch (error) {
    console.error("Error al obtener vacantes con datos de empresa:", error);
    throw error;
  }
};

export const registrarParticipacionVacante = async (idVacante, idPersona) => {
  try {
    const participacionData = {
      idVacante,
      idPersona,
      estado: "pendiente",
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp()
    };

    // Subcolección dentro del reto
    const subcoleccionRef = collection(db, `vacantes/${idVacante}/postulacionVacante`);
    await addDoc(subcoleccionRef, participacionData);

    console.log("Participación registrada exitosamente.");
  } catch (error) {
    console.error("Error al registrar la participación:", error);
    throw error;
  }
};

export const verificarRegistroVacante = async (idVacante, idPersona) => {
  try {
    const participantesRef = collection(db, `vacantes/${idVacante}/postulacionVacante`);
    const q = query(participantesRef, where("idPersona", "==", idPersona));

    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty; // true si ya está registrado
  } catch (error) {
    console.error("Error al verificar la participación:", error);
    throw error;
  }
};