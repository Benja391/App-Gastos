<template>
  <section class="flex items-center justify-center min-h-screen bg-[#08a04b] text-white px-4 py-10 mt-8">
    <div
      class="relative bg-white/95 backdrop-blur-sm text-gray-900 rounded-3xl border border-white/20 w-full max-w-3xl p-6 md:p-8 grid gap-6 mt-1 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_45px_rgba(0,0,0,0.45)] transition-shadow duration-500"
    >
      <div v-if="loading" class="flex justify-center items-center">
        <div class="relative">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-green-200"></div>
          <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-green-600 absolute top-0 left-0"></div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 gap-5">
        <div class="space-y-2">
          <label for="name" class="block text-sm font-semibold text-gray-700">Nombre del gasto *</label>
          <BaseInputs
            id="name"
            v-model="expense.name"
            type="text"
            placeholder="Ej: Supermercado"
            class="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
            @blur="markTouched('name')"
          />
          <p v-if="showFieldError('name')" class="text-sm text-red-600 font-medium">{{ errors.name }}</p>
        </div>

        <div class="space-y-2">
          <label for="amount" class="block text-sm font-semibold text-gray-700">Monto *</label>
          <BaseInputs
            id="amount"
            v-model="expense.amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="Ej: 12000"
            class="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
            @blur="markTouched('amount')"
          />
          <p v-if="showFieldError('amount')" class="text-sm text-red-600 font-medium">{{ errors.amount }}</p>
        </div>

        <div class="space-y-2">
          <label for="category" class="block text-sm font-semibold text-gray-700">Categoría *</label>

          <select
            v-if="!isOtherCategorySelected"
            id="category"
            v-model="expense.category"
            class="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
            @change="handleCategoryChange"
            @blur="markTouched('category')"
          >
            <option value="" disabled>Seleccioná una categoría</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
            <option value="Otra">Otro</option>
          </select>

          <div v-else class="space-y-2">
            <BaseInputs
              id="customCategory"
              v-model="customCategory"
              type="text"
              placeholder="Escribí tu nueva categoría"
              class="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
              @blur="markTouched('customCategory')"
            />
            <button
              type="button"
              class="text-sm text-green-700 hover:text-green-800 font-semibold underline"
              @click="resetToDefaultCategory"
            >
              Volver a categorías sugeridas
            </button>
            <p class="text-xs text-gray-500">Se guardará en tu cuenta para usarla más adelante.</p>
          </div>

          <p v-if="showFieldError('category')" class="text-sm text-red-600 font-medium">{{ errors.category }}</p>
        </div>

        <div class="space-y-2">
          <label for="date" class="block text-sm font-semibold text-gray-700">Fecha (opcional)</label>
          <BaseInputs
            id="date"
            v-model="expense.date"
            type="date"
            class="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
            @blur="markTouched('date')"
          />
          <p v-if="showFieldError('date')" class="text-sm text-red-600 font-medium">{{ errors.date }}</p>
        </div>

        <details class="rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3">
          <summary class="cursor-pointer font-semibold text-gray-700">Agregar notas (opcional)</summary>
          <textarea
            id="notes"
            v-model="expense.description"
            rows="3"
            placeholder="Ej: Compra mensual / promoción 2x1"
            class="mt-3 w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
          ></textarea>
        </details>

        <div class="rounded-2xl border border-green-200 bg-green-50/60 p-4">
          <h3 class="text-sm font-bold text-green-800 mb-2">Vista previa del gasto</h3>
          <p class="text-sm text-gray-700"><strong>Nombre:</strong> {{ expense.name || '—' }}</p>
          <p class="text-sm text-gray-700"><strong>Monto:</strong> {{ previewAmount }}</p>
          <p class="text-sm text-gray-700"><strong>Categoría:</strong> {{ previewCategory }}</p>
          <p class="text-sm text-gray-700"><strong>Fecha:</strong> {{ previewDate }}</p>
          <p class="text-sm text-gray-700"><strong>Notas:</strong> {{ expense.description || 'Sin notas' }}</p>
        </div>

        <div v-if="message" class="mt-2 p-4 rounded-2xl font-medium border-l-4 shadow-sm text-center" :class="messageClass">
          {{ message }}
        </div>

        <div class="flex justify-center pt-2">
          <button
            type="submit"
            class="group relative px-8 py-4 bg-green-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:opacity-70"
            :disabled="loading"
          >
            <span :class="{ 'animate-pulse': saveSuccessAnimation }" class="relative z-10">
              {{ saveSuccessAnimation ? '¡Guardado!' : 'Agregar gasto' }}
            </span>
          </button>
        </div>
      </form>
    </div>

    <transition name="fade-up">
      <div
        v-if="showToast"
        class="fixed top-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-xl font-semibold"
      >
        ✅ Gasto guardado correctamente
      </div>
    </transition>
  </section>
</template>

<script>
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import BaseInputs from "../components/BaseInputs.vue";

const DEFAULT_CATEGORIES = ["Alimentos", "Transporte", "Hogar", "Entretenimiento", "Educación", "Salud"];

