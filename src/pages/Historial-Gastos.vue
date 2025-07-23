<template>
  <section class="flex items-center justify-center min-h-screen bg-[#08a04b] text-white px-4 py-10 mt-8">
  <!-- CAJA BLANCA -->
  <div class="relative bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl p-10 grid gap-8 mt-1">

      <!-- Título -->
      <BaseHeading>
        Historial de gastos
      </BaseHeading>

      <!-- Filtros -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input v-model="filters.search" type="text" placeholder="Buscar por nombre o descripción"
          class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600" />

        <select v-model="filters.category"
          class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600">
          <option value="">Todas las categorías</option>
          <option v-for="cat in uniqueCategories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>

        <select v-model="filters.paymentMethod"
          class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600">
          <option value="">Todos los métodos</option>
          <option v-for="method in uniquePaymentMethods" :key="method" :value="method">
            {{ method }}
          </option>
        </select>

        <input v-model.number="filters.minAmount" type="number" placeholder="Monto mínimo"
          class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
        <input v-model.number="filters.maxAmount" type="number" placeholder="Monto máximo"
          class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600" />

        <input v-model="filters.dateStart" type="date"
          class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
        <input v-model="filters.dateEnd" type="date"
          class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
      </div>

      <!-- Selector de cantidad por página -->
      <div class="mt-4 text-sm text-gray-700 flex items-center justify-end gap-2">
        <label for="perPage">Mostrar:</label>
        <select id="perPage" v-model.number="itemsPerPage"
          class="px-3 py-1 rounded border border-gray-300 focus:ring-2 focus:ring-green-600">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="15">15</option>
        </select>
        <span>por página</span>
      </div>

      <!-- Lista de gastos paginada -->
      <div v-if="paginatedExpenses.length" class="grid gap-4 mt-4 max-h-[600px] overflow-y-auto pr-2">
        <div v-for="exp in paginatedExpenses" :key="exp.id "
          class="bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-sm">
          <h2 class="text-lg font-semibold text-gray-800">{{ exp.name }}</h2>
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

      <!-- Paginación por números -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-6 flex-wrap">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
          class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
          «
        </button>

        <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
          :class="[
            'px-3 py-1 rounded',
            currentPage === page
              ? 'bg-green-700 text-white font-bold'
              : 'bg-gray-200 text-gray-800 hover:bg-green-100'
          ]">
          {{ page }}
        </button>

        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
          class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
          »
        </button>
      </div>

    </div>
  </section>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import BaseHeading from "../components/BaseHeading.vue";

export default {
  components: { BaseHeading },
  data() {
    return {
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
    };
  },
  computed: {
    filteredExpenses() {
      return this.expenses.filter((exp) => {
        const text = this.filters.search.toLowerCase();
        const matchesSearch =
          !text ||
          exp.name.toLowerCase().includes(text) ||
          exp.description.toLowerCase().includes(text);

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
    async fetchExpenses(uid) {
      const db = getFirestore();
      const snapshot = await getDocs(collection(db, "gastos"));
      this.expenses = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((e) => e.uid === uid);
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
      }).format(amount);
    },
    formatDate(dateStr) {
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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.fetchExpenses(user.uid);
      }
    });
  },
};
</script>
