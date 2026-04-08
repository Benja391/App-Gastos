<template>
  <section class="min-h-screen bg-[#08a04b] px-4 py-10 mt-8 flex items-center justify-center">
    <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white/95 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-white/40">
      <div class="p-6 md:p-10 bg-gray-950 text-white order-2 lg:order-1">
        <h1 class="text-3xl font-bold mb-2 text-center">Creá tu cuenta</h1>
        <p class="text-center text-gray-400 mb-6">Empezá a organizar tus finanzas hoy.</p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="nombreDeUsuario" class="block text-sm font-medium text-gray-300 mb-1">Nombre de usuario (opcional)</label>
            <BaseInputs
              id="nombreDeUsuario"
              v-model="user.nombreDeUsuario"
              type="text"
              placeholder="Ej: juan_finanzas"
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <div class="relative">
              <BaseInputs
                id="email"
                v-model="user.email"
                type="email"
                placeholder="tuemail@ejemplo.com"
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500"
                @input="validateEmail"
                @blur="touched.email = true"
              />
              <span v-if="touched.email" class="absolute right-3 top-1/2 -translate-y-1/2 text-sm">{{ emailIcon }}</span>
            </div>
            <p v-if="touched.email && emailError" class="text-red-400 text-sm mt-1">{{ emailError }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
            <div class="relative">
              <BaseInputs
                id="password"
                v-model="user.password"
                type="password"
                placeholder="Creá una contraseña segura"
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500"
                @input="validatePassword"
                @blur="touched.password = true"
              />
              <span v-if="touched.password" class="absolute right-3 top-1/2 -translate-y-1/2 text-sm">{{ passwordIcon }}</span>
            </div>
            <p v-if="touched.password && passwordError" class="text-red-400 text-sm mt-1">{{ passwordError }}</p>

            <ul class="mt-2 text-xs space-y-1 text-gray-300">
              <li :class="passwordChecks.length ? 'text-green-400' : 'text-red-400'">• Mínimo 8 caracteres</li>
              <li :class="passwordChecks.upper ? 'text-green-400' : 'text-red-400'">• Al menos una mayúscula</li>
              <li :class="passwordChecks.number ? 'text-green-400' : 'text-red-400'">• Al menos un número</li>
              <li :class="passwordChecks.special ? 'text-green-400' : 'text-red-400'">• Al menos un carácter especial</li>
            </ul>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-1">Confirmar contraseña</label>
            <div class="relative">
              <BaseInputs
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                placeholder="Repetí tu contraseña"
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500"
                @input="validateConfirmPassword"
                @blur="touched.confirmPassword = true"
              />
              <span v-if="touched.confirmPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-sm">{{ confirmIcon }}</span>
            </div>
            <p v-if="touched.confirmPassword && confirmPasswordError" class="text-red-400 text-sm mt-1">{{ confirmPasswordError }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading || cuentaCreada"
            class="w-full py-3 bg-green-600 rounded-xl font-bold hover:bg-green-500 transition disabled:opacity-60"
          >
            <span v-if="loading">Creando cuenta...</span>
            <span v-else-if="cuentaCreada">¡Cuenta creada!</span>
            <span v-else>Crear cuenta</span>
          </button>

          <button
            type="button"
            @click="handleGoogleRegister"
            :disabled="googleLoading"
            class="w-full py-3 border border-white/30 rounded-xl font-semibold hover:bg-white/10 transition disabled:opacity-60"
          >
            {{ googleLoading ? 'Conectando con Google...' : 'Registrarme con Google' }}
          </button>
        </form>

        <p v-if="errorMessage" class="text-red-400 mt-4 text-sm text-center">{{ errorMessage }}</p>
        <p v-if="successMessage" class="text-green-400 mt-4 text-sm text-center">{{ successMessage }}</p>

        <p class="text-center text-sm text-gray-300 mt-6">
          ¿Ya tenés una cuenta?
          <router-link to="/Iniciar-sesion" class="text-green-400 hover:underline hover:text-green-300">Iniciá sesión</router-link>
        </p>
      </div>

      <div class="hidden lg:flex relative items-end p-8 bg-gradient-to-br from-emerald-700 to-green-900 text-white order-1 lg:order-2">
        <img src="/registro-facil.png" alt="Ilustración registro" class="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div class="relative z-10">
          <p class="text-sm uppercase tracking-widest text-green-100 mb-2">Primer paso</p>
          <h2 class="text-4xl font-extrabold leading-tight mb-3">Creá tu perfil y empezá a tomar control</h2>
          <p class="text-green-100">Configurá tu cuenta en minutos y accedé a todas las herramientas.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { db } from '../services/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import BaseInputs from '../components/BaseInputs.vue';

export default {
  name: 'Register',
  components: { BaseInputs },
  data() {
    return {
      user: {
        nombreDeUsuario: '',
        email: '',
        password: '',
      },
      confirmPassword: '',
      loading: false,
      googleLoading: false,
      successMessage: '',
      errorMessage: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      cuentaCreada: false,
      touched: {
        email: false,
        password: false,
        confirmPassword: false,
      },
    };
  },
  computed: {
    passwordChecks() {
      const p = this.user.password || '';
      return {
        length: p.length >= 8,
        upper: /[A-Z]/.test(p),
        number: /[0-9]/.test(p),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(p),
      };
    },
    emailIcon() {
      if (!this.user.email) return '•';
      return this.emailError ? '❌' : '✅';
    },
    passwordIcon() {
      if (!this.user.password) return '•';
      return this.passwordError ? '❌' : '✅';
    },
    confirmIcon() {
      if (!this.confirmPassword) return '•';
      return this.confirmPasswordError ? '❌' : '✅';
    },
  },
  methods: {
    validateEmail() {
      this.emailError = '';
      if (!this.user.email) {
        this.emailError = 'El correo electrónico es obligatorio.';
      } else if (!/\S+@\S+\.\S+/.test(this.user.email)) {
        this.emailError = 'Ingresá un correo válido (ej: nombre@dominio.com).';
      }
    },

    validatePassword() {
      this.passwordError = '';
      const checks = this.passwordChecks;
      if (!this.user.password) {
        this.passwordError = 'La contraseña es obligatoria.';
      } else if (!checks.length || !checks.upper || !checks.number || !checks.special) {
        this.passwordError = 'Tu contraseña no cumple todos los requisitos.';
      }
      this.validateConfirmPassword();
    },

    validateConfirmPassword() {
      this.confirmPasswordError = '';
      if (!this.confirmPassword) {
        this.confirmPasswordError = 'Confirmá tu contraseña.';
      } else if (this.confirmPassword !== this.user.password) {
        this.confirmPasswordError = 'Las contraseñas no coinciden.';
      }
    },

    validateForm() {
      this.validateEmail();
      this.validatePassword();
      this.validateConfirmPassword();
      this.touched.email = true;
      this.touched.password = true;
      this.touched.confirmPassword = true;
      return !this.emailError && !this.passwordError && !this.confirmPasswordError;
    },

    async createUserDocIfNeeded({ uid, email, nombreDeUsuario }) {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', uid));
      const existing = await getDocs(q);
      if (!existing.empty) return;

      await addDoc(usersRef, {
        uid,
        email,
        nombreDeUsuario: nombreDeUsuario || '',
      });
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
        await setPersistence(auth, browserLocalPersistence);

        const userCredential = await createUserWithEmailAndPassword(auth, this.user.email, this.user.password);

        await this.createUserDocIfNeeded({
          uid: userCredential.user.uid,
          email: this.user.email,
          nombreDeUsuario: this.user.nombreDeUsuario.trim(),
        });

        this.successMessage = '¡Cuenta creada con éxito!';
        this.cuentaCreada = true;

        this.user = { nombreDeUsuario: '', email: '', password: '' };
        this.confirmPassword = '';

        setTimeout(() => {
          this.$router.push({ path: '/Monto-Total' });
        }, 1200);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = 'Ese correo ya está registrado. Probá iniciar sesión.';
        } else if (error.code === 'auth/weak-password') {
          this.errorMessage = 'La contraseña es débil. Usá una más segura.';
        } else {
          this.errorMessage = 'No se pudo crear la cuenta. Intentá nuevamente.';
        }
      } finally {
        this.loading = false;
        setTimeout(() => {
          this.cuentaCreada = false;
        }, 2500);
      }
    },

    async handleGoogleRegister() {
      this.errorMessage = '';
      this.successMessage = '';
      this.googleLoading = true;
      try {
        const auth = getAuth();
        await setPersistence(auth, browserLocalPersistence);
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        await this.createUserDocIfNeeded({
          uid: result.user.uid,
          email: result.user.email || '',
          nombreDeUsuario: result.user.displayName || '',
        });

        this.successMessage = 'Registro con Google exitoso.';
        setTimeout(() => {
          this.$router.push({ path: '/Monto-Total' });
        }, 1000);
      } catch (error) {
        if (error.code === 'auth/popup-closed-by-user') {
          this.errorMessage = 'Cerraste la ventana de Google antes de completar el registro.';
        } else {
          this.errorMessage = 'No se pudo registrar con Google. Probá nuevamente.';
        }
      } finally {
        this.googleLoading = false;
      }
    },
  },
};
</script>