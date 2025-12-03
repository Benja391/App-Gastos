<template>
  <nav
    class="flex justify-between items-center px-6 py-9 bg-green-200  text-gray-900 mb-4 relative rounded-3xl mx-1 mt-3 border border-green-500 "
  >
    
    <p class="text-2xl">
      <router-link to="/" @click="closeMenu">
        <img class="w-50 h-40 mt-5" src="/logo-tres.png" alt="Logo" />
      </router-link>
    </p>

    <div class="md:hidden">
      <button
        @click="toggleMenu"
        ref="menuButton"
        class="text-gray-700 hover:text-white hover:bg-green-600 p-3 rounded-2xl transition-all duration-300 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="h-6 w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

   <ul class="hidden md:flex flex-wrap items-center">
      <li>
        <router-link
          class="block py-2 px-4 rounded-2xl font-medium hover:bg-green-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          to="/"
          @click="closeMenu"
          >Inicio</router-link
        >
      </li>
      <li>
        <router-link
          class="block py-2 px-4 rounded-2xl font-medium hover:bg-green-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          to="/Presupuestos"
          @click="closeMenu"
          >Presupuestos</router-link
        >
      </li>
      <li>
        <router-link
          class="py-2 whitespace-nowrap px-3 inline-block rounded-2xl font-medium hover:bg-green-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          to="/monto-total"
          @click="closeMenu"
          >Ingresos totales</router-link
        >
      </li>
      <li>
        <button
          @click="irACargarGasto"
          class="py-2 px-5 inline-block whitespace-nowrap rounded-xl font-medium text-green-700 border bg-white hover:bg-green-100 transition duration-200"
        >
          <span class="flex items-center gap-2">Cargar gasto</span>
        </button>
      </li>
      <li>
        <router-link
          class="py-2 whitespace-nowrap px-3 inline-block rounded-2xl font-medium hover:bg-green-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          to="/Historial-Gastos"
          @click="closeMenu"
          >Historial de gastos</router-link
        >
      </li>
      <li>
        <router-link
          class="block py-2 px-4 rounded-2xl font-medium hover:bg-green-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          to="/Graficos"
          @click="closeMenu"
          >Gráficos</router-link
        >
      </li>
      <li>
        <router-link
          class="py-2 whitespace-nowrap px-3 inline-block rounded-2xl font-medium hover:bg-green-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          to="/Calendario-Pagos"
          @click="closeMenu"
          >Calendario de pagos</router-link
        >
      </li>
      <li v-if="userId">
        <router-link
          class="block py-2 px-4 rounded-2xl font-medium whitespace-nowrap hover:bg-green-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          to="/Mi-Perfil"
          @click="closeMenu"
        >
          Mi perfil
        </router-link>
      </li>
      <li v-if="userId">
        <button
          @click="logout"
          class="py-3 whitespace-nowrap px-3 inline-block text-red-600 hover:text-white hover:bg-red-500 font-medium rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ml-2"
        >
          Cerrar sesión
        </button>
      </li>
      <li v-if="!userId && !loading" class="ml-2">
        <router-link
          class="block py-3 px-4 rounded-2xl font-medium bg-green-600 text-white hover:bg-green-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          to="/iniciar-sesion"
          @click="closeMenu"
          >Iniciar sesión</router-link
        >
      </li>
      <li v-if="!userId && !loading" class="ml-2">
        <router-link
          class="block py-3 px-4 rounded-2xl font-medium bg-green-600 text-white hover:bg-green-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          to="/registrarse"
          @click="closeMenu"
          >Registrarse</router-link
        >
      </li>
    </ul>

    <transition name="fade-slide">
      <ul
        v-show="isMenuOpen"
        ref="menu"
        class="absolute top-full right-0 w-80 bg-white backdrop-blur-lg flex flex-col items-end px-6 py-4 gap-3 lg:hidden z-50 rounded-3xl shadow-2xl border border-gray-100 mt-2"
      >
        <li class="w-full text-right">
          <router-link
            @click="closeMenu"
            class="block py-2 px-4 rounded-2xl hover:bg-green-600 hover:text-white transition-all duration-300 font-medium"
            to="/"
            >Inicio</router-link
          >
        </li>
        <li class="w-full text-right">
          <router-link
            @click="closeMenu"
            class="block py-2 px-4 rounded-2xl hover:bg-green-600 hover:text-white transition-all duration-300 font-medium"
            to="/Presupuestos"
            >Presupuestos</router-link
          >
        </li>
        <li class="w-full text-right">
          <router-link
            @click="closeMenu"
            class="block py-2 px-4 rounded-2xl hover:bg-green-600 hover:text-white transition-all duration-300 font-medium"
            to="/monto-total"
            >Ingresos totales</router-link
          >
        </li>
        <li>
          <button
            @click="() => { irACargarGasto(); closeMenu(); }"
            class="py-2 px-5 inline-block whitespace-nowrap rounded-xl font-medium text-green-700 border bg-white hover:bg-green-100 transition duration-200"
          >
            <span class="flex items-center gap-2">Cargar gasto</span>
          </button>
        </li>
        <li class="w-full text-right">
          <router-link
            @click="closeMenu"
            class="block py-2 px-4 rounded-2xl hover:bg-green-600 hover:text-white transition-all duration-300 font-medium"
            to="/Historial-Gastos"
            >Historial de gastos</router-link
          >
        </li>
        <li class="w-full text-right">
          <router-link
            @click="closeMenu"
            class="block py-2 px-4 rounded-2xl hover:bg-green-600 hover:text-white transition-all duration-300 font-medium"
            to="/Graficos"
            >Gráficos</router-link
          >
        </li>
        <li class="w-full text-right">
          <router-link
            @click="closeMenu"
            class="block py-2 px-4 rounded-2xl hover:bg-green-600 hover:text-white transition-all duration-300 font-medium"
            to="/Calendario-Pagos"
            >Calendario de pagos</router-link
          >
        </li>
        <li v-if="userId">
          <router-link
            class="block py-2 px-4 rounded-2xl font-medium hover:bg-green-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            to="/Mi-Perfil"
            @click="closeMenu"
          >
            Mi perfil
          </router-link>
        </li>

        <div class="w-full border-t border-gray-200 my-2"></div>

        <li
          v-if="userName"
          class="font-semibold text-gray-700 bg-green-50 py-3 px-4 rounded-2xl w-full text-right"
        >
          ¡Hola, {{ userName }}!
        </li>
        <li v-if="userName" class="w-full text-right">
          <button
            @click="() => { logout(); closeMenu(); }"
            class="text-red-600 hover:text-white hover:bg-red-500 py-3 px-4 rounded-2xl font-medium transition-all duration-300 w-full text-right"
          >
            Cerrar sesión
          </button>
        </li>
        <li v-if="!userName && !loading" class="w-full text-right">
          <router-link
            @click="closeMenu"
            class="block py-3 px-4 rounded-2xl font-medium bg-green-600 text-white hover:bg-green-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            to="/iniciar-sesion"
            >Iniciar Sesión</router-link
          >
        </li>
        <li v-if="!userName && !loading" class="w-full text-right">
          <router-link
            @click="closeMenu"
            class="block py-3 px-4 rounded-2xl font-medium bg-green-600 text-white hover:bg-green-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            to="/registrarse"
            >Registrarse</router-link
          >
        </li>
        <li v-if="loading" class="text-gray-600 py-3 px-4 w-full text-right">
          Cargando...
        </li>
      </ul>
    </transition>
  </nav>

  <main class="p-0">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </main>

  <footer
    class="rounded-3xl shadow-2xl mt-8 mx-4 mb-4 border border-gray-100"
  >
    <div
      class="w-full rounded-3xl text-gray-700 bg-white px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left"
    >
      <div>
        <h4 class="text-3xl text-green-800 mb-6">
          App <strong class="text-black font-bold">GASTOS</strong>
        </h4>
        <p class="text-gray-600 leading-relaxed mb-6">
          Una app pensada para jóvenes que inician su vida independiente.<br />
          Controlá tus finanzas, ahorrá mejor y planificá tu futuro de forma
          simple y eficiente.
        </p>
        <p class="text-sm text-gray-500">
          &copy; 2025 App <strong class="font-bold">GASTOS</strong>. Todos los
          derechos reservados.
        </p>
      </div>
      <div>
        <h4 class="text-xl font-semibold text-gray-900 mb-6">
          Navegación rápida
        </h4>
        <ul
          class="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600"
        >
          <li>
            <router-link
              to="/"
              class="hover:text-green-600 transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-green-50"
              >Inicio</router-link
            >
          </li>
          <li>
            <router-link
              to="/Presupuestos"
              class="hover:text-green-600 transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-green-50"
              >Presupuestos</router-link
            >
          </li>
          <li>
            <router-link
              to="/Graficos"
              class="hover:text-green-600 transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-green-50"
              >Gráficos</router-link
            >
          </li>
          <li>
            <router-link
              to="/monto-total"
              class="hover:text-green-600 transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-green-50"
              >Ingresos</router-link
            >
          </li>
          <li>
            <router-link
              to="/Calendario-Pagos"
              class="hover:text-green-600 transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-green-50"
              >Calendario</router-link
            >
          </li>
          <li>
            <router-link
              to="/Historial-Gastos"
              class="hover:text-green-600 transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-green-50"
              >Historial</router-link
            >
          </li>
        </ul>
      </div>
      <div>
        <h4 class="text-xl font-semibold text-gray-900 mb-6">Seguinos</h4>
        <p class="text-gray-600 mb-6 leading-relaxed">
          Enterate de todas las novedades y tips de ahorro.
        </p>
        <div class="flex justify-center md:justify-start space-x-4">
          <a
            href="#"
            class="p-3 bg-gray-100 rounded-2xl hover:bg-green-600 hover:scale-110 transition-all duration-300 group"
          >
            <img
              src="/facebook.png"
              alt="Facebook"
              class="w-6 h-6 group-hover:brightness-0 group-hover:invert transition-all duration-300"
            />
          </a>
          <a
            href="#"
            class="p-3 bg-gray-100 rounded-2xl hover:bg-green-600 hover:scale-110 transition-all duration-300 group"
          >
            <img
              src="/Logo-Twitter.png"
              alt="Twitter"
              class="w-6 h-6 group-hover:brightness-0 group-hover:invert transition-all duration-300"
            />
          </a>
          <a
            href="#"
            class="p-3 bg-gray-100 rounded-2xl hover:bg-green-600 hover:scale-110 transition-all duration-300 group"
          >
            <img
              src="/logotipo-de-instagram.png"
              alt="Instagram"
              class="w-6 h-6 group-hover:brightness-0 group-hover:invert transition-all duration-300"
            />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "./services/firebase";
