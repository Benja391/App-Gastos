<template>
  <section class="flex items-center justify-center min-h-screen bg-[#08a04b] text-white mt-8">
    <div class="relative bg-gray-900 rounded-lg shadow-[0_15px_30px_rgba(0,0,0,0.6)] w-full max-w-lg p-8 mx-4 mt-12 mb-12">
      <h1 class="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
        Creá una cuenta
      </h1>

      <form @submit.prevent="handleSubmit" class="mt-6 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
            <BaseInputs 
              type="email"
              placeholder="Ingresá tu email"
              id="email"
              v-model="user.email"
              class="w-full px-4 py-3 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p v-if="emailError" class="text-red-500 text-sm mt-2">{{ emailError }}</p>
          </div>

          <div>
  <label for="password" class="block text-sm font-medium text-gray-300">Contraseña</label>
  <BaseInputs 
    type="password"
    placeholder="Creá una contraseña"
    id="password"
    v-model="user.password"
    class="w-full px-4 py-3 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  />

  <!-- Bloque de requisitos siempre visible -->
  <ul class="mt-2 text-sm">
    <li :class="{'text-green-500': user.password.length >= 8, 'text-red-500': user.password.length < 8}">
       Mínimo 8 caracteres
    </li>
    <li :class="{'text-green-500': /[A-Z]/.test(user.password), 'text-red-500': !/[A-Z]/.test(user.password)}">
       Al menos una letra mayúscula
    </li>
    <li :class="{'text-green-500': /[0-9]/.test(user.password), 'text-red-500': !/[0-9]/.test(user.password)}">
       Al menos un número
    </li>
   <li :class="{
  'text-green-500': /[!@#$%^&*(),.?':{}|<>]/.test(user.password),
  'text-red-500': !/[!@#$%^&*(),.?':{}|<>]/.test(user.password)
}">
   Al menos un carácter especial
</li>
  
  </ul>
</div>
          <div>
            <label for="nombreDeUsuario" class="block text-sm font-medium text-gray-300">
              Nombre de usuario <span class="text-gray-400">(opcional)</span>
            </label>
            <BaseInputs 
              type="text"
              id="nombreDeUsuario"
              placeholder="Ingresá tu nombre de usuario"
              v-model="user.nombreDeUsuario"
              class="w-full px-4 py-3 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p v-if="nombreDeUsuarioError" class="text-red-500 text-sm mt-2">{{ nombreDeUsuarioError }}</p>
          </div>
        </div>

        <button 
          type="submit"
          :disabled="loading || cuentaCreada"
          class="w-full py-3 mt-4 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <span v-if="loading">Cargando...</span>
          <span v-else-if="cuentaCreada">¡Cuenta creada con éxito!</span>
          <span v-else>¡Creá tu cuenta!</span>
        </button>

        <p class="text-center text-sm text-gray-300 mt-6">
          ¿Ya tenés una cuenta?
          <router-link to="/Iniciar-sesion" class="text-green-400 hover:underline hover:text-green-300">
            Iniciá sesión
          </router-link>
        </p>
      </form>

      <p v-if="errorMessage" class="text-red-500 mt-4 text-center">{{ errorMessage }}</p>
    </div>
  </section>
</template>



<script>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import BaseInputs from '../components/BaseInputs.vue';


export default {
  name: "Register",
  components: { BaseInputs, },
  data() {
    return {
      user: {
        
        nombreDeUsuario: '',
        email: '',
        password: '',
      },
      loading: false,
      successMessage: '',
      errorMessage: '',
      
    
      emailError: '',
      passwordError: '',
      cuentaCreada: false,
    };
  },
  methods: {
    validateForm() {
  this.emailError = '';
  this.passwordError = '';

  let valid = true;

  // Validación de email
  if (!this.user.email) {
    this.emailError = 'El correo electrónico es obligatorio.';
    valid = false;
  } else if (!/\S+@\S+\.\S+/.test(this.user.email)) {
    this.emailError = 'Por favor ingresa un correo electrónico válido.';
    valid = false;
  }

  // Validación de contraseña
  const password = this.user.password;
  if (!password) {
    this.passwordError = 'La contraseña es obligatoria.';
    valid = false;
  } else {
    if (password.length < 8) {
      this.passwordError = 'La contraseña debe tener al menos 8 caracteres.';
      valid = false;
    } else if (!/[A-Z]/.test(password)) {
      this.passwordError = 'La contraseña debe contener al menos una letra mayúscula.';
      valid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      this.passwordError = 'La contraseña debe contener al menos un carácter especial.';
      valid = false;
    }
  }

  if (!valid) {
    setTimeout(() => {
      this.nombreDeUsuarioError = '';
      this.emailError = '';
      this.passwordError = '';
    }, 2000);
  }

  return valid;
},


    async handleSubmit() {
      this.loading = true;
      this.successMessage = '';
      this.errorMessage = '';

      if (!this.validateForm()) {
        this.loading = false;
        return;
      }

      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, this.user.email, this.user.password);

        const userDoc = {
        
          nombreDeUsuario: this.user.nombreDeUsuario,
          email: this.user.email,
          uid: userCredential.user.uid
        };

        await addDoc(collection(db, 'users'), userDoc);

        
        this.cuentaCreada = true;

      
        this.user.nombreDeUsuario = '';
        this.user.email = '';
        this.user.password = '';

        setTimeout(() => {
          this.$router.push({ path: '/Monto-Total' });
        }, 1500);

      } catch (error) {
        console.error('Error al crear cuenta:', error);

        if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = 'El correo electrónico ya está en uso.';
        } else {
          this.errorMessage = 'Hubo un error al crear la cuenta. Por favor, intente nuevamente.';
        }

        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      } finally {
        this.loading = false;
        setTimeout(() => {
          this.cuentaCreada = false;
        }, 3000);
      }
    }
  }
};
</script>
