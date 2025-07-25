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
  limit,
  startAfter,
} from "firebase/firestore";

//Funcion para crear un retp
export const crearReto = async (reto) => {
  try {
    const retoConFecha = {
      ...reto,
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "retos"), retoConFecha);
    return docRef.id;
  } catch (error) {
    console.error("Error al crear el reto:", error);
    throw error;
  }
};

//Funcion para obtener retos por empresa
export const obtenerRetosPorEmpresa = async (empresa) => {
  try {
    const q = query(
      collection(db, "retos"),
      where("idUsuarioEmpresa", "==", empresa),
      orderBy("fechaCreacion", "desc")
    );

    const querySnapshot = await getDocs(q);

    const retos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return retos;
  } catch (error) {
    console.error("Error al obtener los retos:", error);
    throw error;
  }
};

// Función para actualizar un reto existente
export const actualizarReto = async (idReto, datosActualizados) => {
  try {
    const retoRef = doc(db, "retos", idReto);
    await updateDoc(retoRef, {
      ...datosActualizados,
      fechaActualizacion: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error al actualizar el reto:", error);
    throw error;
  }
};

// Función para eliminar un reto por su ID
export const eliminarRetoPorID = async (idReto) => {
  try {
    const retoRef = doc(db, "retos", idReto);
    await deleteDoc(retoRef);
  } catch (error) {
    console.error("Error al eliminar el reto:", error);
    throw error;
  }
};

// Función para obtener todos los retos
export const obtenerTodosLosRetos = async () => {
  try {
    const q = query(
      collection(db, "retos"),
      orderBy("fechaCreacion", "desc") // ordenados del más reciente al más antiguo
    );

    const querySnapshot = await getDocs(q);

    const retos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return retos;
  } catch (error) {
    console.error("Error al obtener todos los retos:", error);
    throw error;
  }
};

// export const obtenerRetosConEmpresa = async () => {
//   try {
//     const q = query(collection(db, "retos"), orderBy("fechaCreacion", "desc"));
//     const querySnapshot = await getDocs(q);

//     const retos = [];

//     for (const documento of querySnapshot.docs) {
//       const retoData = documento.data();
//       const empresaId = retoData.idUsuarioEmpresa;

//       let empresaData = null;

//       try {
//         const empresaDocRef = doc(
//           db,
//           "usuarios",
//           empresaId,
//           "empresa",
//           "datos"
//         );
//         const empresaDocSnap = await getDoc(empresaDocRef);
//         if (empresaDocSnap.exists()) {
//           empresaData = empresaDocSnap.data();
//         }
//       } catch (e) {
//         console.warn(`Error obteniendo empresa para usuario ${empresaId}:`, e);
//       }

//       retos.push({
//         id: documento.id,
//         ...retoData,
//         empresa: empresaData, // se agrega la info de la empresa
//       });
//     }

//     return retos;
//   } catch (error) {
//     console.error("Error al obtener retos con datos de empresa:", error);
//     throw error;
//   }
// };

export const obtenerRetosConEmpresa = async (ultimoDoc = null, cantidad = 6) => {
  try {
    let q = query(
      collection(db, "retos"),
      orderBy("fechaCreacion", "desc"),
      limit(cantidad)
    );

    if (ultimoDoc) {
      q = query(q, startAfter(ultimoDoc));
    }

    const querySnapshot = await getDocs(q);

    const retos = [];
    let lastVisible = null;

    for (const documento of querySnapshot.docs) {
      const retoData = documento.data();
      const empresaId = retoData.idUsuarioEmpresa;

      let empresaData = null;

      try {
        const empresaDocRef = doc(db, "usuarios", empresaId, "empresa", "datos");
        const empresaDocSnap = await getDoc(empresaDocRef);
        if (empresaDocSnap.exists()) {
          empresaData = empresaDocSnap.data();
        }
      } catch (e) {
        console.warn(`Error obteniendo empresa para usuario ${empresaId}:`, e);
      }

      retos.push({
        id: documento.id,
        ...retoData,
        empresa: empresaData,
      });

      lastVisible = documento; // guardar el último doc del lote
    }

    return { retos, lastVisible };
  } catch (error) {
    console.error("Error al obtener retos paginados:", error);
    throw error;
  }
};

export const registrarParticipacionReto = async (idReto, idPersona) => {
  try {
    const participacionData = {
      idReto,
      idPersona,
      estado: "pendiente",
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp()
    };

    // Subcolección dentro del reto
    const subcoleccionRef = collection(db, `retos/${idReto}/postulacionReto`);
    await addDoc(subcoleccionRef, participacionData);

    console.log("Participación registrada exitosamente.");
  } catch (error) {
    console.error("Error al registrar la participación:", error);
    throw error;
  }
};

export const verificarRegistroReto = async (idReto, idPersona) => {
  try {
    const participantesRef = collection(db, `retos/${idReto}/postulacionReto`);
    const q = query(participantesRef, where("idPersona", "==", idPersona));

    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty; // true si ya está registrado
  } catch (error) {
    console.error("Error al verificar la participación:", error);
    throw error;
  }
};

export const obtenerRetosPorPersonaYEstado = async (
  idPersona,
  estado = null
) => {
  try {
    let filtros = [where("idPersona", "==", idPersona)];

    if (estado !== null) {
      filtros.push(where("estado", "==", estado));
    }

    // Añadir orden por fechaCreacion descendente
    filtros.push(orderBy("fechaCreacion", "desc"));

    const q = query(collectionGroup(db, "postulacionReto"), ...filtros);
    const querySnapshot = await getDocs(q);

    const retosParticipando = [];

    for (const docPostulacion of querySnapshot.docs) {
      const dataPostulacion = docPostulacion.data();
      const retoId = dataPostulacion.idReto;

      const retoDocRef = doc(db, "retos", retoId);
      const retoDocSnap = await getDoc(retoDocRef);

      if (retoDocSnap.exists()) {
        const retoData = retoDocSnap.data();
        const empresaId = retoData.idUsuarioEmpresa;

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
          console.warn(
            `Error obteniendo empresa para usuario ${empresaId}:`,
            e
          );
        }

        retosParticipando.push({
          id: retoDocSnap.id,
          ...retoData,
          estadoPostulacion: dataPostulacion.estado,
          fechaPostulacion: dataPostulacion.fechaCreacion,
          empresa: empresaData,
        });
      }
    }

    return retosParticipando;
  } catch (error) {
    console.error("Error al obtener los retos por persona y estado:", error);
    throw error;
  }
};

