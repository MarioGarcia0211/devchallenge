export async function subirImagenCloudinary(file) {
  const url = "https://api.cloudinary.com/v1_1/dbdgxclqy/upload";
  const uploadPreset = "fotoPerfil";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Error al subir imagen");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Error al subir imagen a Cloudinary:", error);
    throw error;
  }
}

export async function subirDocumentoCloudinary(file) {
  const url = "https://api.cloudinary.com/v1_1/dbdgxclqy/raw/upload";
  const uploadPreset = "hojaDeVida";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Error al subir documento");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Error al subir documento:", error);
    throw error;
  }
}
