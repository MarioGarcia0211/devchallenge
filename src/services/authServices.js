import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  doc,
  setDoc,
  serverTimestamp,
  collectionGroup,
  getDocs,
  query,
  where,
  collection,
} from "firebase/firestore";

// Función iniciar sesión
export const iniciarSesion = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // console.log(userCredential)
    return userCredential.user;
  } catch (error) {
    // console.log(error.code);
    throw mapFirebaseError(error.code);
  }
};

// Función para registrar usuario y guardar en Firestore
export const registrarUsuario = async (
  email,
  password,
  tipoUsuario,
  datosEspecificos
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;

    // Documento principal con solo los datos necesarios
    await setDoc(doc(db, "usuarios", uid), {
      correo: email,
      tipoUsuario,
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp()
    });

    // Copia los datos y elimina la contraseña
    const datosFiltrados = { ...datosEspecificos };
    delete datosFiltrados.contrasena;

    // Guardar los datos en subcolección "persona" o "empresa" > "datos"
    await setDoc(
      doc(db, "usuarios", uid, tipoUsuario, "datos"),
      datosFiltrados
    );

    return uid;
  } catch (error) {
    throw mapFirebaseError(error.code);
  }
};

// Funcion cerrar sesión
export const cerrarSesion = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw "No se pudo cerrar la sesión. Intenta de nuevo.";
  }
};

// Función para mapear los errores de Firebase y devolver mensajes más comprensibles
const mapFirebaseError = (code) => {
  switch (code) {
    case "auth/email-already-in-use":
      return "El correo ya está registrado.";
    case "auth/invalid-email":
      return "El correo electrónico no es válido.";
    case "auth/user-disabled":
      return "La cuenta ha sido deshabilitada.";
    case "auth/user-not-found":
      return "No existe una cuenta con ese correo.";
    case "auth/wrong-password":
      return "La contraseña es incorrecta.";
    case "auth/invalid-credential":
      return "Correo y/o contraseña incorrectos.";
    default:
      return "Ocurrió un error inesperado. Intenta nuevamente.";
  }
};

// Funcion verificar numero de documento
export const verificarDocumentoUnico = async (numeroDocumento) => {
  const q = query(
    collectionGroup(db, "persona"),
    where("numeroDocumento", "==", numeroDocumento)
  );

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Funcion verificar correo
export const verificarCorreoUnico = async (correo) => {
  const q = query(collection(db, "usuarios"), where("correo", "==", correo));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

// Funcion verificar nit
export const verificarNitUnico = async (nit) => {
  const q = query(collectionGroup(db, "empresa"), where("nit", "==", nit));

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};
