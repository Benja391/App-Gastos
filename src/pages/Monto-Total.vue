<template>
  <div class="min-h-screen bg-gray-700 flex flex-col items-center py-10 px-4">
    <div class="w-full max-w-4xl bg-green-200 shadow-lg rounded-xl p-6">
      <BaseHeading>
        Ingresos totales
      </BaseHeading>

      <div v-if="userId" class="mb-4">
        <label class="block text-gray-700 font-medium">Saldo inicial</label>
        <input
          v-model.number="tempInitialAmount"
          type="number"
          placeholder="Ingrese su saldo inicial"
          class="w-full px-4 py-2 border rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          @click="setInitialAmount"
          class="mt-3 px-4 py-2 bg-green-600 text-white  rounded-lg hover:bg-green-500 "
        >
          Guardar saldo inicial
        </button>
      </div>

      <div v-if="userId" class="bg-green-100 p-4 rounded-lg mb-4 text-center">
        <p class="text-gray-600 text-sm">Monto Disponible</p>
        <p class="text-2xl font-semibold text-green-600">{{ formatCurrency(remainingAmount) }}</p>
      </div>

      <div v-if="gastos.length > 0" class="mt-6">
        <h2 class="text-lg font-semibold mb-2 text-red">Gastos</h2>
        <ul class="list-disc pl-5 max-h-64 overflow-y-auto">
          <li v-for="gasto in gastos" :key="gasto.id" class="text-gray-700 mb-2">
            {{ gasto.name }} - {{ formatCurrency(gasto.amount) }} ({{ gasto.category }})
            <span v-if="gasto.paymentMethod === 'Tarjeta de Crédito'" class="text-blue-600 ml-2">
              [{{ gasto.creditCard.type }} - 
              {{ gasto.creditCard.installmentsPaid }}/{{ gasto.creditCard.installments }} cuotas]
            <span 
  v-if="gasto.creditCard.installments > 1"
  class="ml-3 px-2 py-1 text-xs bg-green-500 text-white rounded-full font-semibold cursor-pointer hover:bg-black"
  title="Las cuotas se reflejan en el Calendario de pagos"
  @click="irACalendarioPagos"
>
    Ver en Calendario de pagos  
