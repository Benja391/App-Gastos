<template>
<!-- CONTENEDOR VERDE -->
<div class="min-h-screen bg-[#08a04b] flex flex-col items-center py-10 px-4 mt-8 text-gray-900">
  <!-- CAJA BLANCA -->
  <div class="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-10 grid gap-8 mt-1">

      <!-- Mensaje flotante -->
      <div
        v-if="showFloatingMessage"
        class="fixed top-5 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300"
      >
        {{ floatingMessage }}
      </div>

      <!-- Encabezado -->
      <BaseHeading>
        Ingresos totales
      </BaseHeading>

      <!-- Saldo inicial + otros saldos -->
      <div v-if="userId" class="grid gap-6 bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
        <!-- Saldo inicial -->
        <div class="grid gap-3">
          <label class="block text-sm font-semibold text-gray-700">Saldo inicial</label>
          <input
            v-model.number="tempInitialAmount"
            type="number"
            placeholder="Ingrese su saldo inicial"
            class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <p v-if="initialAmountError" class="text-red-600 text-sm mt-1">
  El monto inicial debe ser cero o un número positivo.
</p>
          <button
            @click="setInitialAmount"
            class="w-max px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow mx-auto"
          >
            Guardar saldo inicial
          </button>
        </div>

        <!-- Línea divisoria sutil -->
        <div class="border-t border-gray-200 my-2"></div>

        <!-- Otros saldos adicionales -->
        <div class="grid gap-3">
          <label class="block text-sm font-semibold text-gray-700">Agregar otro saldo</label>

          <!-- Descripción -->
          <input
            v-model="tempAdditionalDescription"
            type="text"
            placeholder="Ej: Sueldo, Alquiler, Regalo..."
            class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <p v-if="additionalDescriptionError" class="text-red-600 text-sm mt-1">
  La descripción es obligatoria.
</p>

          <!-- Monto -->
          <input
            v-model.number="tempAdditionalAmount"
            type="number"
            placeholder="Ingrese otro saldo"
            class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <p v-if="additionalAmountError" class="text-red-600 text-sm mt-1">
  Ingresá un monto válido para el saldo adicional.
