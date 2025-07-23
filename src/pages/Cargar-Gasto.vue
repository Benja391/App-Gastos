  <template>
  <section class="flex items-center justify-center min-h-screen bg-[#08a04b] text-white py-10 px-4 mt-8">
    <div class="w-full max-w-3xl bg-white text-gray-900 rounded-2xl shadow-2xl p-10 grid gap-8">

      <!-- Mensaje -->
      <div v-if="message" class="p-4 rounded-lg text-black text-sm font-medium" :class="messageClass">
        {{ message }}
      </div>

      <!-- Loading spinner -->
      <div v-if="loading" class="flex justify-center items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="grid gap-6">

        <!-- Nombre del gasto -->
        <div>
          <label for="name" class="block text-sm font-semibold mb-1">Nombre del gasto</label>
          <BaseInputs 
            type="text"
            id="name"
            v-model="expense.name"
            placeholder="Ingrese el nombre del gasto"
          
            required
            :class="[
    'w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2',
    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-600'
  ]"
/>
<p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
        </div>

        <!-- Monto del gasto -->
        <div>
          <label for="amount" class="block text-sm font-semibold mb-1">Monto del gasto</label>
          <BaseInputs 
            type="number"
            id="amount"
            v-model="expense.amount"
            step="0.01"
            placeholder="Ingrese monto del gasto"
            required
            :class="[
    'w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2',
    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-600'
  ]"
/>
<p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
        </div>

        <!-- Presupuesto -->
        <div>
          <label for="budget" class="block text-sm font-semibold mb-1">Presupuesto asignado</label>
          <select 
            v-model="expense.budget" 
            id="budget" 
      :class="[
      'w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2',
      errors.budget ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-600'
    ]"
  >
            <option value="" disabled>Seleccione un presupuesto</option>
            <option v-for="budget in budgets" :key="budget.id" :value="budget.id">
              {{ budget.name }}
            </option>
            <option value="none">No asignar a presupuesto</option>
          </select>
            <!-- Mensaje de error -->
  <p v-if="errors.budget" class="text-sm text-red-600 mt-1">{{ errors.budget }}</p>
        </div>

        <!-- Categoría -->
        <div>
          <label for="category" class="block text-sm font-semibold mb-1">Categoría</label>
          <div>
            <select
              v-if="!isOtherCategorySelected"
              v-model="expense.category"
              id="category"
              @change="handleCategoryChange"
          :class="[
      'w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2',
      errors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-600'
    ]"
  >

              <option value="" disabled>Seleccione una categoría</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
              <option value="Otra">Otra</option>
            </select>
             <!-- ⚠️ Aquí está el mensaje -->
  <p v-if="errors.category" class="text-sm text-red-600 mt-1">{{ errors.category }}</p>

            <div v-else class="mt-3">
              <BaseInputs
                type="text"
                id="customCategory"
                v-model="customCategory"
                placeholder="Escribe tu categoría"
                required
                :class="[
    'w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2',
    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-600'
  ]"
/>
<p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
            </div>
          </div>
        </div>

        <!-- Descripción -->
        <div>
          <label for="description" class="block text-sm font-semibold mb-1">Descripción del gasto</label>
          <BaseInputs 
            type="text"
            id="description"
            v-model="expense.description"
            placeholder="Describe brevemente el gasto"
           :class="[
    'w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2',
    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-600'
  ]"
/>
<p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
        </div>

        <!-- Método de pago -->
        <div>
          <label for="paymentMethod" class="block text-sm font-semibold mb-1">Método de pago</label>
          <select 
            v-model="expense.paymentMethod" 
            id="paymentMethod" 
            @change="handlePaymentMethodChange"
        :class="[
      'w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2',
      errors.paymentMethod ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-600'
    ]"
  >
            <option value="" disabled>Seleccione un método de pago</option>
            <option v-for="method in paymentMethods" :key="method" :value="method">
              {{ method }}
            </option>
          </select>
           <!-- ⚠️ Mensaje debajo -->
  <p v-if="errors.paymentMethod" class="text-sm text-red-600 mt-1">{{ errors.paymentMethod }}</p>
        </div>

        <!-- Detalles tarjeta -->
        <CreditCardDetails 
          v-if="showCreditCardDetails"
          v-model:cardType="expense.creditCard.type"
          v-model:installments="expense.creditCard.installments"
          @calculate-installments="calculateInstallments"
        />

        <!-- Desglose de cuotas -->
        <div
          v-if="showInstallmentBreakdown"
          class="p-5 bg-green-50 border border-green-200 rounded-xl text-sm text-gray-800"
        >
          <h3 class="text-base font-semibold mb-2">Desglose de cuotas</h3>
          <p>Monto total: {{ formatCurrency(expense.amount) }}</p>
          <p>Número de cuotas: {{ expense.creditCard.installments }}</p>
          <p>Monto por cuota: {{ formatCurrency(installmentAmount) }}</p>
        </div>

        <!-- Botón principal -->
        <button 
          type="submit"
          class="w-55 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md mx-auto block"
        >
          {{ editing ? 'Actualizar Gasto' : 'Agregar gasto' }}
        </button>
      </form>
    </div>
  </section>