export default {
  name: "CargarGasto",
  components: { BaseInputs },

  data() {
    return {
      expense: {
        name: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      },
      loading: false,
      message: "",
      messageClass: "bg-red-100 border border-red-400 text-red-600 font-semibold",
      categories: [...DEFAULT_CATEGORIES],
      isOtherCategorySelected: false,
      customCategory: "",
      touched: {
        name: false,
        amount: false,
        category: false,
        customCategory: false,
        date: false,
      },
      submitAttempted: false,
      showToast: false,
      saveSuccessAnimation: false,
    };
  },

  computed: {
    errors() {
      const output = {
        name: "",
        amount: "",
        category: "",
        date: "",
      };

      if (!this.expense.name || this.expense.name.trim().length < 2) {
        output.name = "Ingresá un nombre válido (mínimo 2 caracteres).";
      }

      const amountNumber = Number(this.expense.amount);
      if (!this.expense.amount || Number.isNaN(amountNumber) || amountNumber <= 0) {
        output.amount = "El monto debe ser mayor a 0.";
      }

      const categoryValue = this.isOtherCategorySelected ? this.customCategory.trim() : this.expense.category;
      if (!categoryValue) {
        output.category = "Seleccioná una categoría o escribí una nueva.";
      }

      if (this.expense.date) {
        const selected = new Date(`${this.expense.date}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected > today) {
          output.date = "La fecha no puede ser posterior a hoy.";
        }
      }

      return output;
    },

    hasErrors() {
      return Object.values(this.errors).some(Boolean);
    },

    previewCategory() {
      return this.isOtherCategorySelected
        ? this.customCategory.trim() || "—"
        : this.expense.category || "—";
    },

    previewAmount() {
      const amountNumber = Number(this.expense.amount || 0);
      if (!amountNumber) return "—";
      return this.formatCurrency(amountNumber);
    },

    previewDate() {
      if (!this.expense.date) return "Sin fecha";
      const parsedDate = new Date(`${this.expense.date}T00:00:00`);
      return parsedDate.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },

  mounted() {
    this.fetchCustomCategories();
  },

  methods: {
    markTouched(field) {
      this.touched[field] = true;
    },

    showFieldError(field) {
      if (field === "category" && this.isOtherCategorySelected) {
        return (this.touched.customCategory || this.submitAttempted) && Boolean(this.errors.category);
      }
      return (this.touched[field] || this.submitAttempted) && Boolean(this.errors[field]);
    },

    async fetchCustomCategories() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const db = getFirestore();
        const categoriesRef = collection(db, "users", user.uid, "expenseCategories");
        const snapshot = await getDocs(categoriesRef);
        const savedCategories = snapshot.docs
          .map((d) => (d.data().name || "").trim())
          .filter(Boolean);

        this.categories = [...new Set([...DEFAULT_CATEGORIES, ...savedCategories])];
      } catch (error) {
        console.error("Error al cargar categorías personalizadas:", error);
      }
    },

    handleCategoryChange(event) {
      this.touched.category = true;
      if (event.target.value === "Otra") {
        this.isOtherCategorySelected = true;
        this.expense.category = "";
        return;
      }

      this.isOtherCategorySelected = false;
      this.customCategory = "";
    },

    resetToDefaultCategory() {
      this.isOtherCategorySelected = false;
      this.customCategory = "";
      this.expense.category = "";
      this.touched.customCategory = false;
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(value);
    },

    async saveCustomCategoryIfNeeded(db, userUid, categoryName) {
      const cleanName = categoryName.trim();
      if (!cleanName) return;

      const normalized = cleanName.toLowerCase();
      const existsLocal = this.categories.some((cat) => cat.toLowerCase() === normalized);
      if (!existsLocal) {
        this.categories.push(cleanName);
      }

      if (!this.isOtherCategorySelected) return;

      const categoriesRef = collection(db, "users", userUid, "expenseCategories");
      const existingQuery = query(categoriesRef, where("name", "==", cleanName));
      const existing = await getDocs(existingQuery);
      if (existing.empty) {
        await addDoc(categoriesRef, {
          name: cleanName,
          createdAt: new Date(),
        });
      }
    },

    async handleSubmit() {
      this.submitAttempted = true;
      this.message = "";

      if (this.hasErrors) {
        this.message = "Revisá los campos marcados para continuar.";
        this.messageClass = "bg-red-100 border border-red-400 text-red-600 font-semibold";
        return;
      }

      this.loading = true;

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          this.message = "Debes estar autenticado para registrar un gasto.";
          this.messageClass = "bg-red-100 border border-red-400 text-red-600 font-semibold";
          this.loading = false;
          return;
        }

        const db = getFirestore();
        const categoryToSave = this.isOtherCategorySelected
          ? this.customCategory.trim()
          : this.expense.category;

        await this.saveCustomCategoryIfNeeded(db, user.uid, categoryToSave);

        const expenseData = {
          uid: user.uid,
          name: this.expense.name.trim(),
          amount: Number(this.expense.amount),
          category: categoryToSave,
          date: this.expense.date || new Date().toISOString().split("T")[0],
          description: this.expense.description?.trim() || "",
          createdAt: new Date(),
        };

        await addDoc(collection(db, "gastos"), expenseData);

        this.showToast = true;
        this.saveSuccessAnimation = true;
        this.message = "Gasto registrado correctamente.";
        this.messageClass = "bg-green-100 border border-green-400 text-green-700 font-semibold";

        setTimeout(() => {
          this.showToast = false;
          this.saveSuccessAnimation = false;
          this.$router.push({ path: "/Monto-Total" });
        }, 1200);
      } catch (error) {
        console.error("Error al guardar el gasto:", error);
        this.message = "No se pudo guardar el gasto. Intentá nuevamente.";
        this.messageClass = "bg-red-100 border border-red-400 text-red-600 font-semibold";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.25s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>