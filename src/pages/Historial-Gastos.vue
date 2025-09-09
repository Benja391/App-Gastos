<template>
  <section class="flex items-center justify-center min-h-screen bg-[#08a04b] text-white px-4 py-10 mt-8">
    <div class="relative bg-white/95 backdrop-blur-sm text-gray-900 rounded-3xl  border border-white/20 w-full max-w-5xl p-8 mt-1 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.35)]
         hover:shadow-[0_12px_45px_rgba(0,0,0,0.45)]
         transition-shadow duration-500">
      <BaseHeading >
        Historial
      </BaseHeading>
      <p class="text-center text-gray-600 mb-6">
        Gestioná tu saldo y registros de manera clara
      </p>

      <!-- Dos columnas: izquierda gastos, derecha saldos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- ========== IZQUIERDA: HISTORIAL DE GASTOS ========== -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Gastos</h2>

          <!-- Filtros -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Buscá por nombre o descripción"
              class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <select
              v-model="filters.category"
              class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Todas las categorías</option>
              <option v-for="cat in uniqueCategories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>

            <select
              v-model="filters.paymentMethod"
              class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Todos los métodos</option>
              <option v-for="method in uniquePaymentMethods" :key="method" :value="method">
                {{ method }}
              </option>
            </select>

            <input
              v-model.number="filters.minAmount"
              type="number"
              placeholder="Ingresá un monto mínimo"
              class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <input
              v-model.number="filters.maxAmount"
              type="number"
              placeholder="Ingresá un monto máximo"
              class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <input
              v-model="filters.dateStart"
              type="date"
              class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <input
              v-model="filters.dateEnd"
              type="date"
              class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <!-- Selector de cantidad por página -->
          <div class="mt-4 text-sm text-gray-700 flex items-center justify-end gap-2">
            <label for="perPage">Mostrar:</label>
            <select
              id="perPage"
              v-model.number="itemsPerPage"
              class="px-3 py-1 rounded border border-gray-300 focus:ring-2 focus:ring-green-600"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="15">15</option>
            </select>
            <span>por página</span>
          </div>

          <!-- Lista de gastos paginada -->
          <div v-if="paginatedExpenses.length" class="grid gap-4 mt-4 max-h-[600px] overflow-y-auto pr-2">
            <div
              v-for="exp in paginatedExpenses"
              :key="exp.id"
              class="bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-sm"
            >
              <h3 class="text-lg font-semibold text-gray-800">{{ exp.name }}</h3>
              <p class="text-gray-600 text-sm mb-1">{{ exp.description }}</p>
              <p class="text-sm text-gray-800">
                <strong>Monto:</strong> {{ formatCurrency(exp.amount) }}
              </p>
              <p class="text-sm text-gray-700">
                <strong>Categoría:</strong> {{ exp.category }} |
                <strong>Método de pago:</strong> {{ exp.paymentMethod }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                Fecha: {{ formatDate(exp.date) }}
              </p>
            </div>
          </div>

          <p v-else class="text-center text-gray-500 mt-8 text-sm">
            No se encontraron gastos con los filtros seleccionados.
          </p>

          <!-- Paginación -->
          <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-6 flex-wrap">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              «
            </button>

            <button
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-1 rounded',
                currentPage === page
                  ? 'bg-green-700 text-white font-bold'
                  : 'bg-gray-200 text-gray-800 hover:bg-green-100'
              ]"
            >
              {{ page }}
            </button>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              »
            </button>
          </div>
        </div>

        <!-- ========== DERECHA: HISTORIAL DE SALDOS ========== -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Saldos</h2>

          <!-- Resumen -->
          <div class="grid gap-4">
            <div class="bg-green-50 border border-green-200 p-4 rounded-xl">
              <p class="text-sm text-gray-600">Saldo inicial</p>
              <p class="text-2xl font-bold text-green-700">{{ formatCurrency(saldos.initialAmount || 0) }}</p>
            </div>

          </div>

          <!-- Listado de adicionales -->
          <div class="mt-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Ingresos / saldos agregados</h3>

            <div v-if="saldosList.length" class="space-y-3 max-h-[520px] overflow-y-auto pr-2">
              <div
                v-for="item in saldosList"
                :key="item.id"
                class="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0">
                    <p class="font-medium text-gray-800 truncate">
                      {{ item.description || 'Sin descripción' }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ formatDate(item.date) }}
                    </p>
                  </div>
                  <div class="shrink-0 text-right">
                    <p class="text-green-700 font-semibold">{{ formatCurrency(item.amount) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <p v-else class="text-sm text-gray-500">
              Todavía no agregaste saldos adicionales.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import BaseHeading from "../components/BaseHeading.vue";

export default {
  components: { BaseHeading },
  data() {
    return {
      // GASTOS
      expenses: [],
      currentPage: 1,
      itemsPerPage: 5,
      filters: {
        search: "",
        category: "",
        paymentMethod: "",
        minAmount: null,
        maxAmount: null,
        dateStart: "",
        dateEnd: "",
      },

      // SALDOS
      saldos: {
        initialAmount: 0,
        remainingAmount: 0,
        additionalAmounts: []
      },
      saldosList: [] // lista plana ordenada para mostrar
    };
  },
  computed: {
    // ---------- GASTOS ----------
    filteredExpenses() {
      return this.expenses.filter((exp) => {
        const text = this.filters.search.toLowerCase();
        const matchesSearch =
          !text ||
          exp.name.toLowerCase().includes(text) ||
          (exp.description || "").toLowerCase().includes(text);

        const matchesCategory = !this.filters.category || exp.category === this.filters.category;
        const matchesMethod = !this.filters.paymentMethod || exp.paymentMethod === this.filters.paymentMethod;
        const matchesMin = this.filters.minAmount == null || exp.amount >= this.filters.minAmount;
        const matchesMax = this.filters.maxAmount == null || exp.amount <= this.filters.maxAmount;

        const expDate = new Date(exp.date);
        let matchesDate = true;
        if (this.filters.dateStart) {
          const start = new Date(this.filters.dateStart);
          matchesDate = expDate >= start;
        }
        if (matchesDate && this.filters.dateEnd) {
          const end = new Date(this.filters.dateEnd);
          matchesDate = expDate <= end;
        }

        return (
          matchesSearch &&
          matchesCategory &&
          matchesMethod &&
          matchesMin &&
          matchesMax &&
          matchesDate
        );
      });
    },
    totalPages() {
      return Math.ceil(this.filteredExpenses.length / this.itemsPerPage);
    },
    paginatedExpenses() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredExpenses.slice(start, start + this.itemsPerPage);
    },
    uniqueCategories() {
      return [...new Set(this.expenses.map((e) => e.category))];
    },
    uniquePaymentMethods() {
      return [...new Set(this.expenses.map((e) => e.paymentMethod))];
    },
  },
  methods: {
    // ---------- GASTOS ----------
    async fetchExpenses(uid) {
      const db = getFirestore();
      const snapshot = await getDocs(collection(db, "gastos"));
      this.expenses = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((e) => e.uid === uid);
    },
    // ---------- SALDOS ----------
    async fetchSaldos(uid) {
      const db = getFirestore();

      // Busco el userDocId por uid
      const qUser = query(collection(db, "users"), where("uid", "==", uid));
      const userSnap = await getDocs(qUser);
      if (userSnap.empty) {
        this.saldos = { initialAmount: 0, remainingAmount: 0, additionalAmounts: [] };
        this.saldosList = [];
        return;
      }
      const userDocId = userSnap.docs[0].id;

      // Leo settings/montoTotal
      const settingsRef = doc(db, "users", userDocId, "settings", "montoTotal");
      const settingsSnap = await getDoc(settingsRef);

      if (!settingsSnap.exists()) {
        this.saldos = { initialAmount: 0, remainingAmount: 0, additionalAmounts: [] };
        this.saldosList = [];
        return;
      }

      const data = settingsSnap.data() || {};
      const add = Array.isArray(data.additionalAmounts) ? data.additionalAmounts : [];

      // Normalizo lista para mostrar (ordenado por fecha desc)
      const list = add
        .map((item, idx) => ({
          id: String(idx),
          description: item.description || '',
          amount: Number(item.amount || 0),
          date: item.date || null
        }))
        .sort((a, b) => {
          const da = a.date ? new Date(a.date).getTime() : 0;
          const dbb = b.date ? new Date(b.date).getTime() : 0;
          return dbb - da;
        });

      this.saldos = {
        initialAmount: Number(data.initialAmount || 0),
        remainingAmount: Number(data.remainingAmount || 0),
        additionalAmounts: add
      };
      this.saldosList = list;
    },

    // ---------- UTIL ----------
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
    formatDate(dateStr) {
      if (!dateStr) return "—";
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(dateStr).toLocaleDateString("es-AR", options);
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await Promise.all([
          this.fetchExpenses(user.uid),
          this.fetchSaldos(user.uid)
        ]);
      }
    });
  },
};
</script>
