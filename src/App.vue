<template>
  <nav class="flex justify-between items-center p-6 bg-[#2dcc70] text-black mb-2 relative shadow-md rounded-2xl font-roboto">
    <p class="text-2xl">
      <router-link to="/">
        <img class="w-50 h-40 mt-5" src="/logo-tres.png" alt="Logo" />
      </router-link>
    </p>

    <div class="lg:hidden">
      <button
        @click="toggleMenu"
        ref="menuButton"
        class="text-slate-800 hover:text-white hover:bg-[#10b981] p-2 rounded-md transition duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>

    <ul class="hidden lg:flex gap-4 items-center">
      <li>
        <router-link
          class="block py-1 px-2 rounded-md hover:bg-black hover:text-[#88ffb9] transition duration-300"
          to="/"
        >Home</router-link>
      </li>
      <li>
        <router-link
          class="block py-1 px-2 rounded-md hover:bg-black hover:text-[#88ffb9] transition duration-300"
          to="/Presupuestos"
        >Presupuestos</router-link>
      </li>
      <li>
        <router-link
          class="block py-1 px-2 rounded-md hover:bg-black hover:text-[#88ffb9] transition duration-300"
          to="/monto-total"
        >Ingresos totales</router-link>
      </li>
      <li>
        <router-link
          class="block py-1 px-2 rounded-md hover:bg-black hover:text-[#88ffb9] transition duration-300"
          to="/Historial-Gastos"
        >Historial de gastos</router-link>
      </li>
      <li>
        <router-link
          class="block py-1 px-2 rounded-md hover:bg-black hover:text-[#88ffb9] transition duration-300"
          to="/Graficos"
        >Gráficos</router-link>
      </li>
      <li>
        <router-link
          class="block py-1 px-2 rounded-md hover:bg-black hover:text-[#88ffb9] transition duration-300"
          to="/Calendario-Pagos"
        >Calendario de pagos</router-link>
      </li>
     

     
   <li v-if="userId" class="relative">
  <button
    ref="notificationButton"
    @click="toggleNotifications"
    aria-label="Mostrar notificaciones"
    class="p-2 rounded-full hover:bg-black hover:text-[#88ffb9] transition relative"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"/>
      <path d="M14 14a2 2 0 11-4 0h4z"/>
    </svg>
    <span
      v-if="badgeCount > 0"
      class="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-w-[18px]"
    >
      {{ badgeCount }}
    </span>
  </button>
  
  <Notificaciones
    v-if="showNotifications"
    ref="notificationWrapper"
    :userId="userId"
    @close="showNotifications = false"
    @badge-update="actualizarBadge"
  />


        </li>

      <li v-if="userName" class="py-1 px-2 font-semibold">¡Hola, {{ userName }}!</li>
      <li v-if="userId">
        <button @click="logout" class="block py-1 px-2 text-red-600 hover:text-red-800">Cerrar sesión</button>
      </li>

      <li v-if="!userId && !loading">
        <router-link
          class="block py-1 px-2 rounded-md hover:bg-white hover:text-black transition duration-300"
          to="/iniciar-sesion"
        >Iniciar sesión</router-link>
      </li>
      <li v-if="!userId && !loading">
        <router-link
          class="block py-1 px-2 rounded-md hover:bg-white hover:text-black transition duration-300"
          to="/registrarse"
        >Registrarse</router-link>
      </li>
    </ul>

   
    <transition name="fade-slide">
      <ul
        v-show="isMenuOpen"
        ref="menu"
        class="absolute top-full right-0 w-80 bg-gradient-to-r from-[#34d399] to-[#10b981] flex flex-col items-end px-4 py-2 gap-2 lg:hidden z-50 rounded-bl-3xl shadow-md"
      >
        <li>
          <router-link
            @click="closeMenu"
            class="block py-1 px-2 rounded-md hover:bg-black hover:text-[#88ffb9] transition duration-300"
            to="/"
          >Home</router-link>
        </li>
        <li>
          <router-link
            @click="closeMenu"
            class="block py-1 px-2 rounded-md hover:bg-black hover:text-[#88ffb9] transition duration-300"
            to="/Presupuestos"
          >Presupuestos</router-link>
        </li>
        <li>
          <router-link
            @click="closeMenu"
            class="block py-1 px-2 rounded-md hover:bg-black hover:text-[#88ffb9] transition duration-300"
            to="/monto-total"
          >Ingresos totales</router-link>
        </li>
        <li>
          <router-link
            @click="closeMenu"
            class="block py-1 px-2 rounded-md hover:bg-black hover:text-[#88ffb9] transition duration-300"
            to="/Historial-Gastos"
          >Historial de gastos</router-link>
        </li>
        <li>
          <router-link
            @click="closeMenu"
            class="block py-1 px-2 rounded-md hover:bg-black hover:text-[#88ffb9] transition duration-300"
            to="/Graficos"
          >Gráficos</router-link>
        </li>
        <li>
          <router-link
            @click="closeMenu"
            class="block py-1 px-2 rounded-md hover:bg-black hover:text-[#88ffb9] transition duration-300"
            to="/Calendario-Pagos"
          >Calendario de pagos</router-link>
        </li>
      

        <li v-if="userName" class="font-semibold">¡Hola, {{ userName }}!</li>
        <li v-if="userName">
          <button @click="logout" class="text-red-600 hover:text-red-800">Cerrar sesión</button>
        </li>
        <li v-if="!userName && !loading">
          <router-link
            @click="closeMenu"
            class="block py-1 px-2 rounded-md hover:bg-white hover:text-black transition duration-300"
            to="/iniciar-sesion"
          >Iniciar Sesión</router-link>
        </li>
        <li v-if="!userName && !loading">
          <router-link
            @click="closeMenu"
            class="block py-1 px-2 rounded-md hover:bg-white hover:text-black transition duration-300"
            to="/registrarse"
          >Registrarse</router-link>
        </li>
        <li v-if="loading">Cargando...</li>
      </ul>
    </transition>
  </nav>

  <main class="p-0">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </main>

  <footer class="rounded-t-2xl shadow-inner mt-2">
    <div class="w-full rounded-2xl text-black bg-gray-700 px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
      <div>
        <h4 class="text-2xl font-bold text-white mb-4">App <strong class="text-black">GASTOS</strong></h4>
        <p class="text-sm text-gray-300">
          Una app pensada para jóvenes que inician su vida independiente.<br />
          Controlá tus finanzas, ahorrá mejor y planificá tu futuro de forma simple y eficiente.
        </p>
        <p class="text-xs text-gray-400 mt-4">&copy; 2025 App GASTOS. Todos los derechos reservados.</p>
      </div>
      <div>
        <h4 class="text-lg font-semibold text-white mb-4">Navegación rápida</h4>
        <ul class="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-300">
          <li><router-link to="/" class="hover:text-white transition-colors">Inicio</router-link></li>
          <li><router-link to="/Presupuestos" class="hover:text-white transition-colors">Presupuestos</router-link></li>
          <li><router-link to="/Graficos" class="hover:text-white transition-colors">Gráficos</router-link></li>
       
          <li><router-link to="/monto-total" class="hover:text-white transition-colors">Ingresos</router-link></li>
          <li><router-link to="/Calendario-Pagos" class="hover:text-white transition-colors">Calendario</router-link></li>
          <li><router-link to="/Historial-Gastos" class="hover:text-white transition-colors">Historial</router-link></li>
        </ul>
      </div>
      <div>
        <h4 class="text-lg font-semibold text-white mb-4">Seguinos</h4>
        <p class="text-sm text-gray-300 mb-4">Enterate de todas las novedades y tips de ahorro.</p>
        <div class="flex justify-center md:justify-start space-x-5 text-xl">
          <a href="#" class="hover:scale-110 transition-transform"><img src="/facebook.png" alt="Facebook" class="w-8 h-8" /></a>
          <a href="#" class="hover:scale-110 transition-transform"><img src="/Logo-Twitter.png" alt="Twitter" class="w-8 h-8" /></a>
          <a href="#" class="hover:scale-110 transition-transform"><img src="/logotipo-de-instagram.png" alt="Instagram" class="w-8 h-8" /></a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "./services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Notificaciones from "./components/Notificaciones.vue";

