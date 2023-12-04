import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyC5rqp-6yMzL-sLJAv1psn4U6MbTirHGp8",
  authDomain: "tiendaslocales-df366.firebaseapp.com",
  projectId: "tiendaslocales-df366",
  storageBucket: "tiendaslocales-df366.appspot.com",
  messagingSenderId: "977128139184",
  appId: "1:977128139184:web:a110bf0a95ef4456398e75"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)

export async function uploadFile(file){
  const storageRef = ref(storage, v4());
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  return url
}