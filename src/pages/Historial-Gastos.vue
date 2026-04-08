<template>
  <section class="flex items-center justify-center min-h-screen bg-[#08a04b] text-white px-4 py-10 mt-8">
    <div
      class="relative bg-white/95 backdrop-blur-sm text-gray-900 rounded-3xl border border-white/20 w-full max-w-6xl p-6 md:p-8 mt-1 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_45px_rgba(0,0,0,0.45)] transition-shadow duration-500"
    >
      <BaseHeading>Historial</BaseHeading>
      <p class="text-center text-gray-600 mb-6">Consultá tus movimientos sin mezclar gastos e ingresos.</p>

      <div class="flex justify-center mb-6">
        <div class="inline-flex bg-gray-100 rounded-2xl p-1 shadow-sm">
          <button
            type="button"
            class="px-5 py-2 rounded-xl font-semibold transition"
            :class="activeTab === 'gastos' ? 'bg-green-600 text-white shadow' : 'text-gray-700 hover:bg-white'"
            @click="activeTab = 'gastos'"
          >
            Gastos
          </button>
          <button
            type="button"
            class="px-5 py-2 rounded-xl font-semibold transition"
            :class="activeTab === 'ingresos' ? 'bg-green-600 text-white shadow' : 'text-gray-700 hover:bg-white'"
            @click="activeTab = 'ingresos'"
          >
            Ingresos
          </button>
        </div>
      </div>

      <div v-if="activeTab === 'gastos'" class="space-y-4">
        <button
          type="button"
          @click="showFilters = !showFilters"
          class="w-full md:w-auto px-4 py-2 rounded-xl border border-green-200 text-green-700 font-semibold hover:bg-green-50 transition"
        >
          {{ showFilters ? 'Ocultar filtros' : 'Mostrar filtros' }}
        </button>

        <div v-if="showFilters" class="bg-gray-50 border border-gray-200 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="text-xs font-semibold text-gray-600">Fecha</label>
            <select v-model="filters.dateRange" class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600">
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="year">Último año</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          <div>
            <label class="text-xs font-semibold text-gray-600">Categoría</label>
            <select v-model="filters.category" class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600">
              <option value="">Todas</option>
              <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div>
            <label class="text-xs font-semibold text-gray-600">Monto</label>
            <select v-model="filters.amountOperator" class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600">
              <option value="">Sin filtro</option>
              <option value=">">Mayor a</option>
              <option value="<">Menor a</option>
            </select>
          </div>

          <div>
            <label class="text-xs font-semibold text-gray-600">Valor</label>
            <input
              v-model.number="filters.amountValue"
              type="number"
              placeholder="Ej: 10000"
              class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600"
            />
          </div>

          <template v-if="filters.dateRange === 'custom'">
            <div>
              <label class="text-xs font-semibold text-gray-600">Desde</label>
              <input v-model="filters.customStart" type="date" class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600" />
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-600">Hasta</label>
              <input v-model="filters.customEnd" type="date" class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600" />
            </div>
          </template>
        </div>

        <div v-if="paginatedExpenses.length" class="grid gap-3 mt-3 max-h-[620px] overflow-y-auto pr-2">
          <div v-for="exp in paginatedExpenses" :key="exp.id" class="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h3 class="text-base font-bold text-gray-800">🧾 {{ exp.name }}</h3>
                <p class="text-sm text-gray-600">{{ exp.description || 'Sin descripción' }}</p>
                <p class="text-sm text-gray-700 mt-1">
                  <strong>{{ exp.category || 'Sin categoría' }}</strong> · {{ formatDate(getExpenseDate(exp)) }}
                </p>
                <p class="text-sm font-semibold text-red-600">{{ formatCurrency(exp.amount) }}</p>
              </div>

              <div class="flex flex-col gap-2 shrink-0">
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-100"
                  @click="startEdit(exp)"
                >
                  Editar
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-semibold hover:bg-red-100"
                  @click="deleteExpense(exp)"
                >
                  Eliminar
                </button>
              </div>
            </div>

            <div v-if="editingExpenseId === exp.id" class="mt-4 border-t pt-3 grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 p-3 rounded-lg">
              <input v-model="editDraft.name" type="text" class="px-3 py-2 rounded-lg border border-gray-300" placeholder="Nombre" />
              <input v-model.number="editDraft.amount" type="number" class="px-3 py-2 rounded-lg border border-gray-300" placeholder="Monto" />
              <input v-model="editDraft.category" type="text" class="px-3 py-2 rounded-lg border border-gray-300" placeholder="Categoría" />
              <div class="md:col-span-3 flex gap-2 justify-end">
                <button type="button" class="px-3 py-2 rounded-lg bg-gray-200 text-gray-700" @click="cancelEdit">Cancelar</button>
                <button type="button" class="px-3 py-2 rounded-lg bg-green-600 text-white" @click="saveEdit(exp.id)">Guardar cambios</button>
              </div>
            </div>
          </div>
        </div>

        <p v-else class="text-center text-gray-500 mt-6 text-sm">No se encontraron gastos con los filtros seleccionados.</p>

        <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-4 flex-wrap">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50">«</button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="['px-3 py-1 rounded', currentPage === page ? 'bg-green-700 text-white font-bold' : 'bg-gray-200 text-gray-800']"
          >{{ page }}</button>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50">»</button>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="bg-green-50 border border-green-200 p-5 rounded-xl">
          <p class="text-sm text-gray-600">Saldo inicial</p>
          <p class="text-3xl font-bold text-green-700">{{ formatCurrency(saldos.initialAmount || 0) }}</p>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Ingresos registrados</h3>
          <div v-if="saldosList.length" class="space-y-3 max-h-[520px] overflow-y-auto pr-2">
            <div v-for="item in saldosList" :key="item.id" class="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <p class="font-medium text-gray-800 truncate">💵 {{ item.description || 'Ingreso sin descripción' }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ formatDate(item.date) }}</p>
                </div>
                <div class="shrink-0 text-right">
                  <p class="text-green-700 font-semibold">{{ formatCurrency(item.amount) }}</p>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500">Todavía no agregaste ingresos adicionales.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import BaseHeading from "../components/BaseHeading.vue";

