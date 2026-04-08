<template>
  <!-- CONTENEDOR VERDE - solo fondo -->
  <section class="min-h-screen bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-4 py-16">
   
    <!-- CAJA BLANCA PRINCIPAL -->
    <div class="relative bg-white/95 backdrop-blur-sm text-gray-900 rounded-3xl border border-white/20 w-full max-w-6xl mx-auto p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_45px_rgba(0,0,0,0.45)] transition-shadow duration-500 overflow-hidden">
      
      <!-- Elementos decorativos de fondo -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full -mr-32 -mt-32 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-200/20 to-transparent rounded-full -ml-24 -mb-24 pointer-events-none"></div>
      
      <!-- TODO EL CONTENIDO DENTRO DEL RELATIVE Z-10 -->
      <div class="relative z-10">
        
        <!-- HEADER -->
        <div class="text-center mb-8">
          <BaseHeading class="mb-3">Control de gastos</BaseHeading>
          <p class="text-gray-600 text-lg mb-4">Definí límites por categoría y seguí tu avance en tiempo real</p>
          
          <!-- Info box -->
          <div class="inline-flex items-start gap-3 bg-blue-50 border border-blue-200 px-5 py-3 rounded-xl text-sm text-blue-900 max-w-2xl mx-auto">
            <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-left">Creá presupuestos para controlar tus gastos por categoría. Te avisamos cuando te acerques al límite.</span>
          </div>
        </div>

        <!-- ONBOARDING -->
        <div
          v-if="showOnboarding"
          class="mb-6 bg-amber-50 border-2 border-amber-200 p-5 rounded-2xl"
        >
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p class="text-sm text-amber-900 font-medium flex items-start gap-2">
              <span class="text-xl">👋</span>
              <span>Primera vez acá: podés empezar con un ejemplo rápido y después personalizarlo.</span>
            </p>
            <div class="flex gap-2 flex-shrink-0">
              <button
                type="button"
                @click="applyBudgetExample"
                class="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition whitespace-nowrap"
              >
                Usar ejemplo
              </button>
              <button
                type="button"
                @click="dismissOnboarding"
                class="px-4 py-2 rounded-lg bg-white border-2 border-amber-300 text-amber-900 text-sm font-semibold hover:bg-amber-100 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
       
        <!-- MENSAJE -->
        <div v-if="message" class="mb-6 p-4 rounded-2xl text-black font-medium border-l-4 shadow-sm" :class="messageClass">
          {{ message }}
        </div>

        <!-- LOADER -->
        <div v-if="isLoading" class="flex justify-center items-center mb-8">
          <div class="relative">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-200"></div>
            <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 absolute top-0 left-0"></div>
          </div>
        </div>

        <!-- FORMULARIO -->
        <div class="bg-gradient-to-r from-gray-50 to-green-50/30 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 mb-8">  
          <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            Crear nuevo presupuesto
          </h3>
          
          <form @submit.prevent="addBudget" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre del presupuesto</label>
              <div class="relative">
                <input
                  v-model="newBudgetName"
                  type="text"
                  placeholder="Ej.: Comida, Transporte..."
                  :class="[
                    'w-full px-4 py-4 rounded-xl bg-white border-2 focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm',
                    budgetNameError 
                      ? 'border-red-400 focus:ring-red-100 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-green-100 focus:border-green-500 hover:border-gray-300'
                  ]"
                />
              </div>
              <p v-if="budgetNameError" class="text-sm text-red-500 mt-2 flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                El nombre del presupuesto es obligatorio.
              </p>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Monto del presupuesto</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
                <input
                  v-model.number="newBudgetAmount"
                  type="number"
                  placeholder="15000"
                  :class="[
                    'w-full pl-8 pr-4 py-4 rounded-xl bg-white border-2 focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm',
                    budgetAmountError 
                      ? 'border-red-400 focus:ring-red-100 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-green-100 focus:border-green-500 hover:border-gray-300'
                  ]"
                />
              </div>
              <p v-if="budgetAmountError" class="text-sm text-red-500 mt-2 flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                Ingresá un monto mayor a 0.
              </p>
            </div>

            <div class="lg:col-span-2 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 pt-4">
              <button
                type="submit"
                class="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-green-200"
              >
                <span class="relative z-10 flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Agregar presupuesto
                </span>
              </button>
              <button
                type="button"
                @click="applyBudgetExample"
                class="px-6 py-3 rounded-xl border-2 border-green-200 text-green-700 font-semibold hover:bg-green-50 transition"
              >
                Cargar ejemplo "Comida - $15.000"
              </button>
            </div>
          </form>
        </div>

        <!-- LISTA DE PRESUPUESTOS -->
        <div class="mt-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div class="w-1 h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
              Mis límites de gastos
            </h2>
            <div class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {{ budgets.length }} {{ budgets.length === 1 ? 'presupuesto' : 'presupuestos' }}
            </div>
          </div>

          <div class="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="budget in budgets"
              :key="budget.id"
              class="group bg-white border-2 border-gray-100 hover:border-green-200 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
  <h3 class="font-bold text-xl text-gray-800 group-hover:text-green-700 transition-colors">
    {{ budget.name }}
  </h3>

  <span
    v-if="budget.isExample"
    class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
  >
    Ejemplo
  </span>
