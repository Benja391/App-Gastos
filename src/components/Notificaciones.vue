<template>
  <div 
    ref="notificationModal"
    class="fixed top-16 right-4 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-w-sm w-80 z-50"
  >
    <div class="flex justify-between items-center p-4 border-b border-gray-600">
      <h3 class="text-white font-semibold">Notificaciones</h3>
      <button 
        @click="$emit('close')"
        class="text-gray-400 hover:text-white"
        aria-label="Cerrar notificaciones"
      >
        ✕
      </button>
    </div>

    <div class="max-h-64 overflow-y-auto">
      <div v-if="cargando" class="p-4 text-gray-400 text-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto"></div>
        <p class="mt-2 text-sm">Cargando notificaciones...</p>
      </div>

      <div v-else-if="notificaciones.length === 0" class="p-4 text-gray-400 text-center">
        <div class="text-3xl mb-2">🔔</div>
        <p>No hay notificaciones</p>
      </div>

      <div v-else>
        <div v-for="notif in notificaciones" :key="notif.id" 
             class="p-3 border-b border-gray-700 hover:bg-gray-700 transition-colors">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center">
                <span :class="{
                  'text-red-400': notif.tipo === 'error',
                  'text-yellow-400': notif.tipo === 'warning', 
                  'text-green-400': notif.tipo === 'info'
                }" class="font-medium">
                  {{ notif.titulo }}
                </span>
              </div>
              <p class="text-gray-300 text-sm mt-1">{{ notif.mensaje }}</p>
              <p class="text-gray-500 text-xs mt-1">{{ formatearFecha(notif.fecha?.toDate?.() || notif.fecha) }}</p>
            </div>
            <button 
              @click="eliminarNotificacion(notif.id)"
              class="text-gray-400 hover:text-red-400 ml-2 transition-colors"
              aria-label="Eliminar notificación"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!cargando && notificaciones.length > 0" class="p-3 border-t border-gray-600">
   <button 
  @click="marcarTodasComoLeidas"
  class="w-full px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded transition-colors"
>
  Marcar todas como leídas
</button>
    </div>
  </div>
</template>

<script>
import { db } from '../services/firebase';

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDocs
} from 'firebase/firestore';
export default {
  name: 'Notificaciones',
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  emits: ['close', 'badge-update'],
  data() {
    return {
      notificaciones: [],
      cargando: false,
      unsubscribe: null
    };
  },
  async mounted() {
    this.cargando = true;
    try {
      this.suscribirseNotificaciones();
    } catch (error) {
      console.error('❌ Error al suscribirse a notificaciones:', error);
    } finally {
      this.cargando = false;
    }
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  },
  methods: {
    suscribirseNotificaciones() {
      const ref = collection(db, 'users', this.userId, 'notificaciones');
      const q = query(ref, orderBy('fecha', 'desc'));

      this.unsubscribe = onSnapshot(q, (snapshot) => {
        this.notificaciones = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        this.actualizarBadge();
      });
    },

    async eliminarNotificacion(id) {
      try {
        await deleteDoc(doc(db, 'users', this.userId, 'notificaciones', id));
      } catch (error) {
        console.error('❌ Error al eliminar notificación:', error);
      }
    },

    async limpiarTodasNotificaciones() {
      const batch = await getDocs(collection(db, 'users', this.userId, 'notificaciones'));
      const promises = batch.docs.map(docSnap => deleteDoc(doc(db, 'users', this.userId, 'notificaciones', docSnap.id)));
      await Promise.all(promises);
      this.$emit('close');
    },

    async marcarComoLeida(id) {
      try {
        await updateDoc(doc(db, 'users', this.userId, 'notificaciones', id), { leida: true });
      } catch (error) {
        console.error('❌ Error al marcar como leída:', error);
      }
    },

    formatearFecha(fecha) {
      return new Date(fecha).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    actualizarBadge() {
      const noLeidas = this.notificaciones.filter(n => !n.leida).length;
      this.$emit('badge-update', noLeidas);
    }
  }
};
</script>

<style scoped>
</style>
