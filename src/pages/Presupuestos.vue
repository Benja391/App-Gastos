<template>
  <section class="flex items-center justify-center min-h-screen bg-[#08a04b] text-white py-4">
    <div class="relative bg-gray-900 rounded-lg shadow-[0_15px_30px_rgba(0,0,0,0.6)] w-full max-w-2xl p-8 my-4">
      
    
      <div v-if="message" class="mb-4 p-4 rounded" :class="messageClass">
        {{ message }}
      </div>
      <div v-if="isLoading" class="flex justify-center items-center mb-6">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      
      <form @submit.prevent="addBudget" class="space-y-5 mb-10">
        <div>
          <label class="block text-lg font-medium mb-1">Nombre del presupuesto</label>
          <input
            v-model="newBudgetName"
            type="text"
            placeholder="Ej: Comida, Transporte..."
            class="w-full px-4 py-2 rounded-lg bg-white text-gray-900"
            required
          />
        </div>
        <div>
          <label class="block text-lg font-medium mb-1">Monto del presupuesto</label>
          <input
            v-model.number="newBudgetAmount"
            type="number"
            placeholder="Ej: 15000"
            class="w-full px-4 py-2 rounded-lg bg-white text-gray-900"
            min="1"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition"
        >
          Agregar Presupuesto
        </button>
      </form>

  
      <div>
        <h2 class="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Presupuestos</h2>

        <ul class="space-y-6">
          <li
            v-for="budget in budgets"
            :key="budget.id"
            class="bg-green-100 text-gray-900 p-5 rounded-lg shadow hover:bg-green-200 transition"
          >
         
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-semibold">{{ budget.name }}</h3>
                <p class="text-sm text-gray-700">{{ formatCurrency(budget.amount) }}</p>
              </div>
              <button
                @click="toggleDesglose(budget.id)"
                class="text-blue-600 hover:underline text-sm"
              >
                {{ activeDesglose === budget.id ? 'Ocultar desglose' : 'Ver desglose' }}
              </button>
            </div>

    
            <div v-if="activeDesglose === budget.id" class="mt-4 bg-gray-400 p-4 rounded-lg">
              <h4 class="font-medium mb-2">Gastos en este presupuesto:</h4>
              <ul class="space-y-2 mb-4 max-h-48 overflow-auto">
                <li
                  v-for="exp in getExpensesByBudget(budget.id)"
                  :key="exp.id"
                  class="flex justify-between text-white"
                >
                  <span>{{ exp.name }}</span>
                  <span>{{ formatCurrency(exp.amount) }}</span>
                </li>
                <li
                  v-if="!getExpensesByBudget(budget.id).length"
                  class="text-gray-500 italic"
                >
                  No hay gastos registrados.
                </li>
              </ul>
            </div>
          </li>
        </ul>

        <button
          @click="deleteAllBudgets"
          class="mt-8 w-full py-3 bg-red-600 hover:bg-red-500 rounded-lg font-semibold transition"
        >
          Eliminar Todos los Presupuestos
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
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
    const user = auth.currentUser;

    const newBudgetName = ref('');
    const newBudgetAmount = ref(0);
    const budgets = ref([]);
    const expenses = ref([]);
    const activeDesglose = ref(null);

    const isLoading = ref(false);
    const message = ref('');
    const messageClass = ref('bg-green-100 border border-green-400 text-green-800');

   
    const formatCurrency = (v) =>
      `$ ${parseInt(v, 10).toLocaleString('es-AR')}`;

   
    const loadBudgets = async () => {
      if (!user) return;
      isLoading.value = true;
      const snap = await getDocs(query(collection(db, 'Presupuestos'), where('uid', '==', user.uid)));
      budgets.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      isLoading.value = false;
    };
    const loadExpenses = async () => {
      if (!user) return;
      const snap = await getDocs(query(collection(db, 'gastos'), where('uid', '==', user.uid)));
      expenses.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };

  
    const addBudget = async () => {
      if (!newBudgetName.value || newBudgetAmount.value <= 0) return;
      await addDoc(collection(db, 'Presupuestos'), {
        uid: user.uid,
        name: newBudgetName.value,
        amount: newBudgetAmount.value
      });
      message.value = 'Presupuesto agregado.';
      setTimeout(() => (message.value = ''), 2000);
      newBudgetName.value = '';
      newBudgetAmount.value = 0;
      await loadBudgets();
    };

    
   const deleteAllBudgets = async () => {
  if (!budgets.value.length) return;

  const batch = writeBatch(db);

  budgets.value.forEach(b => {
   
    const budgetRef = doc(db, 'Presupuestos', b.id);
    batch.delete(budgetRef);
  });

  await batch.commit();
  budgets.value = [];
  message.value = 'Todos los presupuestos han sido eliminados.';
  setTimeout(() => {
    message.value = '';
  }, 2000);
};

    
    const toggleDesglose = (id) => {
      activeDesglose.value = activeDesglose.value === id ? null : id;
    };
    const getExpensesByBudget = (budgetId) =>
      expenses.value.filter(e => e.budget === budgetId);

    onMounted(async () => {
      await loadBudgets();
      await loadExpenses();
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
      getExpensesByBudget
    };
  }
};
</script>

<style scoped>

.shadow-\[0_15px_30px_rgba\(0\,0\,0\,0\.6\)\] { box-shadow: 0 15px 30px rgba(0,0,0,0.6); }
</style>
