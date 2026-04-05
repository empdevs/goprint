export function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        reject(new Error("File tidak dapat dibaca"));
        return;
      }

      const [, base64] = result.split(",");

      if (!base64) {
        reject(new Error("Format file tidak valid"));
        return;
      }

      resolve(base64);
    };

    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsDataURL(file);
  });
}
