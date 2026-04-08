<template>
  <section class="min-h-screen bg-[#08a04b] px-4 py-10 mt-8 flex items-center justify-center">
    <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white/95 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-white/40">
      <div class="hidden lg:flex relative items-end p-8 bg-gradient-to-br from-emerald-700 to-green-900 text-white">
        <img src="/imagen-primera.jpg" alt="Ilustración login" class="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div class="relative z-10">
          <p class="text-sm uppercase tracking-widest text-green-100 mb-2">Bienvenido de nuevo</p>
          <h2 class="text-4xl font-extrabold leading-tight mb-3">Entrá y seguí controlando tus finanzas</h2>
          <p class="text-green-100">Tus estadísticas, presupuestos y gastos están listos para vos.</p>
        </div>
      </div>

      <div class="p-6 md:p-10 bg-gray-950 text-white">
        <h1 class="text-3xl font-bold mb-2 text-center">Iniciá sesión</h1>
        <p class="text-center text-gray-400 mb-6">Accedé a tu cuenta en segundos.</p>

        <p v-if="$route.query.mensaje" class="text-amber-300 text-sm text-center mb-4">{{ $route.query.mensaje }}</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
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
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm" v-if="touched.email">
                {{ emailIcon }}
              </span>
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
                placeholder="Ingresá tu contraseña"
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500"
                @input="validatePassword"
                @blur="touched.password = true"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm" v-if="touched.password">
                {{ passwordIcon }}
              </span>
            </div>
            <p v-if="touched.password && passwordError" class="text-red-400 text-sm mt-1">{{ passwordError }}</p>
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="inline-flex items-center gap-2 text-gray-300">
              <input v-model="rememberMe" type="checkbox" class="rounded border-gray-500 text-green-600 focus:ring-green-500" />
              Recordarme
            </label>
            <button
              type="button"
              @click="handleResetPassword"
              :disabled="resetLoading"
              class="text-green-300 hover:text-green-200 underline disabled:opacity-50"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-green-600 rounded-xl font-bold hover:bg-green-500 transition disabled:opacity-60"
          >
            {{ loading ? 'Ingresando...' : 'Iniciá sesión' }}
          </button>

          <button
            type="button"
            @click="handleGoogleLogin"
            :disabled="googleLoading"
            class="w-full py-3 border border-white/30 rounded-xl font-semibold hover:bg-white/10 transition disabled:opacity-60"
          >
            {{ googleLoading ? 'Conectando con Google...' : 'Continuar con Google' }}
          </button>
        </form>

        <p v-if="errorMessage" class="text-red-400 mt-4 text-sm text-center">{{ errorMessage }}</p>
        <p v-if="successMessage" class="text-green-400 mt-4 text-sm text-center">{{ successMessage }}</p>

        <p class="text-center text-sm text-gray-300 mt-6">
          ¿No tenés una cuenta?
          <router-link to="/Registrarse" class="text-green-400 hover:underline hover:text-green-300">Registrate</router-link>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import BaseInputs from '../components/BaseInputs.vue';

export default {
  name: 'Login',
  components: { BaseInputs },
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
      rememberMe: true,
      loading: false,
      googleLoading: false,
      resetLoading: false,
      errorMessage: '',
      successMessage: '',
      emailError: '',
      passwordError: '',
      touched: {
        email: false,
        password: false,
      },
    };
  },
  computed: {
    emailIcon() {
      if (!this.user.email) return '•';
      return this.emailError ? '❌' : '✅';
    },
    passwordIcon() {
      if (!this.user.password) return '•';
      return this.passwordError ? '❌' : '✅';
    },
  },
  mounted() {
    const rememberedEmail = localStorage.getItem('remembered_login_email');
    if (rememberedEmail) {
      this.user.email = rememberedEmail;
    }
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
      if (!this.user.password) {
        this.passwordError = 'La contraseña es obligatoria.';
      } else if (this.user.password.length < 6) {
        this.passwordError = 'La contraseña debe tener al menos 6 caracteres.';
      }
    },

    validateForm() {
      this.validateEmail();
      this.validatePassword();
      this.touched.email = true;
      this.touched.password = true;
      return !this.emailError && !this.passwordError;
    },

    async findUserDoc(uid) {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    },

    async handleLogin() {
      this.errorMessage = '';
      this.successMessage = '';

      if (!this.validateForm()) return;

      this.loading = true;
      try {
        const auth = getAuth();
        await setPersistence(auth, this.rememberMe ? browserLocalPersistence : browserSessionPersistence);

        const userCredential = await signInWithEmailAndPassword(auth, this.user.email, this.user.password);
        const exists = await this.findUserDoc(userCredential.user.uid);

        if (!exists) {
          this.errorMessage = 'No encontramos tu perfil. Contactá soporte o registrate nuevamente.';
          return;
        }

        if (this.rememberMe) {
          localStorage.setItem('remembered_login_email', this.user.email);
        } else {
          localStorage.removeItem('remembered_login_email');
        }

        this.successMessage = '¡Bienvenido! Inicio de sesión exitoso.';
        setTimeout(() => {
          this.$router.push({ path: '/Monto-Total' });
        }, 1200);
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          this.errorMessage = 'No existe una cuenta con ese correo.';
        } else if (error.code === 'auth/wrong-password') {
          this.errorMessage = 'La contraseña es incorrecta.';
        } else if (error.code === 'auth/invalid-credential') {
          this.errorMessage = 'Las credenciales no son válidas. Revisá email y contraseña.';
        } else if (error.code === 'auth/too-many-requests') {
          this.errorMessage = 'Demasiados intentos. Probá de nuevo en unos minutos.';
        } else {
          this.errorMessage = 'No se pudo iniciar sesión. Intentá nuevamente.';
        }
      } finally {
        this.loading = false;
      }
    },

    async handleGoogleLogin() {
      this.errorMessage = '';
      this.successMessage = '';
      this.googleLoading = true;
      try {
        const auth = getAuth();
        await setPersistence(auth, this.rememberMe ? browserLocalPersistence : browserSessionPersistence);
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);

        this.successMessage = 'Ingreso con Google exitoso.';
        setTimeout(() => {
          this.$router.push({ path: '/Monto-Total' });
        }, 1000);
      } catch (error) {
        if (error.code === 'auth/popup-closed-by-user') {
          this.errorMessage = 'Cerraste la ventana de Google antes de completar el inicio.';
        } else {
          this.errorMessage = 'No se pudo iniciar con Google. Probá nuevamente.';
        }
      } finally {
        this.googleLoading = false;
      }
    },

    async handleResetPassword() {
      this.errorMessage = '';
      this.successMessage = '';
      this.validateEmail();
      this.touched.email = true;

      if (this.emailError) {
        this.errorMessage = 'Para recuperar tu contraseña, primero ingresá un email válido.';
        return;
      }

      this.resetLoading = true;
      try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, this.user.email);
        this.successMessage = 'Te enviamos un correo para restablecer tu contraseña.';
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          this.errorMessage = 'No existe una cuenta con ese correo.';
        } else {
          this.errorMessage = 'No se pudo enviar el correo de recuperación.';
        }
      } finally {
        this.resetLoading = false;
      }
    },
  },
};
</script>