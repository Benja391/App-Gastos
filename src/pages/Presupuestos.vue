<template>
 <!-- CONTENEDOR VERDE -->
<section class="flex items-center justify-center min-h-screen bg-[#08a04b] text-white px-4 py-10 mt-8">
  <!-- CAJA BLANCA -->
  <div class="relative bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl p-10 grid gap-8 mt-1">
      <BaseHeading >
        Presupuestos
      </BaseHeading>
      <!-- Mensaje -->
      <div v-if="message" class="mb-4 p-4 rounded text-black font-medium" :class="messageClass">
        {{ message }}
      </div>

      <!-- Loader -->
      <div v-if="isLoading" class="flex justify-center items-center mb-6">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
      </div>

     <!-- Formulario de presupuesto -->
<form @submit.prevent="addBudget" class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl shadow-md">
  <div>
    <label class="block text-sm font-semibold mb-2">Nombre del presupuesto</label>
    <input
      v-model="newBudgetName"
      type="text"
      placeholder="Ej: Comida, Transporte..."
      :class="[
        'w-full px-4 py-2 rounded-lg bg-white border focus:outline-none focus:ring-2',
        budgetNameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-600'
      ]"
    />
    <p v-if="budgetNameError" class="text-sm text-red-600 mt-1">El nombre del presupuesto es obligatorio.</p>
  </div>

  <div>
    <label class="block text-sm font-semibold mb-2">Monto del presupuesto</label>
    <input
      v-model.number="newBudgetAmount"
      type="number"
      placeholder="Ej: 15000"
      :class="[
        'w-full px-4 py-2 rounded-lg bg-white border focus:outline-none focus:ring-2',
        budgetAmountError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-600'
      ]"
    />
    <p v-if="budgetAmountError" class="text-sm text-red-600 mt-1">Ingresá un monto mayor a 0.</p>
  </div>

  <div class="col-span-full px-6">
    <button
      type="submit"
      class="w-55 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md mx-auto block"
    >
      Agregar Presupuesto
    </button>
  </div>
</form>

      <!-- Lista de presupuestos -->
      <div class="max-h-[600px] overflow-y-auto pr-2">
        <h2 class="text-2xl font-bold text-black border-b-2 border-green-200 pb-2 mb-6">Listado de Presupuestos</h2>

        <ul class="space-y-6">
          <li
            v-for="budget in budgets"
            :key="budget.id"
            class="bg-white border border-green-200 p-5 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-semibold text-lg text-green-700">{{ budget.name }}</h3>
                <p class="text-sm text-gray-600">{{ formatCurrency(budget.amount) }}</p>
              </div>
              <button
                @click="toggleDesglose(budget.id)"
                class="text-green-600 hover:underline text-sm font-medium"
              >
                {{ activeDesglose === budget.id ? 'Ocultar desglose' : 'Ver desglose' }}
              </button>
            </div>

            <!-- Detalle del presupuesto -->
            <div v-if="activeDesglose === budget.id" class="mt-4 bg-green-50 p-4 rounded-lg">
              <h4 class="font-medium text-green-800 mb-2">Gastos en este presupuesto:</h4>
              <ul class="space-y-2 max-h-48 overflow-auto text-sm">
                <li
                  v-for="exp in getExpensesByBudget(budget.id)"
                  :key="exp.id"
                  class="flex justify-between text-gray-800"
                >
                  <span>{{ exp.name }}</span>
                  <span>{{ formatCurrency(exp.amount) }}</span>
                </li>
                <li v-if="!getExpensesByBudget(budget.id).length" class="text-gray-500 italic">
                  No hay gastos registrados.
                </li>
              </ul>
            </div>
          </li>
        </ul>

        <!-- Eliminar todos -->
        <!-- <button
          @click="deleteAllBudgets"
          class="mt-10 w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-300 shadow-md"
        >
           Eliminar Todos los Presupuestos
        </button> -->
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
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // ⬅️ Orden descendente
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
  // Validaciones
  budgetNameError.value = !newBudgetName.value.trim();
  budgetAmountError.value = newBudgetAmount.value <= 0;

  // Ocultar mensajes de error tras 2.5 segundos
 if (budgetNameError.value || budgetAmountError.value) {
  return;
}

  // Verificar nombre duplicado
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

  // Guardar presupuesto
  await addDoc(collection(db, 'Presupuestos'), {
    uid: user.value.uid,
    name: newBudgetName.value.trim(),
    amount: newBudgetAmount.value,
     createdAt: new Date().toISOString(), // ⬅️ Agregado
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

  const toggleDesglose = (id) => {
    activeDesglose.value = activeDesglose.value === id ? null : id;
  };

  const getExpensesByBudget = (budgetId) =>
    expenses.value.filter((e) => e.budget === budgetId);

  onMounted(() => {
    auth.onAuthStateChanged(async (u) => {
      if (u) {
        user.value = u;
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
  };
}

};
</script>

<style scoped>

.shadow-\[0_15px_30px_rgba\(0\,0\,0\,0\.6\)\] { box-shadow: 0 15px 30px rgba(0,0,0,0.6); }
</style>
