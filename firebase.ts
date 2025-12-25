
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * إعدادات Firebase
 * يجب عليك استبدال هذه القيم من Firebase Console:
 * 1. اذهب إلى https://console.firebase.google.com/
 * 2. اختر مشروعك (أو أنشئ واحداً جديداً).
 * 3. اضغط على أيقونة </> (Web App).
 * 4. انسخ كائن firebaseConfig وضعه هنا.
 * 5. تأكد من تفعيل "Cloud Firestore" من القائمة الجانبية (Build > Firestore Database).
 */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id", // هذا هو المسبب للخطأ الحالي
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// فحص بسيط للتأكد من تغيير القيم الافتراضية
export const isFirebaseConfigured = firebaseConfig.projectId !== "your-project-id";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
