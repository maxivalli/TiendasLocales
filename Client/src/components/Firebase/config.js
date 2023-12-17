import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyAiXwnw-mIc8s-DkV2y8JaSwjKa__KF6i8",
  authDomain: "tiendaslocales-7bbf8.firebaseapp.com",
  projectId: "tiendaslocales-7bbf8",
  storageBucket: "tiendaslocales-7bbf8.appspot.com",
  messagingSenderId: "611326584535",
  appId: "1:611326584535:web:0e3aa3aeb59818cbe57292",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export async function uploadFile(file) {
  function resizeImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const maxWidth = 800;
          const maxHeight = 600;
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

          canvas.toBlob((blob) => {
            resolve(blob);
          }, file.type);
        };
      };
    });
  }

  const resizedImage = await resizeImage(file);

  const storageRef = ref(storage, v4());
  await uploadBytes(storageRef, resizedImage);

  const url = await getDownloadURL(storageRef);
  return url;
}
