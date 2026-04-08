<template>
  <section class="flex items-center justify-center min-h-screen bg-[#08a04b] text-white px-4 py-10 mt-8">
    <div
      class="relative bg-white/95 backdrop-blur-sm text-gray-900 rounded-3xl border border-white/20 w-full max-w-6xl p-6 md:p-8 grid gap-6 mt-1 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_45px_rgba(0,0,0,0.45)] transition-shadow duration-500"
    >
      <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full -mr-32 -mt-32"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-200/20 to-transparent rounded-full -ml-24 -mb-24"></div>

      <div class="relative z-10 space-y-6">
        <header class="text-center space-y-2">
          <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900">Panel de saldo</h1>
          <p class="text-gray-600">Primero mirá tu saldo disponible. Después elegí la acción principal.</p>
        </header>

        <div
          v-if="showFloatingMessage"
          class="p-4 rounded-2xl text-black font-medium border-l-4 shadow-sm bg-green-50 border-green-200 text-green-800"
        >
          {{ floatingMessage }}
        </div>

        <div
          v-if="userId && showOnboarding"
          class="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <p class="text-sm font-semibold text-blue-900">Bienvenido/a</p>
            <p class="text-blue-800 text-sm">
              ¿Querés empezar registrando tu saldo actual o preferís ir directo a cargar gastos?
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="px-4 py-2 rounded-xl bg-white border border-blue-300 text-blue-800 hover:bg-blue-100 transition font-semibold"
              @click="scrollToIncomeCard"
            >
              Cargar saldo actual
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition font-semibold"
              @click="goToAddExpense"
            >
              Ir directo a gastos
            </button>
          </div>
        </div>

        <div v-if="userId" class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-7 rounded-2xl text-center shadow-md">
          <p class="text-sm text-gray-500 mb-1">SALDO DISPONIBLE</p>
          <p class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            {{ formatCurrency(remainingAmount) }}
          </p>
        </div>

        <div v-if="userId" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            class="w-full py-4 rounded-2xl bg-green-600 text-white font-bold text-lg shadow-md hover:bg-green-700 transition"
            @click="goToAddExpense"
          >
            Agregar Gasto
          </button>

          <button
            type="button"
            class="w-full py-4 rounded-2xl bg-white border-2 border-green-200 text-green-700 font-bold text-lg shadow-sm hover:bg-green-50 transition"
            @click="scrollToIncomeCard"
          >
            Agregar Ingreso
          </button>
        </div>

        <div v-if="userId" class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          <div ref="incomeCard" class="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-md p-6 space-y-6">
            <div class="space-y-3">
              <h2 class="text-xl font-bold text-gray-800">Saldo inicial</h2>
              <p class="text-sm text-gray-500">No es obligatorio para usar la app, pero ayuda a ver mejor tu saldo real.</p>
              <input
                v-model.number="tempInitialAmount"
                type="number"
                placeholder="Ingresá tu saldo inicial"
                class="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
              />
              <p v-if="initialAmountError" class="text-red-600 text-sm">El saldo inicial debe ser cero o un número positivo.</p>
              <button
                @click="setInitialAmount"
                class="px-6 py-3 bg-green-600 text-white font-bold rounded-2xl shadow-md hover:bg-green-700 transition"
              >
                Guardar saldo inicial
              </button>
            </div>

            <div class="border-t border-gray-200"></div>

            <div class="space-y-3">
              <h2 class="text-xl font-bold text-gray-800">Registrar ingreso</h2>
              <input
                v-model="tempAdditionalDescription"
                type="text"
                placeholder="Ej.: Sueldo, Venta, Devolución"
                class="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
              />
              <p v-if="additionalDescriptionError" class="text-red-600 text-sm">La descripción es obligatoria.</p>

              <input
                v-model.number="tempAdditionalAmount"
                type="number"
                placeholder="Ingresá el monto del ingreso"
                class="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
              />
              <p v-if="additionalAmountError" class="text-red-600 text-sm">Ingresá un monto válido para el ingreso.</p>

              <button
                @click="addAdditionalAmount"
                class="px-6 py-3 bg-green-600 text-white font-bold rounded-2xl shadow-md hover:bg-green-700 transition"
              >
                Agregar ingreso
              </button>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
            <h2 class="text-xl font-bold text-green-700 mb-4">Últimos 3 gastos</h2>
            <ul v-if="latestGastos.length" class="space-y-3">
              <li v-for="gasto in latestGastos" :key="gasto.id" class="bg-gray-50 border border-gray-200 rounded-xl p-3">
                <p class="text-sm font-semibold text-gray-800">{{ gasto.name || 'Sin nombre' }}</p>
                <p class="text-sm text-gray-600">{{ gasto.category || 'Sin categoría' }}</p>
                <p class="text-sm font-bold text-red-600">- {{ formatCurrency(gasto.amount) }}</p>
              </li>
            </ul>
            <p v-else class="text-sm text-gray-500">Todavía no hay gastos cargados.</p>
          </div>
        </div>

        <div v-if="userId" class="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Resumen de movimientos</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-bold text-red-600 mb-3">Gastos</h3>
              <ul v-if="gastos.length > 0" class="space-y-3 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                <li
                  v-for="gasto in gastos"
                  :key="gasto.id"
                  class="bg-gray-50 border border-gray-200 p-3 rounded-xl shadow-sm text-sm"
                >
                  <p class="font-medium text-gray-800">{{ gasto.name }} - {{ formatCurrency(gasto.amount) }}</p>
                  <p class="text-gray-600 italic">{{ gasto.category }}</p>
                  <p class="text-gray-500 text-xs mt-1">{{ formatDate(gasto.createdAt) }}</p>
                </li>
              </ul>
              <p v-else class="text-gray-500 text-sm">No hay gastos registrados aún.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-green-700 mb-3">Ingresos cargados</h3>
              <div class="space-y-3 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                <div class="bg-green-50 border border-green-200 p-3 rounded-xl shadow-sm text-sm">
                  <p class="font-medium text-gray-800">Saldo inicial</p>
                  <p class="text-green-700 font-bold">{{ formatCurrency(initialAmount) }}</p>
                </div>

                <div
                  v-for="(saldo, index) in additionalAmounts"
                  :key="index"
                  class="bg-green-50 border border-green-200 p-3 rounded-xl shadow-sm text-sm"
                >
                  <p class="text-gray-800 font-medium">Ingreso {{ index + 1 }}</p>
                  <p v-if="saldo.description" class="text-gray-600 italic text-sm">{{ saldo.description }}</p>
                  <p class="text-gray-500 text-xs">{{ formatDate(saldo.date) }}</p>
                  <p class="text-green-700 font-bold">{{ formatCurrency(saldo.amount) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="mostrarConfirmacion" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
            <h3 class="text-xl font-bold mb-4 text-gray-800">Confirmar eliminación</h3>
            <p class="mb-6 text-gray-600">¿Estás seguro de que querés eliminar todos los gastos? Esta acción no se puede deshacer.</p>
            <div class="flex justify-end gap-3">
              <button @click="mostrarConfirmacion = false" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition">
                Cancelar
              </button>
              <button @click="eliminarTodosLosGastos" class="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { db } from "../services/firebase";
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      floatingMessage: null,
      showFloatingMessage: false,
      mostrarConfirmacion: false,
      userId: null,
      tempInitialAmount: null,
      initialAmount: 0,
      remainingAmount: 0,
      additionalAmounts: [],
      tempAdditionalAmount: null,
      tempAdditionalDescription: "",
      initialAmountError: false,
      additionalAmountError: false,
      additionalDescriptionError: false,
      gastos: [],
    };
  },

  computed: {
    latestGastos() {
      return this.gastos.slice(0, 3);
    },

    hasAnyBalance() {
      return Number(this.initialAmount || 0) > 0 || this.additionalAmounts.length > 0;
    },

    showOnboarding() {
      return !this.hasAnyBalance && this.gastos.length === 0;
    },
  },

  methods: {
    formatCurrency(value) {
      const amount = parseFloat(value);
      if (isNaN(amount)) return "Monto inválido";
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    },

    formatDate(tsOrIso) {
      if (!tsOrIso) return "Fecha desconocida";
      if (tsOrIso?.toDate) return tsOrIso.toDate().toLocaleDateString("es-AR");
      return new Date(tsOrIso).toLocaleDateString("es-AR");
    },

    goToAddExpense() {
      this.$router.push("/cargar-gasto");
    },

    scrollToIncomeCard() {
      this.$refs.incomeCard?.scrollIntoView({ behavior: "smooth", block: "start" });
    },

    sumAdditionalAmounts() {
      return this.additionalAmounts.reduce((sum, s) => sum + Number(s.amount || 0), 0);
    },

    mostrarMensajeTemporal(mensaje) {
      this.floatingMessage = mensaje;
      this.showFloatingMessage = true;
      setTimeout(() => {
        this.showFloatingMessage = false;
        this.floatingMessage = null;
      }, 2000);
    },

    async getUserDocIdByUID() {
      const qUsers = query(collection(db, "users"), where("uid", "==", this.userId));
      const snap = await getDocs(qUsers);
      if (snap.empty) throw new Error("No se encontró el documento del usuario.");
      return snap.docs[0].id;
    },

    async listenForChanges() {
      const userDocId = await this.getUserDocIdByUID();
      const montoRef = doc(db, "users", userDocId, "settings", "montoTotal");

      onSnapshot(montoRef, (docSnap) => {
        if (!docSnap.exists()) return;

        const data = docSnap.data();
        this.initialAmount = Number(data.initialAmount || 0);
        this.remainingAmount = Number(data.remainingAmount || 0);
        this.additionalAmounts = Array.isArray(data.additionalAmounts) ? data.additionalAmounts : [];

        this.updateRemainingAmount();
      });
    },

    listenForGastos() {
      const gastosRef = query(
        collection(db, "gastos"),
        where("uid", "==", this.userId),
        orderBy("createdAt", "desc")
      );

      onSnapshot(gastosRef, (querySnapshot) => {
        this.gastos = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        this.updateRemainingAmount();
      });
    },

    async updateRemainingAmount() {
      const totalGastos = this.gastos.reduce((acc, gasto) => {
        if (gasto.paymentMethod === "Tarjeta de Crédito" && gasto.creditCard) {
          const cuotasPagadas = Number(gasto.creditCard.installmentsPaid || 0);
          const montoPorCuota = Number(gasto.creditCard.installmentAmount || 0);
          return acc + cuotasPagadas * montoPorCuota;
        }
        return acc + Number(gasto.amount || 0);
      }, 0);

      const totalSaldos = Number(this.initialAmount || 0) + this.sumAdditionalAmounts();
      this.remainingAmount = totalSaldos - totalGastos;

      if (!this.userId) return;

      try {
        const userDocId = await this.getUserDocIdByUID();
        const montoRef = doc(db, "users", userDocId, "settings", "montoTotal");

        await setDoc(
          montoRef,
          {
            initialAmount: this.initialAmount,
            additionalAmounts: this.additionalAmounts,
            remainingAmount: this.remainingAmount,
          },
          { merge: true }
        );
      } catch (e) {
        console.error("Error al actualizar remainingAmount:", e);
      }
    },

    async addAdditionalAmount() {
      this.additionalAmountError =
        this.tempAdditionalAmount === null || Number(this.tempAdditionalAmount) <= 0;
      this.additionalDescriptionError = !this.tempAdditionalDescription.trim();

      if (this.additionalAmountError || this.additionalDescriptionError) {
        setTimeout(() => {
          this.additionalAmountError = false;
          this.additionalDescriptionError = false;
        }, 2000);
        return;
      }

      const nuevoSaldo = {
        amount: Number(this.tempAdditionalAmount),
        description: this.tempAdditionalDescription || null,
        date: new Date().toISOString(),
      };
      this.additionalAmounts = [...this.additionalAmounts, nuevoSaldo];

      try {
        const userDocId = await this.getUserDocIdByUID();
        const montoRef = doc(db, "users", userDocId, "settings", "montoTotal");

        await setDoc(
          montoRef,
          { additionalAmounts: this.additionalAmounts },
          { merge: true }
        );

        await this.updateRemainingAmount();
        this.tempAdditionalAmount = null;
        this.tempAdditionalDescription = "";
        this.mostrarMensajeTemporal("Ingreso agregado correctamente");
      } catch (e) {
        console.error("Error al agregar saldo adicional:", e);
      }
    },

    async setInitialAmount() {
      if (this.tempInitialAmount === null || Number(this.tempInitialAmount) < 0) {
        this.initialAmountError = true;
        setTimeout(() => (this.initialAmountError = false), 2000);
        return;
      }

      this.initialAmount = Number(this.tempInitialAmount);

      try {
        const userDocId = await this.getUserDocIdByUID();
        const montoRef = doc(db, "users", userDocId, "settings", "montoTotal");

        await setDoc(
          montoRef,
          { initialAmount: this.initialAmount },
          { merge: true }
        );

        await this.updateRemainingAmount();
        this.tempInitialAmount = null;
        this.mostrarMensajeTemporal("Saldo inicial guardado correctamente");
      } catch (e) {
        console.error("Error al guardar saldo inicial:", e);
      }
    },

    async eliminarTodosLosGastos() {
      try {
        const gastosRef = collection(db, "gastos");
        const qG = query(gastosRef, where("uid", "==", this.userId));
        const snap = await getDocs(qG);
        await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));

        const userDocId = await this.getUserDocIdByUID();
        const montoRef = doc(db, "users", userDocId, "settings", "montoTotal");
        const newRemaining = Number(this.initialAmount || 0) + this.sumAdditionalAmounts();

        await setDoc(
          montoRef,
          {
            initialAmount: this.initialAmount,
            additionalAmounts: this.additionalAmounts,
            remainingAmount: newRemaining,
          },
          { merge: true }
        );

        this.mostrarConfirmacion = false;
        this.mostrarMensajeTemporal("Se eliminaron todos los gastos.");
      } catch (error) {
        console.error("Error al eliminar gastos:", error);
        alert("Ocurrió un error al eliminar los gastos. Intentá nuevamente.");
      }
    },

    confirmarEliminarGastos() {
      this.mostrarConfirmacion = true;
    },
  },

  async mounted() {
    onAuthStateChanged(getAuth(), async (user) => {
      if (!user) return;
      this.userId = user.uid;

      await this.listenForChanges();
      this.listenForGastos();
    });
  },
};
</script>