</template>

 <script>
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  getDocs
} from "firebase/firestore";
import BaseHeading from '../components/BaseHeading.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseInputs from '../components/BaseInputs.vue';
import CreditCardDetails from '../components/DetallesCredito.vue';
import { watch } from "vue";

export default {
  name: "CargarGasto",
  components: { BaseHeading, BaseButton, BaseInputs, CreditCardDetails },

  data() {
    return {
      expense: {
        name: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        budget: '',
        paymentMethod: '',
        creditCard: {
          type: '',
          installments: 1
        }
      },
      errors: {
        name: '',
        amount: '',
        category: '',
        paymentMethod: '',
        creditCardType: '',
        budget: ''
      },
      loading: false,
      editing: false,
      categories: ["Alimentos", "Transporte", "Hogar", "Entretenimiento", "Educación", "Salud"],
      isOtherCategorySelected: false,
      customCategory: '',
      budgets: [],
      paymentMethods: ["Efectivo", "Tarjeta de Débito", "Tarjeta de Crédito", "Transferencia Bancaria", "Billetera Virtual"],
      showCreditCardDetails: false,
      installmentAmount: 0,
      message: '',
      messageClass: ''
    };
  },

  computed: {
    showInstallmentBreakdown() {
      return this.expense.paymentMethod === 'Tarjeta de Crédito' &&
        this.expense.creditCard.installments > 1 &&
        this.expense.amount > 0;
    }
  },

  mounted() {
    this.fetchBudgets();

      watch(() => this.expense.name, (val) => {
      if (val.trim()) this.errors.name = '';
    });

      watch(() => this.expense.amount, (val) => {
      if (val > 0) this.errors.amount = '';
    });

      watch(() => this.expense.category, (val) => {
        if (val) this.errors.category = '';
    });

      watch(() => this.customCategory, (val) => {
        if (val.trim()) this.errors.category = '';
    });

      watch(() => this.expense.budget, (val) => {
        if (val || val === 'none') this.errors.budget = '';
    });

      watch(() => this.expense.paymentMethod, (val) => {
        if (val) this.errors.paymentMethod = '';
    });

      watch(() => this.expense.creditCard.type, (val) => {
        if (val) this.errors.creditCardType = '';
    });
  },

 methods: {
  validarCampos() {
    if (!valid) {
      this.message = 'Por favor completá todos los campos obligatorios.';
      this.messageClass = 'bg-red-100 border border-red-400 text-red-600 font-semibold';
      this.clearMessageAfterDelay();
      return;
    }
    // Aquí iría el resto de la lógica si el formulario es válido
  },

 

    async fetchBudgets() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) return;

        const db = getFirestore();
        const budgetsSnapshot = await getDocs(collection(db, "Presupuestos"));
        this.budgets = [];

        budgetsSnapshot.forEach((doc) => {
          const budget = doc.data();
          if (budget.uid === user.uid) {
            this.budgets.push({
              id: doc.id,
              name: budget.name,
              amount: budget.amount
            });
          }
        });
      } catch (error) {
        console.error("Error al cargar presupuestos:", error);
      }
    },

    handleCategoryChange(event) {
      if (event.target.value === 'Otra') {
        this.isOtherCategorySelected = true;
        this.expense.category = '';
      } else {
        this.isOtherCategorySelected = false;
      }
    },

    handlePaymentMethodChange() {
      this.showCreditCardDetails = this.expense.paymentMethod === 'Tarjeta de Crédito';

      if (!this.showCreditCardDetails) {
        this.expense.creditCard = {
          type: '',
          installments: 1
        };
        this.installmentAmount = 0;
      }
    },

    calculateInstallments() {
      if (this.expense.amount && this.expense.creditCard.installments > 0) {
        this.installmentAmount = this.expense.amount / this.expense.creditCard.installments;
      } else {
        this.installmentAmount = 0;
      }
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
      }).format(value);
    },

    async updateBudgetAmount(budgetId, expenseAmount) {
      try {
        const db = getFirestore();
        const budgetRef = doc(db, "Presupuestos", budgetId);
        const budgetSnap = await getDoc(budgetRef);

        if (budgetSnap.exists()) {
          const budgetData = budgetSnap.data();
          const newRemainingAmount = budgetData.amount - expenseAmount;

          await updateDoc(budgetRef, {
            amount: newRemainingAmount
          });
        }
      } catch (error) {
        console.error("Error al actualizar presupuesto:", error);
        throw error;
      }
    },

    async handleSubmit() {
      // Limpiar errores
      this.errors = {
        name: '',
        amount: '',
        category: '',
        paymentMethod: '',
        creditCardType: '',
        budget: ''
      };

      let valid = true;

      if (!this.expense.name.trim()) {
        this.errors.name = 'El nombre del gasto es obligatorio.';
        valid = false;
      }

      if (!this.expense.amount || this.expense.amount <= 0) {
        this.errors.amount = 'El monto debe ser mayor a 0.';
        valid = false;
      }

      if (!this.expense.category && !this.customCategory) {
        this.errors.category = 'Seleccioná o escribí una categoría.';
        valid = false;
      }

      if (!this.expense.budget && this.expense.budget !== 'none') {
        this.errors.budget = 'Seleccioná un presupuesto o no asignes.';
        valid = false;
      }

      if (!this.expense.paymentMethod) {
        this.errors.paymentMethod = 'El método de pago es obligatorio.';
        valid = false;
      }

      if (
        this.expense.paymentMethod === 'Tarjeta de Crédito' &&
        !this.expense.creditCard.type
      ) {
        this.errors.creditCardType = 'Seleccioná el tipo de tarjeta.';
        valid = false;
      }

      if (!valid) {
        this.message = 'Por favor completá todos los campos obligatorios.';
        this.messageClass = 'bg-red-100 border border-red-400 text-red-600 font-semibold';
        this.clearErrorsAfterDelay();
        this.clearMessageAfterDelay();
        return;
      }

      this.loading = true;
      this.message = '';

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          this.message = 'Debes estar autenticado para registrar un gasto.';
          this.messageClass = 'bg-red-100 border border-red-400 text-red-600 font-semibold';
          this.loading = false;
          this.clearMessageAfterDelay();
          return;
        }

        const db = getFirestore();
        const categoryToSave = this.isOtherCategorySelected
          ? this.customCategory
          : this.expense.category;

        const isCreditCard = this.expense.paymentMethod === 'Tarjeta de Crédito';
        const shouldUpdateBudgetNow = !isCreditCard;

        if (
          shouldUpdateBudgetNow &&
          this.expense.budget !== 'none' &&
          this.expense.budget !== ''
        ) {
          const budget = this.budgets.find((b) => b.id === this.expense.budget);
          if (budget) {
            const newAmount = Number(this.expense.amount);
            if (newAmount > budget.amount) {
              this.messageClass =
                'bg-yellow-100 border border-yellow-400 text-yellow-800 font-semibold';
            }
            await this.updateBudgetAmount(this.expense.budget, newAmount);
          }
        }

        const expenseData = {
          uid: user.uid,
          name: this.expense.name,
          amount: Number(this.expense.amount),
          category: categoryToSave,
          date: this.expense.date,
          description: this.expense.description,
          budget: this.expense.budget,
          paymentMethod: this.expense.paymentMethod,
          createdAt: new Date(),
          budgetUpdated: shouldUpdateBudgetNow
        };

        if (isCreditCard) {
          const currentDate = new Date();
          const currentDay = currentDate.getDate();
          const installments = Number(this.expense.creditCard.installments);

          expenseData.creditCard = {
            type: this.expense.creditCard.type,
            installments: installments,
            installmentAmount: this.installmentAmount,
            firstPaymentDate: new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() + 1,
              currentDay
            ),
            installmentsPaid: 0,
            paymentDates: Array.from({ length: installments }, (_, i) => {
              const tentativeDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + i + 1,
                currentDay
              );
              const expectedMonth = (currentDate.getMonth() + i + 1) % 12;
              if (tentativeDate.getMonth() !== expectedMonth) {
                tentativeDate.setDate(0);
              }
              return tentativeDate.toISOString();
            })
          };
        }

        await addDoc(collection(db, 'gastos'), expenseData);

        this.message = 'Gasto registrado correctamente';
        this.messageClass =
          'bg-green-100 border border-green-400 text-green-600 font-semibold';
        this.clearMessageAfterDelay();

        setTimeout(() => {
          this.$router.push({ path: '/Monto-Total' });
        }, 1000);

        this.expense = {
          name: '',
          amount: '',
          category: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
          budget: '',
          paymentMethod: '',
          creditCard: {
            type: '',
            installments: 1
          }
        };
        this.isOtherCategorySelected = false;
        this.customCategory = '';
        this.showCreditCardDetails = false;
        this.installmentAmount = 0;

      } catch (error) {
        console.error('Error al guardar el gasto:', error);
        this.message =
          'Error al registrar el gasto. Intenta nuevamente.';
        this.messageClass =
          'bg-red-100 border border-red-400 text-red-600 font-semibold';
        this.clearMessageAfterDelay();
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