export default {
  components: {
    Notificaciones
  },
  
  data() {
    return {
      isMenuOpen: false,
      userId: null,
      userName: null,
      loading: true,
      badgeCount: 0,           
      showNotifications: false, 
      intervaloVerificacion: null, 
    };
  },
  
  
 mounted() {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      this.userId = user.uid;
      await this.loadUserInfo(user.uid);
      
      
      this.iniciarVerificacionAutomatica();
      
    } else {
      this.userId = this.userName = null;
      this.badgeCount = 0;
      
      
      this.detenerVerificacionAutomatica();
    }
    this.loading = false;
  });
  document.addEventListener("click", this.handleClickOutside);
},

beforeUnmount() {
  document.removeEventListener("click", this.handleClickOutside);
  this.detenerVerificacionAutomatica(); 
},
  
  
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen; 
      
    },

    
    
    
    
toggleNotifications() {
  console.log('Toggle notificaciones:', !this.showNotifications);
  console.log('UserId actual:', this.userId); 
  this.showNotifications = !this.showNotifications;
  console.log('showNotifications después del toggle:', this.showNotifications); 


    },
    
    
    actualizarBadge(count) {
      console.log('Actualizando badge:', count);
      this.badgeCount = count;
    },
    
   
    handleClickOutside(event) {
    
      const menu = this.$refs.menu;
      const btn = this.$refs.menuButton;
      
      if (this.isMenuOpen && menu && !menu.contains(event.target) && btn && !btn.contains(event.target)) {
        this.isMenuOpen = false;
      }
      
     
      const notifBtn = this.$refs.notificationButton;
      const notifWrapper = this.$refs.notificationWrapper;
      
      if (this.showNotifications && notifWrapper && notifBtn) {
        const notifElement = notifWrapper.$el || notifWrapper;
        
        if (!notifElement.contains(event.target) && !notifBtn.contains(event.target)) {
          this.showNotifications = false;
        }
      }
    },
    
    async loadUserInfo(uid) {
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        this.userName = snap.docs[0].data().nombreDeUsuario || null;
       
      }
    },
    
    formatCurrency(value) {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    },
    
    async logout() {
      const auth = getAuth();
      await signOut(auth);
      this.userName = null;
      this.$router.push("/");
      this.isMenuOpen = false;
    },
  }
};
</script>

<style >
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(50%);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(50%);
}
.router-link {
  transition: background-color 0.3s ease, color 0.3s ease;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