</span>
            </span>
            <br />
            <span class="text-sm text-gray-500">{{ formatDate(gasto.createdAt) }}</span>
          </li>
        </ul>
      </div>
      <p v-else class="text-gray-500 mt-4">No hay gastos registrados aún.</p>

      <div v-if="userId" class="text-center mt-6 flex flex-wrap justify-center gap-2">
        <BaseButtonSecondary
          @click="irACargarGasto"
      
        >
          Cargar gasto
      </BaseButtonSecondary>
      
        <button
          @click="confirmarEliminarGastos"
          class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
        >
           Eliminar Todos los gastos
        </button>
      </div>
    </div>
    
    
    <div v-if="mostrarConfirmacion" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 class="text-xl font-bold mb-4 text-gray-800">Confirmar eliminación</h3>
        <p class="mb-6 text-gray-600">¿Estás seguro de que deseas eliminar todos los gastos? Esta acción no se puede deshacer.</p>
        <div class="flex justify-end gap-3">
          <button 
            @click="mostrarConfirmacion = false" 
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button 
            @click="eliminarTodosLosGastos" 
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../services/firebase";
import { doc, setDoc, getDoc, onSnapshot, collection, query, where, orderBy, deleteDoc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import BaseHeading from "../components/BaseHeading.vue";
import BaseButtonSecondary from "../components/BaseButtonSecondary.vue";



export default {
  components: { BaseHeading, BaseButtonSecondary },
  data() {
    return {
      tempInitialAmount: null,
      initialAmount: 0,
      remainingAmount: 0,
      userId: null,
      gastos: [],
      mostrarConfirmacion: false,
    };
  },
  methods: {
    formatCurrency(value) {
  
  const amount = parseFloat(value);

  if (isNaN(amount)) {
    return 'Monto inválido'; 
  }

  return new Intl.NumberFormat('es-AR', { 
    style: 'currency', 
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0  
  }).format(amount);
},
    
    formatDate(timestamp) {
      if (!timestamp) return "Fecha desconocida";
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString();
      }
      return new Date(timestamp).toLocaleDateString();
    },

    async getUserDocIdByUID() {
      const q = query(collection(db, "users"), where("uid", "==", this.userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
      } else {
        throw new Error("No se encontró el documento del usuario.");
      }
    },

    async setInitialAmount() {
      if (this.tempInitialAmount === null || this.tempInitialAmount < 0) {
        alert("El monto inicial debe ser cero o un número positivo.");
        return;
      }

      const userDocId = await this.getUserDocIdByUID();
      const docRef = doc(db, "users", userDocId, "settings", "montoTotal");
      await setDoc(docRef, {
        initialAmount: this.tempInitialAmount,
        remainingAmount: this.tempInitialAmount,
      });

      this.initialAmount = this.tempInitialAmount;
      this.tempInitialAmount = null;
      this.updateRemainingAmount(); 
    },

    async fetchAmounts() {
      const userDocId = await this.getUserDocIdByUID();
      const docRef = doc(db, "users", userDocId, "settings", "montoTotal");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.initialAmount = docSnap.data().initialAmount;
        this.remainingAmount = docSnap.data().remainingAmount;
      }
    },

    async listenForChanges() {
      const userDocId = await this.getUserDocIdByUID();
      const docRef = doc(db, "users", userDocId, "settings", "montoTotal");
      onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          this.initialAmount = docSnap.data().initialAmount;
          this.remainingAmount = docSnap.data().remainingAmount;
        }
      });
    },

    listenForGastos() {
      const gastosRef = query(collection(db, "gastos"), 
        where("uid", "==", this.userId), 
        orderBy("createdAt", "desc")
      );
      
      onSnapshot(gastosRef, (querySnapshot) => {
        this.gastos = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        this.updateRemainingAmount();
      });
    },

    async updateRemainingAmount() {
      let totalGastos = 0;
      
      this.gastos.forEach(gasto => {
        if (gasto.paymentMethod === 'Tarjeta de Crédito' && gasto.creditCard) {
          if (gasto.creditCard.installments > 0) {
            const cuotasPagadas = gasto.creditCard.installmentsPaid || 0;
            const montoPorCuota = gasto.creditCard.installmentAmount;
            totalGastos += cuotasPagadas * montoPorCuota;
            console.log(`Gasto en cuotas: ${gasto.name}, Cuotas pagadas: ${cuotasPagadas}/${gasto.creditCard.installments}, Monto: ${cuotasPagadas * montoPorCuota}`);
          } else {
            if (gasto.budgetUpdated) {
              totalGastos += gasto.amount;
              console.log(`Gasto con tarjeta (1 pago): ${gasto.name}, Monto: ${gasto.amount}`);
            }
          }
        } else {
          totalGastos += gasto.amount;
          console.log(`Otros métodos: ${gasto.name}, Monto: ${gasto.amount}`);
        }
      });
      
      console.log(`Monto inicial: ${this.initialAmount}, Total gastos: ${totalGastos}, Restante: ${this.initialAmount - totalGastos}`);
      
      this.remainingAmount = this.initialAmount - totalGastos;
      
      if (this.userId) {
        const userDocId = await this.getUserDocIdByUID();
        const docRef = doc(db, "users", userDocId, "settings", "montoTotal");
        setDoc(docRef, {
          initialAmount: this.initialAmount,
          remainingAmount: this.remainingAmount,
        }, { merge: true }).then(() => {
          console.log("Monto actualizado en Firestore:", this.remainingAmount);
        }).catch(error => {
          console.error("Error al actualizar monto:", error);
        });
      }
    },

    getUserId() {
      const auth = getAuth();
      const user = auth.currentUser;
      this.userId = user ? user.uid : null;
    },

    irACargarGasto() {
      this.$router.push("/cargar-gasto");
    },
    
    irACalendarioPagos() {
      this.$router.push("/calendario-pagos");
    },
    
    confirmarEliminarGastos() {
      this.mostrarConfirmacion = true;
    },
    
    async eliminarTodosLosGastos() {
      try {
        const gastosRef = collection(db, "gastos");
        const q = query(gastosRef, where("uid", "==", this.userId));
        const querySnapshot = await getDocs(q);
        
        const eliminaciones = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(eliminaciones);
        
        const userDocId = await this.getUserDocIdByUID();
        const docRef = doc(db, "users", userDocId, "settings", "montoTotal");
        await setDoc(docRef, {
          initialAmount: this.initialAmount,
          remainingAmount: this.initialAmount,
        });
        
        this.mostrarConfirmacion = false;
        
        alert("Todos los gastos han sido eliminados correctamente.");
      } catch (error) {
        console.error("Error al eliminar gastos:", error);
        alert("Ocurrió un error al eliminar los gastos. Intenta nuevamente.");
      }
    }
  },
  async mounted() {
    this.getUserId();
    if (this.userId) {
      await this.fetchAmounts();
      this.listenForChanges();
      this.listenForGastos();
    }
  },
};
</script>
