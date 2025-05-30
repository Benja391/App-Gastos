<template>
  <section class="flex items-center justify-center min-h-screen bg-[#08a04b] text-white">
    <div class="relative bg-gray-900 rounded-lg shadow-[0_15px_30px_rgba(0,0,0,0.6)] w-full max-w-md p-8">
      <h1 class="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
        Inicia Sesión
      </h1>
       
    <p v-if="$route.query.mensaje" class="text-red-600 font-semibold mb-4">
      {{ $route.query.mensaje }}
    </p>
      <form @submit.prevent="handleLogin" class="mt-6">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
            <BaseInputs 
              type="email"
              placeholder="Ingrese su email"
              id="email"
              v-model="user.email"
              class="w-full px-4 py-3  text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p v-if="emailError" class="text-red-500 text-sm mt-2">{{ emailError }}</p>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300">Contraseña</label>
            <BaseInputs 
              type="password"
              placeholder="Ingrese su contraseña"
              id="password"
              v-model="user.password"
              class="w-full px-4 py-3 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p v-if="passwordError" class="text-red-500 text-sm mt-2">{{ passwordError }}</p>
          </div>
        </div>

      
        <button 
          type="submit"
          :disabled="loading"
          class="w-full py-3 mt-6 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          
          <span v-if="loading" class="flex items-center justify-center">
       
            <svg class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4-4m-4 4l-4-4m8-4h-6M12 4H6" />
            </svg>
            Cargando...
          </span>
          <span v-else>
            Iniciar sesión
          </span>
        </button>
        <p class="text-center text-sm text-gray-300 mt-6">
          ¿No tenés una cuenta?
          <router-link to="/Registrarse" class="text-green-400 hover:underline hover:text-green-300">
            Registrate
          </router-link>
        </p>
      </form>

     
      <p v-if="errorMessage" class="text-red-500 mt-4 text-center">{{ errorMessage }}</p>

      
      <p v-if="successMessage" class="text-green-500 mt-4 text-center">{{ successMessage }}</p>
    </div>
  </section>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import BaseInputs from '../components/BaseInputs.vue';

export default {
  name: "Login",
  components: { BaseInputs, },
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
      loading: false,
      errorMessage: '',
      successMessage: '',  
      emailError: '',  
      passwordError: '',  
    };
  },
  methods: {
    validateForm() {
      this.emailError = '';
      this.passwordError = '';
      
      let valid = true;

      
      if (!this.user.email) {
        this.emailError = 'El correo electrónico es obligatorio.';
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(this.user.email)) {
        this.emailError = 'Por favor ingresa un correo electrónico válido.';
        valid = false;
      }

      
      if (!this.user.password) {
        this.passwordError = 'La contraseña es obligatoria.';
        valid = false;
      } 

      
      if (this.emailError || this.passwordError) {
        setTimeout(() => {
          this.emailError = '';
          this.passwordError = '';
        }, 1000);  
      }

      return valid;
    },
    async handleLogin() {
      this.loading = true;
      this.errorMessage = '';  
      this.successMessage = '';  

     
      if (!this.validateForm()) {
        this.loading = false;
        return;
      }

      try {
        const auth = getAuth();
       
        const userCredential = await signInWithEmailAndPassword(auth, this.user.email, this.user.password);
        const uid = userCredential.user.uid;

        
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const usuario = querySnapshot.docs[0].data();

       
          this.successMessage = '¡Bienvenido! Has iniciado sesión correctamente.';
          
       
          this.user.email = '';
          this.user.password = '';
          
         
          setTimeout(() => {
            this.$router.push({ path: '/Monto-Total' });
          }, 2000); 

        } else {
          throw new Error("Usuario no encontrado");
        }

      } catch (error) {
        console.log('Error al iniciar sesión:', error);
       
        if (error.code === 'auth/user-not-found') {
          this.errorMessage = 'El usuario no existe.';
        } else if (error.code === 'auth/wrong-password') {
          this.errorMessage = 'Contraseña incorrecta.';
        } else {
          this.errorMessage = 'Hubo un error al iniciar sesión.';
        }

        
        setTimeout(() => {
          this.errorMessage = '';  
        }, 2000);  
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
