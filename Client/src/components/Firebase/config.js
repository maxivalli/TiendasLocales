import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getMessaging } from "firebase/messaging";
import { v4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyAiXwnw-mIc8s-DkV2y8JaSwjKa__KF6i8",
  authDomain: "tiendaslocales-7bbf8.firebaseapp.com",
  projectId: "tiendaslocales-7bbf8",
  storageBucket: "tiendaslocales-7bbf8.appspot.com",
  messagingSenderId: "611326584535",
  appId: "1:611326584535:web:0e3aa3aeb59818cbe57292"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app)

export async function uploadFile(file){
  const storageRef = ref(storage, v4());
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  return url
}

export const messaging = getMessaging(app);


