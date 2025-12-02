<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-[#08a04b]  py-12 px-6 mt-8">
    <!-- Card principal -->
    <div
      class="bg-white/95 backdrop-blur-sm rounded-3xl p-10 grid gap-8 w-full max-w-lg shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_45px_rgba(0,0,0,0.45)] transition-shadow duration-500 border border-white/20"
    >
      <!-- Encabezado -->
      <BaseHeading class="text-center text-gray-800">Mi Perfil</BaseHeading>

      <!-- Sección foto -->
      <div class="flex flex-col items-center">
        <img
          :src="profileImageUrl || 'https://placehold.co/150'"
          alt="Foto de perfil"
          class="w-32 h-32 rounded-full border-4 border-gray-200 object-cover shadow-md mb-4"
        />

        <!-- Mensajes de feedback -->
        <transition name="fade">
          <p v-if="saveSuccess" class="text-green-600 text-sm mb-2 font-medium">
            Imagen guardada con éxito
          </p>
        </transition>
        <transition name="fade">
          <p v-if="saveError" class="text-red-600 text-sm mb-2 font-medium">
            Error al guardar la imagen
          </p>
        </transition>

        <!-- Subir imagen -->
        <input
          type="file"
          @change="uploadImage"
          class="mb-6 w-full rounded-xl border border-gray-300 bg-gray-50 text-gray-700 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 transition"
        />

        <!-- Botón guardar -->
        <BaseButtonSecondary
          @click="saveImageUrl"
          :disabled="!selectedImage"
          class="cursor-pointer mb-6 px-6 py-2 rounded-xl shadow-sm hover:shadow-md transition font-semibold"
        >
          Guardar imagen
        </BaseButtonSecondary>
      </div>

      <!-- Info usuario -->
<div class="text-left w-full mb-6 bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm">
  <div class="flex flex-col gap-2 text-gray-700">
    <div class="flex gap-1">
      <strong>Nombre de Usuario:</strong>
      <span class="font-medium">
        {{ nombreDeUsuario || 'Sin completar' }}
      </span>
    </div>
    <div class="flex gap-1">
      <strong>Email:</strong>
      <span class="font-medium">
        {{ email }}
      </span>
    </div>
  </div>
</div>

      <!-- Total gastado -->
      <div class="bg-gradient-to-r from-rose-50 to-red-50 p-6 rounded-2xl w-full text-center border border-red-100 shadow-inner">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Total gastado</h2>
        <p class="text-3xl font-extrabold text-red-600">
          $ {{ totalGastado.toLocaleString('es-AR') }}
        </p>
      </div>
    </div>
  </div>
</template>




<script>
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { IMGBB_API_KEY } from "../config"; 
import BaseHeading from "../components/BaseHeading.vue";
import BaseButtonSecondary from "../components/BaseButtonSecondary.vue";

export default {
  components: { BaseHeading, BaseButtonSecondary },
  data() {
    return {
      selectedImage: null,
      profileImageUrl: "",
      userId: null,
 
      email: "",
      nombreDeUsuario: "",
      totalGastado: 0, 
      saveSuccess: false, 
      saveError: false,   
      
    };
  },
  async created() {
    this.userId = auth.currentUser?.uid;
    if (this.userId) {
      await this.loadUserProfile();
      await this.calcularTotalGastado();
      await this.loadNotifications(); 
    }
  },
  methods: {
    async loadUserProfile() {
      if (!this.userId) return;
      try {
        const q = query(collection(db, "users"), where("uid", "==", this.userId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          this.profileImageUrl = userData.profileImageUrl || "";
        
          this.email = userData.email || "";
          this.nombreDeUsuario = userData.nombreDeUsuario || "";
        }
      } catch (error) {
        console.error("🚨 Error al obtener el perfil del usuario:", error);
      }
    },
    async calcularTotalGastado() {
      if (!this.userId) return;
      try {
        const q = query(collection(db, "gastos"), where("uid", "==", this.userId));
        const querySnapshot = await getDocs(q);
        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.amount) total += data.amount;
        });
        this.totalGastado = total;
      } catch (error) {
        console.error("🚨 Error al calcular los gastos:", error);
      }
    },
    async uploadImage(event) {
      const file = event.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("image", file);
      this.selectedImage = file;
      try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          this.profileImageUrl = data.data.url;
        } else {
          console.error("❌ Error al subir la imagen", data);
        }
      } catch (error) {
        console.error("🚨 Error en la subida:", error);
      }
    },
    async saveImageUrl() {
      if (!this.profileImageUrl || !this.userId) return;
      try {
        const q = query(collection(db, "users"), where("uid", "==", this.userId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDocRef = doc(db, "users", querySnapshot.docs[0].id);
          await updateDoc(userDocRef, { profileImageUrl: this.profileImageUrl });
          this.saveSuccess = true;
          this.saveError = false;
          setTimeout(() => { this.saveSuccess = false; }, 3000);
        }
      } catch (error) {
        this.saveError = true;
        this.saveSuccess = false;
        setTimeout(() => { this.saveError = false; }, 3000);
        console.error("🚨 Error al guardar la imagen en Firestore:", error);
      }
    },

   

    formatCurrency(value) {
      const n = parseFloat(value);
      if (isNaN(n)) return "$0";
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(n);
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
