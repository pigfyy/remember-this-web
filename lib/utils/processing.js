const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const b64ToBlob = (base64String, contentType) => {
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: contentType });
};

const b64ToBlobUrl = (base64String) => {
  const blob = b64ToBlob(base64String, "image/png");
  return URL.createObjectURL(blob);
};

const fileToBase64BlobString = async (file) => {
  return new Promise(async (resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async function (event) {
      const base64dataURL = event.target.result;

      try {
        const response = await fetch(base64dataURL);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.blob();
        const reader = new FileReader();
        reader.onload = () => {
          const base64BlobString = reader.result;
          resolve(base64BlobString);
        };
        reader.readAsDataURL(data);
      } catch (error) {
        console.error("Error converting file to Base64 Blob String:", error);
        reject(error);
      }
    };

    reader.readAsDataURL(file);
  });
};

export {
  capitalizeFirstLetter,
  b64ToBlob,
  b64ToBlobUrl,
  fileToBase64BlobString,
};
