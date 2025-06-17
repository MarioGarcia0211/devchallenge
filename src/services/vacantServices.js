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
} from "firebase/firestore";

//Funcion para crear una vacante
export const crearVacante = async (vacante) => {
  try {
    const vacanteConFecha = {
      ...vacante,
      fechaRegistro: serverTimestamp(),
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
      orderBy("fechaRegistro", "desc")
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
