<template>
  <section class="min-h-screen bg-gray-700 p-6">
    <div class="max-w-4xl mx-auto bg-green-200 shadow-xl rounded-lg p-6">
      <BaseHeading class="text-2xl font-bold text-gray-800 mb-4">
        Historial de gastos
      </BaseHeading>

    
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Buscar por nombre o descripción"
          class="w-full px-4 py-2 border rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <select
          v-model="filters.category"
          class="w-full px-4 py-2 border rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Todas las categorías</option>
          <option v-for="cat in uniqueCategories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>

        <select
          v-model="filters.paymentMethod"
          class="w-full px-4 py-2 border rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Todos los métodos</option>
          <option
            v-for="method in uniquePaymentMethods"
            :key="method"
            :value="method"
          >
            {{ method }}
          </option>
        </select>

        <input
          v-model.number="filters.minAmount"
          type="number"
          placeholder="Monto mínimo"
          class="w-full px-4 py-2 border rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <input
          v-model.number="filters.maxAmount"
          type="number"
          placeholder="Monto máximo"
          class="w-full px-4 py-2 border rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

    
        <input
          v-model="filters.dateStart"
          type="date"
          class="w-full px-4 py-2 border rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <input
          v-model="filters.dateEnd"
          type="date"
          class="w-full px-4 py-2 border rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

     
      <div v-if="filteredExpenses.length">
        <div
          v-for="exp in filteredExpenses"
          :key="exp.id"
          class="border-l-4 border-green-500 bg-gray-50 p-4 mb-2 rounded"
        >
          <h2 class="text-lg font-semibold">{{ exp.name }}</h2>
          <p class="text-gray-600">{{ exp.description }}</p>
          <p>
            <strong>Monto:</strong> {{ formatCurrency(exp.amount) }}
          </p>
          <p>
            <strong>Categoría:</strong> {{ exp.category }} |
            <strong>Método de pago:</strong> {{ exp.paymentMethod }}
          </p>
          <p class="text-sm text-gray-500">
            Fecha: {{ formatDate(exp.date) }}
          </p>
        </div>
      </div>

      <p v-else class="text-center text-gray-500 mt-8">
        No se encontraron gastos con los filtros seleccionados.
      </p>
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
    uniqueCategories() {
      return [...new Set(this.expenses.map((e) => e.category))];
    },
    uniquePaymentMethods() {
      return [...new Set(this.expenses.map((e) => e.paymentMethod))];
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
  },
};
</script>
