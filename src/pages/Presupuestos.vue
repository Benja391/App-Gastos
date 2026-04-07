<template>
  
  <section class="flex items-center justify-center min-h-screen bg-[#08a04b] text-white px-4 py-10 mt-8">
   
    <div class="relative bg-white/95 backdrop-blur-sm text-gray-900 rounded-3xl  border border-white/20 w-full max-w-5xl p-8 grid gap-8 mt-1 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.35)]
         hover:shadow-[0_12px_45px_rgba(0,0,0,0.45)]
         transition-shadow duration-500">
      
      <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full -mr-32 -mt-32"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-200/20 to-transparent rounded-full -ml-24 -mb-24"></div>
      
      <div class="relative z-10 flex flex-col gap-6">
        <BaseHeading >Control de gastos</BaseHeading>
        <p class="text-center text-gray-600 mb-2">Definí límites por categoría y seguí tu avance en tiempo real</p>
        <div class="flex justify-center mb-6">
          <div class="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl text-sm text-blue-900">
            <span>ℹ️</span>
            <span>Creá presupuestos para controlar tus gastos por categoría. Te avisamos cuando te acerques al límite.</span>
          </div>
        </div>

        <div
          v-if="showOnboarding"
          class="mb-6 bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        >
          <p class="text-sm text-amber-900 font-medium">
            👋 Primera vez acá: podés empezar con un ejemplo rápido y después personalizarlo.
          </p>
          <div class="flex gap-2">
            <button
              type="button"
              @click="applyBudgetExample"
              class="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
            >
              Usar ejemplo “Comida - $15.000”
            </button>
            <button
              type="button"
              @click="dismissOnboarding"
              class="px-4 py-2 rounded-lg bg-white border border-amber-300 text-amber-900 text-sm font-semibold hover:bg-amber-100 transition"
            >
              Entendido
            </button>
          </div>
        </div>

       
        <div v-if="message" class="mb-6 p-4 rounded-2xl text-black font-medium border-l-4 shadow-sm" :class="messageClass">
          {{ message }}
        </div>

       
        <div v-if="isLoading" class="flex justify-center items-center mb-8">
          <div class="relative">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-200"></div>
            <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 absolute top-0 left-0"></div>
          </div>
        </div>

        
        <div class="w-full bg-gradient-to-r from-gray-50 to-green-50/30 p-8 rounded-2xl shadow-lg border border-gray-100">  
          <form @submit.prevent="addBudget" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 mb-3">Nombre del presupuesto</label>
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
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div class="w-2 h-2 bg-green-400 rounded-full opacity-60"></div>
                </div>
              </div>
              <p v-if="budgetNameError" class="text-sm text-red-500 mt-2 flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                El nombre del presupuesto es obligatorio.
              </p>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 mb-3">Monto del presupuesto</label>
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

            <div class="lg:col-span-2 flex flex-col md:flex-row justify-center items-center gap-3 pt-4">
              <button
                type="submit"
                class="group relative px-8 py-4 bg-green-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-green-200"
              >
                <span class="relative z-10 flex items-center gap-2">
                  Agregá presupuesto
                </span>
                <div class="absolute inset-0 bg-green-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                type="button"
                @click="applyBudgetExample"
                class="px-6 py-3 rounded-xl border-2 border-green-200 text-green-700 font-semibold hover:bg-green-50 transition"
              >
                Cargar ejemplo “Comida - $15.000”
              </button>
            </div>
          </form>
        </div>

        
        <div class="w-full clear-both rounded-2xl bg-white/70 border border-gray-100 p-6 md:p-8">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div class="w-1 h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
              Mis límites de gasto
            </h2>
            <div class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {{ budgets.length }} {{ budgets.length === 1 ? 'presupuesto' : 'presupuestos' }}
            </div>
          </div>

          <div class="space-y-6 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
            <div
              v-for="budget in budgets"
              :key="budget.id"
              class="w-full group bg-white border-2 border-gray-100 hover:border-green-200 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="font-bold text-xl text-gray-800 group-hover:text-green-700 transition-colors">{{ budget.name }}</h3>
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
              </div>

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
                      ? 'Superaste el límite'
                      : getBudgetProgress(budget) >= 80
                        ? 'Te estás acercando al límite'
                        : 'Vas bien con este límite'
                  }}
                </p>
              </div>

             
              <div 
                v-if="activeDesglose === budget.id" 
                class="mt-6 bg-gradient-to-r from-green-50 to-emerald-50/50 p-6 rounded-xl border border-green-100 animate-fadeIn"
              >
                <div class="flex items-center gap-2 mb-4">
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

                
                <div class="mt-6 text-sm text-gray-700">
                  <p><strong>Total presupuestado:</strong> {{ formatCurrency(budget.amount) }}</p>
                  <p><strong>Total gastado:</strong> {{ formatCurrency(getTotalGastado(budget.id)) }}</p>
                  <p :class="getTotalGastado(budget.id) > budget.amount ? 'text-red-600 font-bold' : 'text-green-600 font-semibold'">
                    {{ getTotalGastado(budget.id) > budget.amount ? 'Te pasaste del presupuesto' : 'Dentro del presupuesto' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
