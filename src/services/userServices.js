import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";

//Funcion para obtener el tipo de usuario
export const obtenerTipoUsuario = async (uid) => {
  const docRef = doc(db, "usuarios", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("No se encontró el tipo de usuario.");
  }

  const datos = docSnap.data();
  if (!datos.tipoUsuario) {
    throw new Error("El usuario no tiene definido un tipo.");
  }

  return datos.tipoUsuario;
};

//Funcion para obtener los datos del usuario
export function obtenerDatosUsuario() {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const uid = user.uid;
          const usuarioRef = doc(db, "usuarios", uid);
          const usuarioSnap = await getDoc(usuarioRef);

          if (!usuarioSnap.exists()) {
            reject("No se encontró el documento del usuario");
            return;
          }

          const { tipoUsuario } = usuarioSnap.data();

          const datosRef = doc(db, "usuarios", uid, tipoUsuario, "datos");
          const datosSnap = await getDoc(datosRef);

          if (!datosSnap.exists()) {
            reject("No se encontró el documento de datos");
            return;
          }

          const datosUsuario = {
            uid: uid,
            ...datosSnap.data(),
          };

          resolve(datosUsuario);
        } catch (error) {
          reject(error);
        }
      } else {
        reject("Usuario no autenticado");
      }
    });
  });
}