export default {
  components: { BaseHeading },
  data() {
    return {
      db: getFirestore(),
      currentUserUid: null,
      activeTab: "gastos",
      showFilters: false,
      expenses: [],
      currentPage: 1,
      itemsPerPage: 8,
      editingExpenseId: null,
      editDraft: {
        name: "",
        amount: 0,
        category: "",
      },
      filters: {
        dateRange: "month",
        customStart: "",
        customEnd: "",
        category: "",
        amountOperator: "",
        amountValue: null,
      },
      saldos: {
        initialAmount: 0,
        remainingAmount: 0,
        additionalAmounts: [],
      },
      saldosList: [],
    };
  },
  computed: {
    filteredExpenses() {
      const { dateRange, customStart, customEnd, category, amountOperator, amountValue } = this.filters;
      const now = new Date();
      let startDate = null;
      let endDate = null;

      if (dateRange === "week") {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
      } else if (dateRange === "month") {
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
      } else if (dateRange === "year") {
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
      } else if (dateRange === "custom") {
        startDate = customStart ? new Date(`${customStart}T00:00:00`) : null;
        endDate = customEnd ? new Date(`${customEnd}T23:59:59`) : null;
      }

      return this.expenses.filter((exp) => {
        const expAmount = Number(exp.amount || 0);
        const expDate = this.getExpenseDate(exp);

        const matchesCategory = !category || exp.category === category;

        let matchesAmount = true;
        if (amountOperator === ">" && amountValue != null) {
          matchesAmount = expAmount > amountValue;
        } else if (amountOperator === "<" && amountValue != null) {
          matchesAmount = expAmount < amountValue;
        }

        let matchesDate = true;
        if (startDate) {
          matchesDate = expDate >= startDate;
        }
        if (matchesDate && endDate) {
          matchesDate = expDate <= endDate;
        }

        return matchesCategory && matchesAmount && matchesDate;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredExpenses.length / this.itemsPerPage) || 1;
    },
    paginatedExpenses() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredExpenses.slice(start, start + this.itemsPerPage);
    },
    uniqueCategories() {
      return [...new Set(this.expenses.map((e) => e.category).filter(Boolean))];
    },
  },
  methods: {
    getExpenseDate(exp) {
      if (exp.date) return new Date(exp.date);
      if (exp.createdAt?.toDate) return exp.createdAt.toDate();
      return new Date();
    },

    async fetchExpenses(uid) {
      const q = query(collection(this.db, "gastos"), where("uid", "==", uid));
      const snapshot = await getDocs(q);
      this.expenses = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => this.getExpenseDate(b) - this.getExpenseDate(a));
    },

    async fetchSaldos(uid) {
      const qUser = query(collection(this.db, "users"), where("uid", "==", uid));
      const userSnap = await getDocs(qUser);
      if (userSnap.empty) {
        this.saldos = { initialAmount: 0, remainingAmount: 0, additionalAmounts: [] };
        this.saldosList = [];
        return;
      }

      const userDocId = userSnap.docs[0].id;
      const settingsRef = doc(this.db, "users", userDocId, "settings", "montoTotal");
      const settingsSnap = await getDoc(settingsRef);

      if (!settingsSnap.exists()) {
        this.saldos = { initialAmount: 0, remainingAmount: 0, additionalAmounts: [] };
        this.saldosList = [];
        return;
      }

      const data = settingsSnap.data() || {};
      const add = Array.isArray(data.additionalAmounts) ? data.additionalAmounts : [];

      this.saldos = {
        initialAmount: Number(data.initialAmount || 0),
        remainingAmount: Number(data.remainingAmount || 0),
        additionalAmounts: add,
      };

      this.saldosList = add
        .map((item, idx) => ({
          id: String(idx),
          description: item.description || "",
          amount: Number(item.amount || 0),
          date: item.date || null,
        }))
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    },

    startEdit(exp) {
      this.editingExpenseId = exp.id;
      this.editDraft = {
        name: exp.name || "",
        amount: Number(exp.amount || 0),
        category: exp.category || "",
      };
    },

    cancelEdit() {
      this.editingExpenseId = null;
    },

    async saveEdit(expenseId) {
      if (!this.editDraft.name.trim() || Number(this.editDraft.amount) <= 0) return;

      await updateDoc(doc(this.db, "gastos", expenseId), {
        name: this.editDraft.name.trim(),
        amount: Number(this.editDraft.amount),
        category: this.editDraft.category?.trim() || "Sin categoría",
      });

      const idx = this.expenses.findIndex((e) => e.id === expenseId);
      if (idx !== -1) {
        this.expenses[idx] = {
          ...this.expenses[idx],
          name: this.editDraft.name.trim(),
          amount: Number(this.editDraft.amount),
          category: this.editDraft.category?.trim() || "Sin categoría",
        };
      }

      this.editingExpenseId = null;
    },

    async deleteExpense(exp) {
      const ok = window.confirm(`¿Eliminar el gasto "${exp.name}"?`);
      if (!ok) return;

      await deleteDoc(doc(this.db, "gastos", exp.id));
      this.expenses = this.expenses.filter((e) => e.id !== exp.id);
    },

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

    formatDate(dateValue) {
      if (!dateValue) return "—";
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(dateValue).toLocaleDateString("es-AR", options);
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
  watch: {
    filteredExpenses() {
      this.currentPage = 1;
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      this.currentUserUid = user.uid;
      await Promise.all([this.fetchExpenses(user.uid), this.fetchSaldos(user.uid)]);
    });
  },
};
</script>