</div>
                  <div class="flex items-baseline gap-2">
                    <span class="text-2xl font-bold text-green-600">{{ formatCurrency(budget.amount) }}</span>
                    <span class="text-sm text-gray-500">presupuestado</span>
                  </div>
                </div>
                <button
                  @click="toggleDesglose(budget.id)"
                  :class="[
                    'px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2',
                    activeDesglose === budget.id
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                  ]"
                >
                  <svg 
                    :class="['w-4 h-4 transition-transform', activeDesglose === budget.id ? 'rotate-180' : '']" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                  {{ activeDesglose === budget.id ? 'Ocultar' : 'Ver desglose' }}
                </button>
                  <button
    @click="openDeleteModal(budget)"
    class="px-3 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 text-sm"
  >
    Eliminar
  </button>
              </div>

              <!-- Barra de progreso -->
              <div class="mb-4">
                <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>{{ formatCurrency(getTotalGastado(budget.id)) }} gastados</span>
                  <span>{{ getBudgetProgress(budget) }}%</span>
                </div>
                <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full transition-all duration-300"
                    :class="getBudgetProgressClass(budget)"
                    :style="{ width: `${Math.min(getBudgetProgress(budget), 100)}%` }"
                  ></div>
                </div>
                <p
                  class="text-xs mt-1 font-semibold"
                  :class="getBudgetProgress(budget) >= 100 ? 'text-red-600' : getBudgetProgress(budget) >= 80 ? 'text-amber-600' : 'text-green-600'"
                >
                  {{
                    getBudgetProgress(budget) >= 100
                      ? '⚠️ Superaste el límite'
                      : getBudgetProgress(budget) >= 80
                        ? '⚡ Te estás acercando al límite'
                        : '✅ Vas bien con este límite'
                  }}
                </p>
              </div>

              <!-- Desglose -->
              <div 
                v-if="activeDesglose === budget.id" 
                class="mt-6 bg-gradient-to-r from-green-50 to-emerald-50/50 p-6 rounded-xl border border-green-100 animate-fadeIn"
              >
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                  <h4 class="font-bold text-green-800">Gastos registrados</h4>
                </div>
                
                <div class="space-y-3 max-h-48 overflow-auto custom-scrollbar">
                  <div
                    v-for="exp in getExpensesByBudget(budget.id)"
                    :key="exp.id"
                    class="flex justify-between items-center p-3 bg-white rounded-lg border border-green-100 hover:border-green-200 transition-colors"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span class="font-medium text-gray-800">{{ exp.name }}</span>
                    </div>
                    <span class="font-bold text-green-600">{{ formatCurrency(exp.amount) }}</span>
                  </div>
                  
                  <div v-if="!getExpensesByBudget(budget.id).length" class="text-center py-8">
                    <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                    <p class="text-gray-500 italic">No hay gastos registrados aún</p>
                    <p class="text-sm text-gray-400 mt-1">Los gastos aparecerán aquí cuando los agregues</p>
                  </div>
                </div>

                <!-- Resumen -->
                <div class="mt-6 pt-4 border-t border-green-200 text-sm text-gray-700 space-y-1">
                  <div class="flex justify-between">
                    <span class="font-semibold">Total presupuestado:</span>
                    <span>{{ formatCurrency(budget.amount) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-semibold">Total gastado:</span>
                    <span :class="getTotalGastado(budget.id) > budget.amount ? 'text-red-600 font-bold' : 'text-green-600'">
                      {{ formatCurrency(getTotalGastado(budget.id)) }}
                    </span>
                  </div>
                  <div class="flex justify-between pt-2 border-t border-green-200">
                    <span class="font-bold">Estado:</span>
                    <span :class="getTotalGastado(budget.id) > budget.amount ? 'text-red-600 font-bold' : 'text-green-600 font-semibold'">
                      {{ getTotalGastado(budget.id) > budget.amount ? '❌ Te pasaste del presupuesto' : '✅ Dentro del presupuesto' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado vacío -->
            <div v-if="!budgets.length && !isLoading" class="text-center py-12">
              <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <p class="text-gray-500 text-lg font-medium">No tenés presupuestos creados todavía</p>
              <p class="text-gray-400 mt-2">Agregá tu primer presupuesto usando el formulario de arriba</p>
            </div>
          </div>
        </div>

      </div><!-- Fin relative z-10 -->
    </div><!-- Fin caja blanca -->
  </section>
</template>




<script>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { watch } from 'vue';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  writeBatch,
  query,
  where,
  doc,
  deleteDoc,
  
  
} from 'firebase/firestore';
import BaseHeading from '../components/BaseHeading.vue';


export default {
  name: 'Presupuestos',
  components: { BaseHeading },
setup() {
  const db = getFirestore();
  const auth = getAuth();
  const user = ref(null);

  const newBudgetName = ref('');
  const newBudgetAmount = ref(0);
  const budgets = ref([]);
  const expenses = ref([]);
  const activeDesglose = ref(null);

  const budgetNameError = ref(false);
  const budgetAmountError = ref(false);

  const isExampleMode = ref(false); // 👈 NUEVO
  const showDeleteModal = ref(false);
  const budgetToDelete = ref(null);

   const isLoading = ref(false);
  const message = ref('');
  const messageClass = ref('bg-green-100 border border-green-400 text-green-800');
  const showOnboarding = ref(false);

  const formatCurrency = (v) =>
    `$ ${parseInt(v, 10).toLocaleString('es-AR')}`;

  const loadBudgets = async () => {
    if (!user.value) return;
    isLoading.value = true;
    const snap = await getDocs(
      query(collection(db, 'Presupuestos'), where('uid', '==', user.value.uid))
    );
    budgets.value = snap.docs
  .map((d) => ({ id: d.id, ...d.data() }))
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
    isLoading.value = false;
  };
  watch(newBudgetName, (val) => {
  if (val.trim()) budgetNameError.value = false;

  
});

watch(newBudgetAmount, (val) => {
  if (val > 0) budgetAmountError.value = false;
});

  const loadExpenses = async () => {
    if (!user.value) return;
    const snap = await getDocs(
      query(collection(db, 'gastos'), where('uid', '==', user.value.uid))
    );
    expenses.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  };

   const addBudget = async () => {
  
  budgetNameError.value = !newBudgetName.value.trim();
  budgetAmountError.value = newBudgetAmount.value <= 0;
  isExampleMode.value = false; // 👈 RESET

  
 if (budgetNameError.value || budgetAmountError.value) {
  return;
}



  
  const nombreNormalizado = newBudgetName.value.trim().toLowerCase();
  const yaExiste = budgets.value.some(
    (b) => b.name.trim().toLowerCase() === nombreNormalizado
  );

  if (yaExiste) {
    message.value = 'Ya existe un presupuesto con ese nombre.';
    messageClass.value = 'bg-yellow-100 border border-yellow-400 text-yellow-800';
    setTimeout(() => (message.value = ''), 2500);
    return;
  }

  
 await addDoc(collection(db, 'Presupuestos'), {
  uid: user.value.uid,
  name: newBudgetName.value.trim(),
  amount: newBudgetAmount.value,
  createdAt: new Date().toISOString(),
  isExample: isExampleMode.value // 👈 NUEVO
});

  message.value = 'Presupuesto agregado.';
  messageClass.value = 'bg-green-100 border border-green-400 text-green-800';
  setTimeout(() => (message.value = ''), 2500);

  newBudgetName.value = '';
  newBudgetAmount.value = 0;
  await loadBudgets();
};

  const deleteAllBudgets = async () => {
    if (!budgets.value.length) return;
    const batch = writeBatch(db);
    budgets.value.forEach((b) => {
      const budgetRef = doc(db, 'Presupuestos', b.id);
      batch.delete(budgetRef);
    });
    await batch.commit();
    budgets.value = [];
    message.value = 'Todos los presupuestos han sido eliminados.';
    messageClass.value = 'bg-green-100 border border-green-400 text-green-800';
    setTimeout(() => (message.value = ''), 2000);
  };

  const getTotalGastado = (budgetId) => {
    return expenses.value
      .filter(e => e.budget === budgetId)
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  };

  const toggleDesglose = (id) => {
    activeDesglose.value = activeDesglose.value === id ? null : id;
  };

 const getExpensesByBudget = (budgetId) =>
    expenses.value.filter((e) => e.budget === budgetId);

  const applyBudgetExample = () => {
  newBudgetName.value = 'Comida';
  newBudgetAmount.value = 15000;
  budgetNameError.value = false;
  budgetAmountError.value = false;

  isExampleMode.value = true; // 👈 CLAVE
};
  const dismissOnboarding = () => {
    showOnboarding.value = false;
    if (user.value?.uid) {
      localStorage.setItem(`presupuestos_onboarding_seen_${user.value.uid}`, '1');
    }
  };

  const getBudgetProgress = (budget) => {
    const monto = Number(budget.amount || 0);
    if (monto <= 0) return 0;
    const total = getTotalGastado(budget.id);
    return Math.round((total / monto) * 100);
  };

  const getBudgetProgressClass = (budget) => {
    const progress = getBudgetProgress(budget);
    if (progress >= 100) return 'bg-red-500';
    if (progress >= 80) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const openDeleteModal = (budget) => {
  budgetToDelete.value = budget;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!budgetToDelete.value) return;

  await deleteDoc(doc(db, 'Presupuestos', budgetToDelete.value.id));

  message.value = 'Presupuesto eliminado.';
  messageClass.value = 'bg-red-100 border border-red-400 text-red-800';

  showDeleteModal.value = false;
  budgetToDelete.value = null;

  await loadBudgets();

  setTimeout(() => (message.value = ''), 2000);
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  budgetToDelete.value = null;
};

 const deleteBudget = async (budget) => {
  const confirmDelete = confirm(
    `¿Seguro que querés eliminar el presupuesto "${budget.name}"?`
  );

  if (!confirmDelete) return;

  await deleteDoc(doc(db, 'Presupuestos', budget.id));

  message.value = 'Presupuesto eliminado.';
  messageClass.value = 'bg-red-100 border border-red-400 text-red-800';
  setTimeout(() => (message.value = ''), 2000);

  await loadBudgets();
};

  onMounted(() => {
    auth.onAuthStateChanged(async (u) => {
        if (u) {
        user.value = u;
        const onboardingSeen = localStorage.getItem(`presupuestos_onboarding_seen_${u.uid}`);
        showOnboarding.value = onboardingSeen !== '1';
        await loadBudgets();
        await loadExpenses();
      }
    });
  });

  return {
    newBudgetName,
    newBudgetAmount,
    budgets,
    expenses,
    activeDesglose,
    isLoading,
    message,
    messageClass,
    formatCurrency,
    addBudget,
    deleteAllBudgets,
    toggleDesglose,
    getExpensesByBudget,
    budgetNameError,
    budgetAmountError,
    getTotalGastado,
    applyBudgetExample,
    dismissOnboarding,
    showOnboarding,
    getBudgetProgress,
    getBudgetProgressClass,
    deleteBudget,
    showDeleteModal,
    budgetToDelete,
    openDeleteModal,
    confirmDelete,
    cancelDelete,
  };
}

};
</script>
<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #10b981;
  border-radius: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #059669;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