</p>

          <button
            @click="addAdditionalAmount"
            class="w-max px-5 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all shadow mx-auto"
          >
            Agregar saldo
          </button>
        </div>
      </div>

      <!-- Monto disponible -->
      <div v-if="userId" class="bg-green-50 border border-green-200 p-6 rounded-xl text-center shadow-sm">
        <p class="text-sm text-gray-500 mb-1">Monto Disponible</p>
        <p class="text-3xl font-bold text-green-700">{{ formatCurrency(remainingAmount) }}</p>
      </div>

      <!-- Listados de gastos y saldos -->
      <div v-if="userId" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">

        <!-- Lista de gastos -->
        <div>
          <h2 class="text-xl font-semibold text-red-600 border-b border-red-200 pb-2 mb-4">Gastos</h2>

          <ul v-if="gastos.length > 0" class="space-y-4 max-h-64 overflow-y-auto pr-2">
            <li
              v-for="gasto in gastos"
              :key="gasto.id"
              class="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm text-sm"
            >
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium text-gray-800">
                    {{ gasto.name }} - {{ formatCurrency(gasto.amount) }}
                  </p>
                  <p class="text-gray-600 italic">{{ gasto.category }}</p>

                  <div v-if="gasto.paymentMethod === 'Tarjeta de Crédito'" class="mt-1 text-blue-600 text-xs">
                    [{{ gasto.creditCard.type }} -
                    {{ gasto.creditCard.installmentsPaid }}/{{ gasto.creditCard.installments }} cuotas]

                    <span
                      v-if="gasto.creditCard.installments > 1"
                      class="ml-2 inline-block px-2 py-1 bg-green-500 text-white rounded-full font-semibold cursor-pointer hover:bg-black transition"
                      title="Las cuotas se reflejan en el Calendario de pagos"
                      @click="irACalendarioPagos"
                    >
                      Ver en Calendario de pagos
                    </span>
                  </div>

                  <p class="text-gray-500 text-xs mt-1">{{ formatDate(gasto.createdAt) }}</p>
                </div>
              </div>
            </li>
          </ul>

          <p v-else class="text-gray-500 text-center text-sm mt-4">No hay gastos registrados aún.</p>
        </div>

        <!-- Lista de saldos -->
        <div>
          <h2 class="text-xl font-semibold text-green-600 border-b border-green-200 pb-2 mb-4">Saldos ingresados</h2>

          <div class="space-y-3 max-h-64 overflow-y-auto pr-2">
            <div class="bg-green-50 border border-green-200 p-3 rounded-lg shadow-sm text-sm">
              <p class="font-medium text-gray-800">Saldo inicial</p>
              <p class="text-green-700 font-semibold">{{ formatCurrency(initialAmount) }}</p>
            </div>

            <div
              v-for="(saldo, index) in additionalAmounts"
              :key="index"
              class="bg-green-50 border border-green-200 p-3 rounded-lg shadow-sm text-sm"
            >
              <p class="text-gray-800 font-medium">Adicional {{ index + 1 }}</p>
              <p class="text-gray-600 text-sm italic" v-if="saldo.description">{{ saldo.description }}</p>
              <p class="text-gray-500 text-xs">{{ formatDate(saldo.date) }}</p>
              <p class="text-green-700 font-semibold">{{ formatCurrency(saldo.amount) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de confirmación -->
      <div
        v-if="mostrarConfirmacion"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full">
          <h3 class="text-xl font-bold mb-4 text-gray-800">Confirmar eliminación</h3>
          <p class="mb-6 text-gray-600">
            ¿Estás seguro de que deseas eliminar todos los gastos? Esta acción no se puede deshacer.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="mostrarConfirmacion = false"
              class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              @click="eliminarTodosLosGastos"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Eliminar
            </button>
          </div>
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
       tempAdditionalDescription: "", // NUEVO
      initialAmount: 0,
      additionalAmounts: [],     
      initialAmountError: false,
      additionalAmountError: false, // array para guardar otros saldos
      additionalDescriptionError: false,
    tempAdditionalAmount: null, // campo temporal para ingresar nuevo saldo adicional
      remainingAmount: 0,
      userId: null,
      gastos: [],
      mostrarConfirmacion: false,
      floatingMessage: null,
     showFloatingMessage: false,
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

      sumAdditionalAmounts() {
      return this.additionalAmounts.reduce((total, val) => total + val, 0);
    },

 async addAdditionalAmount() {
  // Validación de campos
  this.additionalAmountError = this.tempAdditionalAmount === null || this.tempAdditionalAmount <= 0;
  this.additionalDescriptionError = !this.tempAdditionalDescription.trim();

  if (this.additionalAmountError || this.additionalDescriptionError) {
    setTimeout(() => {
      this.additionalAmountError = false;
      this.additionalDescriptionError = false;
    }, 2000);
    return;
  }

  const nuevoSaldo = {
    amount: this.tempAdditionalAmount,
    description: this.tempAdditionalDescription || null,
    date: new Date().toISOString(),
  };

  this.additionalAmounts.push(nuevoSaldo);

  const totalGastos = this.gastos.reduce((acc, gasto) => {
    if (gasto.paymentMethod === 'Tarjeta de Crédito' && gasto.creditCard) {
      const cuotasPagadas = gasto.creditCard.installmentsPaid || 0;
      const montoPorCuota = gasto.creditCard.installmentAmount || 0;
      return acc + cuotasPagadas * montoPorCuota;
    }
    return acc + gasto.amount;
  }, 0);

  const totalSaldos = this.initialAmount + this.additionalAmounts.reduce((sum, s) => sum + s.amount, 0);
  const newRemaining = totalSaldos - totalGastos;

  const userDocId = await this.getUserDocIdByUID();
  const docRef = doc(db, "users", userDocId, "settings", "montoTotal");

  await setDoc(docRef, {
    additionalAmounts: this.additionalAmounts,
    remainingAmount: newRemaining,
  }, { merge: true });

  this.remainingAmount = newRemaining;
  this.tempAdditionalAmount = null;
  this.tempAdditionalDescription = "";

  this.mostrarMensajeTemporal("Saldo adicional agregado correctamente");
},


  // Modificar listenForChanges para traer additionalAmounts:
  async listenForChanges() {
    const userDocId = await this.getUserDocIdByUID();
    const docRef = doc(db, "users", userDocId, "settings", "montoTotal");
    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.initialAmount = data.initialAmount || 0; // no cambiar saldo inicial
        this.additionalAmounts = data.additionalAmounts || [];
        this.remainingAmount = data.remainingAmount || 0;
      }
    });
  },

  // Modificar updateRemainingAmount para que calcule con adicionales sin cambiar saldo inicial
  async updateRemainingAmount() {
    const totalGastos = this.gastos.reduce((acc, gasto) => {
      if (gasto.paymentMethod === 'Tarjeta de Crédito' && gasto.creditCard) {
        const cuotasPagadas = gasto.creditCard.installmentsPaid || 0;
        const montoPorCuota = gasto.creditCard.installmentAmount || 0;
        return acc + cuotasPagadas * montoPorCuota;
      }
      return acc + gasto.amount;
    }, 0);

    const totalSaldos = this.initialAmount + this.sumAdditionalAmounts();

    this.remainingAmount = totalSaldos - totalGastos;

    if (this.userId) {
      const userDocId = await this.getUserDocIdByUID();
      const docRef = doc(db, "users", userDocId, "settings", "montoTotal");
      setDoc(docRef, {
        additionalAmounts: this.additionalAmounts,
        remainingAmount: this.remainingAmount,
      }, { merge: true }).catch(error => {
        console.error("Error al actualizar monto:", error);
      });
    }
  },

  mostrarMensajeTemporal(mensaje) {
    this.floatingMessage = mensaje;
    this.showFloatingMessage = true;
    setTimeout(() => {
      this.showFloatingMessage = false;
      this.floatingMessage = null;
    }, 2000); // 1 segundo
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
    this.initialAmountError = true;
    setTimeout(() => {
      this.initialAmountError = false;
    }, 2000);
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
  this.mostrarMensajeTemporal("Saldo inicial agregado correctamente");
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
