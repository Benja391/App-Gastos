  <template>
    <section class="flex items-center justify-center min-h-screen bg-[#08a04b] text-white py-4">
      <div class="relative bg-gray-900 rounded-lg shadow-[0_15px_30px_rgba(0,0,0,0.6)] w-full max-w-2xl p-8 my-4">
        
       
        <div v-if="message" class="mb-4 p-4 rounded" :class="messageClass">
          {{ message }}
        </div>

        
        <div v-if="loading" class="flex justify-center items-center mb-4">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="mb-6">
            <label for="name" class="block text-lg font-medium text-gray-300 mb-2">Nombre del gasto</label>
            <BaseInputs 
              type="text"
              id="name"
              v-model="expense.name"
              placeholder="Ingrese el nombre del gasto"
              required
              class="w-full px-4 py-3 rounded-lg shadow-sm"
            />
          </div>

          <div class="mb-6">
            <label for="amount" class="block text-lg font-medium text-gray-300 mb-2">Monto del gasto</label>
            <BaseInputs 
              type="number"
              id="amount"
              v-model="expense.amount"
              step="0.01"
              placeholder="Ingrese monto del gasto"
              required
              min="0.01"
              class="w-full px-4 py-border-0 rounded-lg shadow-sm"
            />
          </div>

        
          <div class="mb-6">
            <label for="budget" class="block text-lg font-medium text-gray-300 mb-2">Presupuesto asignado</label>
            <select 
              v-model="expense.budget" 
              id="budget" 
              class="w-full p-3 ml-3 bg-gray-700 border rounded-lg"
            >
              <option value="" disabled>Seleccione un presupuesto</option>
              <option v-for="budget in budgets" :key="budget.id" :value="budget.id">
                {{ budget.name }} 
              </option>
              <option value="none">No asignar a presupuesto</option>
            </select>
          </div>
          
          
          <div class="mb-6">
            <label for="category" class="block text-lg font-medium text-gray-300 mb-2">Categoría</label>
              <div class="relative">
                <select 
                    v-if="!isOtherCategorySelected"
                    v-model="expense.category"
                    id="category"
                    required
                    class="w-full p-3 ml-3 bg-gray-700 border rounded-lg"
                    @change="handleCategoryChange"
                  >
                  <option value="" disabled>Seleccione una categoría</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                  <option value="Otra">Otra</option>
                </select>

                <div class="ml-3" v-if="isOtherCategorySelected">
                  <BaseInputs
                    type="text"
                    id="customCategory"
                    v-model="customCategory"
                    placeholder="Escribe tu categoría"
                    required
                  />
                </div>
              </div>
          </div>

          <div class="mb-6">
            <label for="description" class="block text-lg font-medium text-gray-300 mb-2">Descripción del gasto</label>
            <BaseInputs 
              type="text"
              id="description"
              v-model="expense.description"
              placeholder="Describe brevemente el gasto"
              class="w-full px-4 py-3 rounded-lg shadow-sm"
            />
          </div>

         
          <div class="mb-6">
            <label for="paymentMethod" class="block text-lg font-medium text-gray-300 mb-2">Método de pago</label>
            <select 
              v-model="expense.paymentMethod" 
              id="paymentMethod" 
              class="w-full p-3 ml-3 bg-gray-700 border rounded-lg"
              @change="handlePaymentMethodChange"
            >
              <option value="" disabled>Seleccione un método de pago</option>
              <option v-for="method in paymentMethods" :key="method" :value="method">
                {{ method }}
              </option>
            </select>
          </div>

         
          <CreditCardDetails 
            v-if="showCreditCardDetails" 
            v-model:cardType="expense.creditCard.type"
            v-model:installments="expense.creditCard.installments"
            @calculate-installments="calculateInstallments"
          />

         
          <div v-if="showInstallmentBreakdown" class="mb-6 p-4 bg-gray-800 rounded-lg">
            <h3 class="text-md font-medium text-gray-300 mb-2">Desglose de cuotas</h3>
            <div class="text-sm text-gray-400">
              <p>Monto total: {{ formatCurrency(expense.amount) }}</p>
              <p>Número de cuotas: {{ expense.creditCard.installments }}</p>
              <p>Monto por cuota: {{ formatCurrency(installmentAmount) }}</p>
            </div>
          </div>

          <button 
            type="submit"
            class="w-full py-3 mt-6 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {{ editing ? 'Actualizar Gasto' : 'Agregar gasto' }}
          </button>
        </form>
      </div>
    </section>
  </template>

  <script>
  import { getAuth } from "firebase/auth";
  import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";
  import BaseHeading from '../components/BaseHeading.vue';
  import BaseButton from '../components/BaseButton.vue';
  import BaseInputs from '../components/BaseInputs.vue';
  import CreditCardDetails from '../components/DetallesCredito.vue';

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
        loading: false,
        message: '',
        messageClass: 'bg-red-100 border border-red-400 text-red-600 font-semibold',
        editing: false,
        categories: ["Alimentos", "Transporte", "Hogar", "Entretenimiento", "Educación", "Salud"],
        isOtherCategorySelected: false,
        customCategory: '',
        budgets: [],
        paymentMethods: ["Efectivo", "Tarjeta de Débito", "Tarjeta de Crédito", "Transferencia Bancaria", "Billetera Virtual"],
        showCreditCardDetails: false,
        installmentAmount: 0,
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
    },

    methods: {
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
        if (!this.expense.name || !this.expense.amount || !this.expense.category || !this.expense.paymentMethod) {
          this.message = "Por favor, completa todos los campos obligatorios.";
          this.messageClass = "bg-red-100 border border-red-400 text-red-600 font-semibold";
          return;
        }

        if (this.expense.paymentMethod === 'Tarjeta de Crédito') {
          if (!this.expense.creditCard.type) {
            this.message = "Por favor, selecciona el tipo de tarjeta de crédito.";
            this.messageClass = "bg-red-100 border border-red-400 text-red-600 font-semibold";
            return;
          }
        }

        this.loading = true;
        this.message = "";

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
          const categoryToSave = this.isOtherCategorySelected ? this.customCategory : this.expense.category;
          
          const isCreditCard = this.expense.paymentMethod === 'Tarjeta de Crédito';
          const shouldUpdateBudgetNow = !isCreditCard;
          
          if (shouldUpdateBudgetNow && this.expense.budget !== 'none' && this.expense.budget !== '') {
            const budget = this.budgets.find(b => b.id === this.expense.budget);
            if (budget) {
              const newAmount = Number(this.expense.amount);
              if (newAmount > budget.amount) {
          
                this.messageClass = "bg-yellow-100 border border-yellow-400 text-yellow-800 font-semibold";
            
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
              firstPaymentDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDay),
              installmentsPaid: 0,
              paymentDates: Array.from({ length: installments }, (_, i) => {
                const tentativeDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i + 1, currentDay);
                const expectedMonth = (currentDate.getMonth() + i + 1) % 12;
                if (tentativeDate.getMonth() !== expectedMonth) {
                  tentativeDate.setDate(0);
                }
                return tentativeDate.toISOString();
              })
            };
          }

          await addDoc(collection(db, "gastos"), expenseData);

          this.message = "Gasto registrado correctamente";
          this.messageClass = "bg-green-100 border border-green-400 text-green-600 font-semibold";
          setTimeout(() => {
            this.message = '';
            this.$router.push({ path: '/Monto-Total' });
          }, 1500);

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
          console.error("Error al guardar el gasto:", error);
          this.message = "Error al registrar el gasto. Intenta nuevamente.";
          this.messageClass = "bg-red-100 border border-red-400 text-red-600 font-semibold";
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
