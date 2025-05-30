import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile } from "../services/user-profile";

const AUTH_EMPTY_STATE = {
    id: null,
    email: null,
};

let authUser = AUTH_EMPTY_STATE;
let observers = [];

if (localStorage.getItem('user')){
    authUser =JSON.parse(localStorage.getItem('user'));
}

onAuthStateChanged(auth, user => {
    if (user) {
        authUser = {
            id: user.uid,
            email: user.email,
        };

        localStorage.setItem('user',JSON.stringify(authUser));

    } else {
        authUser = AUTH_EMPTY_STATE;   
        localStorage.removeItem('user');
    }
    notifyAll();
});

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{id: string, email: string}>}
 */
export async function register(email, password) {
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password); // Añadir await aquí

        await createUserProfile(userCredentials.user.uid, { email: userCredentials.user.email });

        console.log('Usuario creado: ', userCredentials);
        return {
            id: userCredentials.user.uid,
            email: userCredentials.user.email,
        };
    } catch (error) {
        console.error('[auth.js register] Error al crear el usuario ', error);
        throw error; 
    }
}

export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
    .then(userCredentials => {
        const user = userCredentials.user;
        console.log("Usuario autenticado: ", user);
        return {
            id: user.uid,
            email: user.email,
        };
    });
}

/**
 * @returns {Promise<void>}
 */
export function logout() {
    return signOut(auth);
}

/**
 * 
 * @param {(user) => void} callback 
 * @returns {() => void}
 */
export function suscribeToAuth(callback) {
    observers.push(callback);
    console.log("observer para auth agg. el stack es:", observers);
    notify(callback);
    return () => observers = observers.filter(obs => obs !== callback);
}

/**
 * 
 * @param {(user) => void} observer
 */
function notify(observer) {
    observer({ ...authUser });
}

function notifyAll() {
    observers.forEach(obs => notify(obs));
}
