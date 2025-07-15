import { db } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";

// Reference to templates collection
const templatesCollection = collection(db, "templates");

// Fetch all templates ordered by name
export async function fetchTemplates() {
  const q = query(templatesCollection, orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Add a new template
export async function addTemplate(name, content) {
  const docRef = await addDoc(templatesCollection, {
    name,
    content,
    createdAt: new Date(),
  });
  return docRef.id;
}
