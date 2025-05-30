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
              <p class="text-gray-500 text-xs mt-1">{{ formatearFecha(notif.fecha) }}</p>
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
        @click="limpiarTodasNotificaciones"
        class="w-full px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded transition-colors"
      >
        Limpiar todas ({{ notificaciones.length }})
      </button>
    </div>
  </div>
</template>

<script>
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

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
      gastos: [],
      presupuestos: {},
      cargando: false,
      configuracion: {
        umbralPresupuesto: 10000, 
        diasAntesVencimiento: 3  
      }
    };
  },
  async mounted() {
    console.log('🔔 Componente Notificaciones montado');
    console.log('🔔 UserId recibido:', this.userId);
      this.cargando = true;

    
      try {
    await this.cargarDatos();
    this.verificarTodasLasNotificaciones();
  } catch (error) {
    console.error('🔔 Error en mounted:', error);
  } finally {
    this.cargando = false;
  }
    
   
    setInterval(() => {
      this.verificarTodasLasNotificaciones();
    }, 30 * 60 * 1000);
  },
  methods: {
   
    async cargarDatos() {
      try {
        await Promise.all([
          this.cargarGastos(),
          this.cargarPresupuestos()
        ]);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    },

    async cargarGastos() {
      console.log('🔔 Cargando gastos para uid:', this.userId);
      const q = query(collection(db, 'gastos'), where('uid', '==', this.userId));
      const snapshot = await getDocs(q);
      
      console.log('🔔 Documentos gastos encontrados:', snapshot.docs.length);
      
      snapshot.docs.forEach((doc, index) => {
        console.log(`🔔 Gasto ${index}:`, doc.data());
      });
      
      this.gastos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('🔔 Gastos procesados:', this.gastos);
    },

    async cargarPresupuestos() {
      console.log('🔔 Cargando presupuestos para uid:', this.userId);
      const q = query(collection(db, 'Presupuestos'), where('uid', '==', this.userId));
      const snapshot = await getDocs(q);
      
      console.log('🔔 Documentos presupuestos encontrados:', snapshot.docs.length);
      
      snapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`🔔 Presupuesto ${index}:`, data);
        
    
        this.presupuestos[data.name] = Math.abs(data.amount); 
      });
      
      console.log('🔔 Presupuestos procesados:', this.presupuestos);
    },

  
    verificarPresupuestoExcedido() {
      console.log('🔔 Verificando presupuestos excedidos...');
      
      Object.keys(this.presupuestos).forEach(nombrePresupuesto => {
        const gastoCategoria = this.calcularGastosPorCategoria(nombrePresupuesto);
        const presupuesto = this.presupuestos[nombrePresupuesto];
        
        console.log(`🔔 ${nombrePresupuesto}: gastado=${gastoCategoria}, presupuesto=${presupuesto}`);
        
        if (gastoCategoria > presupuesto) {
          const excedido = gastoCategoria - presupuesto;
          console.log(`🔔 ¡EXCEDIDO! ${nombrePresupuesto} por ${excedido}`);
          
          this.agregarNotificacion(
            'error',
            '💸 ¡Presupuesto Excedido!',
            `Te excediste en ${this.formatCurrency(excedido)} en ${nombrePresupuesto}.`
          );
        }
      });
    },


    verificarMontoDisponible() {
      const gastoTotal = this.calcularGastoTotal();
      const presupuestoTotal = this.calcularPresupuestoTotal();
      const disponible = presupuestoTotal - gastoTotal;
      
      console.log(`🔔 Verificando monto disponible: gasto=${gastoTotal}, presupuesto=${presupuestoTotal}, disponible=${disponible}`);
      
      if (disponible < 0) {
        this.agregarNotificacion(
          'error',
          '¡Sin Fondos!',
          `Te excediste en ${this.formatCurrency(Math.abs(disponible))} de tu monto total disponible.`
        );
      }
    },

   
    verificarCuotasProximasVencer() {
      const hoy = new Date();
      const limite = new Date();
      limite.setDate(hoy.getDate() + this.configuracion.diasAntesVencimiento);

      this.gastos.forEach(gasto => {
        if (gasto.fechaVencimiento) {
          const vencimiento = new Date(gasto.fechaVencimiento);
          
          if (vencimiento >= hoy && vencimiento <= limite) {
            this.agregarNotificacion(
              'warning',
              '📅 Cuota por Vencer',
              `${gasto.name} vence el ${this.formatearFecha(vencimiento)}`
            );
          }
        }
      });
    },

  
    verificarCercaDelLimite() {
      Object.keys(this.presupuestos).forEach(nombrePresupuesto => {
        const gastoCategoria = this.calcularGastosPorCategoria(nombrePresupuesto);
        const presupuesto = this.presupuestos[nombrePresupuesto];
        const restante = presupuesto - gastoCategoria;
        
        if (restante > 0 && restante <= this.configuracion.umbralPresupuesto) {
          this.agregarNotificacion(
            'warning',
            ' Cerca del Límite',
            `Solo quedan ${this.formatCurrency(restante)} en ${nombrePresupuesto}.`
          );
        }
      });
    },

 
    calcularGastosPorCategoria(nombrePresupuesto) {
      console.log('🔔 Calculando gastos para presupuesto:', nombrePresupuesto);
      
      
      const gastosCategoria = this.gastos.filter(gasto => {
        console.log('🔔 Comparando gasto.category:', gasto.category, 'con presupuesto:', nombrePresupuesto);
        return gasto.category === nombrePresupuesto;
      });
      
      const total = gastosCategoria.reduce((total, gasto) => {
        const amount = Math.abs(gasto.amount || 0); 
        return total + amount;
      }, 0);
      
      console.log('🔔 Total gastos en', nombrePresupuesto, ':', total);
      return total;
    },

    calcularGastoTotal() {
      const total = this.gastos.reduce((total, gasto) => {
        const amount = Math.abs(gasto.amount || 0);
        return total + amount;
      }, 0);
      console.log('🔔 Gasto total calculado:', total);
      return total;
    },

    calcularPresupuestoTotal() {
      const total = Object.values(this.presupuestos).reduce((total, monto) => total + monto, 0);
      console.log('🔔 Presupuesto total calculado:', total);
      return total;
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
      }).format(value);
    },

    formatearFecha(fecha) {
      return new Date(fecha).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit'
      });
    },

    
    agregarNotificacion(tipo, titulo, mensaje) {
      console.log('🔔 Agregando notificación:', tipo, titulo, mensaje);
      
    
      const existe = this.notificaciones.some(n => 
        n.titulo === titulo && n.mensaje === mensaje
      );
      
      if (!existe) {
        const notificacion = {
          id: Date.now() + Math.random(),
          tipo,
          titulo,
          mensaje,
          fecha: new Date(),
          leida: false
        };
        
        this.notificaciones.unshift(notificacion);
        console.log('🔔 Notificación agregada, total:', this.notificaciones.length);
        this.actualizarBadge();
        
      
        setTimeout(() => {
          this.eliminarNotificacion(notificacion.id);
        }, 30000);
      } else {
        console.log('🔔 Notificación duplicada, no se agrega');
      }
    },

    eliminarNotificacion(id) {
      const index = this.notificaciones.findIndex(n => n.id === id);
      if (index !== -1) {
        this.notificaciones.splice(index, 1);
        this.actualizarBadge();
      }
    },

    limpiarTodasNotificaciones() {
      this.notificaciones = [];
      this.actualizarBadge();
      this.$emit('close');
    },

    marcarComoLeida(id) {
      const notif = this.notificaciones.find(n => n.id === id);
      if (notif) {
        notif.leida = true;
        this.actualizarBadge();
      }
    },

    actualizarBadge() {
      const noLeidas = this.notificaciones.filter(n => !n.leida).length;
      console.log('🔔 Actualizando badge:', noLeidas);
      this.$emit('badge-update', noLeidas);
    },

    
    async verificarTodasLasNotificaciones() {
      console.log('🔔 === INICIANDO VERIFICACIÓN DE NOTIFICACIONES ===');
      await this.cargarDatos();
      
      this.verificarPresupuestoExcedido();
      this.verificarMontoDisponible();
      this.verificarCuotasProximasVencer();
      this.verificarCercaDelLimite();
      
      console.log('🔔 === VERIFICACIÓN COMPLETADA ===');
    }
  }
};
</script>