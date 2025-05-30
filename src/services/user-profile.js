import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * @param {string} id 
 * @param {{email: string}} data 
 * @returns {Promise<void>}
 */
export async function createUserProfile(id, data) {
    const userRef = doc(db, `users/${id}`);
    try {
        await setDoc(userRef, data);
        console.log('Perfil de usuario creado/actualizado:', data);
    } catch (error) {
        console.error('[user-profile.js createUserProfile] Error al crear/actualizar el perfil del usuario', error);
        throw error; 
    }
}

/**
 * @param {string} id 
 * @returns {Promise<{id: string, email: string}>}
 */
export async function getUserProfileById(id) {
    const userRef = doc(db, `users/${id}`);
    try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('Perfil de usuario encontrado:', userData); 
            return {
                id: userDoc.id,
                email: userData.email,
            };
        } else {
            console.log(`Usuario con id ${id} no encontrado`);
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('[user-profile.js getUserProfileById] Error al traer el perfil del usuario', error);
        throw error;
    }
}
