export const compressImage = (file, maxWidth = 150, maxHeight = 150, maxSizeKB = 100) => {
  return new Promise((resolve, reject) => {
    // Validar tipo
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      reject(new Error("Solo se permiten archivos PNG, JPG o JPEG"));
      return;
    }

    // Validar tamaño original
    if (file.size > 2 * 1024 * 1024) {
      reject(new Error("El archivo no debe superar 2MB"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Comprimir con calidad adaptativa
        let quality = 0.7;
        let compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        const maxSizeBytes = maxSizeKB * 1024;

        while (compressedDataUrl.length > maxSizeBytes && quality > 0.3) {
          quality -= 0.1;
          compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error("Error al cargar imagen"));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error("Error al leer archivo"));
    reader.readAsDataURL(file);
  });
};