import { onSnapshot, collection, query, where, getDocs } from "firebase/firestore";
import Notificaciones from "./components/Notificaciones.vue";

export default {
  components: {
    Notificaciones,
  },

  data() {
    return {
      isMenuOpen: false,
      userId: null,
      userName: null,
      loading: true,
      badgeCount: 0, // 👈 Solo el contador del badge
      showNotifications: false, // 👈 Solo el estado del modal
      intervaloVerificacion: null, // 👈 NUEVO
    };
  },

  // 🗑️ QUITA EL COMPUTED - ya no manejas notificaciones aquí

  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userId = user.uid;
        await this.loadUserInfo(user.uid);

        // 🆕 Suscribirse a cambios en la subcolección de notificaciones no leídas
        this.suscribirseNotificaciones(user.uid);

        // 👇 NUEVO: Verificar notificaciones al cargar la app
        setTimeout(() => {
          this.verificarNotificacionesIniciales();
        }, 2000);
      } else {
        this.userId = this.userName = null;
        this.badgeCount = 0;
      }
      this.loading = false;
    });
    document.addEventListener("click", this.handleClickOutside);
  },

  async verificarNotificacionesIniciales() {
    console.log("🔔 Verificando notificaciones iniciales...");
    const { collection, query, where, getDocs } = await import("firebase/firestore");
    const { db } = await import("./services/firebase");
    try {
      // Verificación rápida de presupuestos excedidos
      const gastosSnapshot = await getDocs(query(collection(db, "gastos"), where("uid", "==", this.userId)));
      const presupuestosSnapshot = await getDocs(query(collection(db, "Presupuestos"), where("uid", "==", this.userId)));

      if (gastosSnapshot.docs.length > 0 && presupuestosSnapshot.docs.length > 0) {
        // Si hay datos, hay posibles notificaciones
        this.badgeCount = 1; // Mostrar indicador
        console.log("🔔 Hay datos para verificar notificaciones");
      }
    } catch (error) {
      console.error("🔔 Error verificando notificaciones iniciales:", error);
    }
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
    if (this.unsubscribeNotificaciones) this.unsubscribeNotificaciones();
  },

  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },

    closeMenu() {
      this.isMenuOpen = false;
    },

    // 🔔 SOLO MANEJA EL MODAL

    suscribirseNotificaciones(uid) {
      const notificacionesRef = collection(db, `users/${uid}/notificaciones`);
      const q = query(notificacionesRef, where("leida", "==", false));

      this.unsubscribeNotificaciones?.(); // Limpia si ya existe

      this.unsubscribeNotificaciones = onSnapshot(q, (snapshot) => {
        this.badgeCount = snapshot.size;
      });
    },

    toggleNotifications() {
      console.log("Toggle notificaciones:", !this.showNotifications);
      console.log("UserId actual:", this.userId); // 👈 AGREGÁ ESTE
      this.showNotifications = !this.showNotifications;
      console.log("showNotifications después del toggle:", this.showNotifications); // 👈 Y ESTE
    },

    // 🔔 RECIBE UPDATES DEL BADGE DESDE EL COMPONENTE
    actualizarBadge(count) {
      console.log("Actualizando badge:", count);
      this.badgeCount = count;
    },

    handleClickOutside(event) {
      // Manejo del menú
      const menu = this.$refs.menu;
      const btn = this.$refs.menuButton;

      if (this.isMenuOpen && menu && !menu.contains(event.target) && btn && !btn.contains(event.target)) {
        this.isMenuOpen = false;
      }

      // Manejo de notificaciones
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
        // 🗑️ QUITA la notificación de prueba - ahora se maneja en Notificaciones.vue
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

    irACargarGasto() {
      this.$router.push("/cargar-gasto");
    },
  },
};
</script>

<style>
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
