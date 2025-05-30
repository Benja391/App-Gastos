<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-700 p-6">
    <div class="bg-green-200 rounded-2xl shadow-2xl p-6 w-full max-w-md">
      <BaseHeading>Mi Perfil</BaseHeading>

  
      

      <div class="flex flex-col items-center">
 
        <img
          :src="profileImageUrl || 'https://placehold.co/150'"
          alt="Foto de perfil"
          class="w-32 h-32 rounded-full border-4 border-gray-300 object-cover mb-4"
        />

        <p v-if="saveSuccess" class="text-green-600 text-sm mb-2">✅ Imagen guardada con éxito</p>
        <p v-if="saveError" class="text-red-600 text-sm mb-2">❌ Error al guardar la imagen</p>

        <input  
          type="file" 
          @change="uploadImage" 
          class="mb-6 w-full rounded-xl border border-gray-500 bg-gray-800 text-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700 transition"       
        />

        <BaseButtonSecondary
          @click="saveImageUrl"
          :disabled="!selectedImage"
          class="cursor-pointer mb-6"
        >
          Guardar Imagen
        </BaseButtonSecondary>

    
        <div class="text-left w-full mb-6">
          <p class="text-black"><strong>Nombre:</strong> {{ nombre }}</p>
          <p class="text-black"><strong>Apellido:</strong> {{ apellido }}</p>
          <p class="text-black"><strong>Nombre de Usuario:</strong> {{ nombreDeUsuario }}</p>
          <p class="text-black"><strong>Email:</strong> {{ email }}</p>
        </div>

      
        <div class="bg-gray-400 p-4 rounded-lg w-full text-center">
          <h2 class="text-lg font-semibold text-gray-800">📊 Total Gastado</h2>
          <p class="text-xl font-bold text-red-600">$ {{ totalGastado.toLocaleString('es-AR') }}</p>
        </div>
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
      nombre: "",
      apellido: "",
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
          this.nombre = userData.nombre || "";
          this.apellido = userData.apellido || "";
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
