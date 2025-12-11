<template>
  <section class="flex items-center justify-center min-h-screen bg-[#08a04b] text-white px-4 py-10 mt-8">
    <div class="relative bg-white/95 backdrop-blur-sm text-gray-900 rounded-3xl  border border-white/20 w-full max-w-4xl p-10 grid gap-8 mt-1 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.35)]
         hover:shadow-[0_12px_45px_rgba(0,0,0,0.45)]
         transition-shadow duration-500">

      
      <div v-if="loading" class="flex justify-center items-center">
        <div class="relative">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-green-200"></div>
          <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-green-600 absolute top-0 left-0"></div>
        </div>
      </div>

      
      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div class="space-y-2">
          <label for="name" class="block text-sm font-semibold text-gray-700">Nombre del gasto</label>
          <BaseInputs
            type="text"
            id="name"
            v-model="expense.name"
            placeholder="Ingresá el nombre del gasto"
            required
            class="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
          />
        </div>

       
        <div class="space-y-2">
          <label for="amount" class="block text-sm font-semibold text-gray-700">Monto del gasto</label>
          <BaseInputs
            type="number"
            id="amount"
            v-model="expense.amount"
            step="0.01"
            placeholder="Ingresá el monto del gasto"
            required
            min="0.01"
            class="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
          />
        </div>

       
        <div class="space-y-2">
          <label for="budget" class="block text-sm font-semibold text-gray-700">Presupuesto asignado</label>
          <select
            v-model="expense.budget"
            id="budget"
            class="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
          >
            <option value="" disabled>Seleccioná un presupuesto</option>
            <option v-for="budget in budgets" :key="budget.id" :value="budget.id">
              {{ budget.name }}
            </option>
            <option value="none">No asignar a presupuesto</option>
          </select>
        </div>

  
        <div class="space-y-2">
          <label for="category" class="block text-sm font-semibold text-gray-700">Categoría</label>
          <div class="relative">
            <select
              v-if="!isOtherCategorySelected"
              v-model="expense.category"
              id="category"
              required
              @change="handleCategoryChange"
              class="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
            >
              <option value="" disabled>Seleccioná una categoría</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
              <option value="Otra">Otra</option>
            </select>

            <BaseInputs
              v-else
              type="text"
              id="customCategory"
              v-model="customCategory"
              placeholder="Escribí tu categoría"
              required
              class="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
            />
          </div>
        </div>

        
        <div class="lg:col-span-2 space-y-2">
          <label for="description" class="block text-sm font-semibold text-gray-700">Descripción del gasto</label>
          <BaseInputs
            type="text"
            id="description"
            v-model="expense.description"
            placeholder="Describí brevemente el gasto"
            class="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
          />
        </div>

      
        <div class="space-y-2">
          <label for="paymentMethod" class="block text-sm font-semibold text-gray-700">Método de pago</label>
          <select
            v-model="expense.paymentMethod"
            id="paymentMethod"
            @change="handlePaymentMethodChange"
            class="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
          >
            <option value="" disabled>Seleccioná un método de pago</option>
            <option v-for="method in paymentMethods" :key="method" :value="method">
              {{ method }}
            </option>
          </select>
        </div>

        
        <div class="lg:col-span-2">
          <CreditCardDetails
            v-if="showCreditCardDetails"
            v-model:cardType="expense.creditCard.type"
            v-model:installments="expense.creditCard.installments"
            @calculate-installments="calculateInstallments"
          />
        </div>

       
        <div v-if="showInstallmentBreakdown" class="lg:col-span-2 p-6 bg-gradient-to-r from-gray-50 to-green-50/30 rounded-2xl border border-green-100">
          <h3 class="text-lg font-bold text-green-800 mb-2">Desglose de cuotas</h3>
          <div class="text-sm text-gray-600 space-y-1">
            <p>Monto total: {{ formatCurrency(expense.amount) }}</p>
            <p>Número de cuotas: {{ expense.creditCard.installments }}</p>
            <p>Monto por cuota: {{ formatCurrency(installmentAmount) }}</p>
          </div>
        </div>

       
        <div v-if="message" class="lg:col-span-2 mt-4 p-4 rounded-2xl font-medium border-l-4 shadow-sm text-center" :class="messageClass">
          {{ message }}
        </div>

     
        <div class="lg:col-span-2 flex justify-center pt-6">
          <button
            type="submit"
            class="group relative px-8 py-4 bg-green-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-green-200"
          >
            <span class="relative z-10">{{ editing ? 'Actualizá gasto' : 'Agregá gasto' }}</span>
            <div class="absolute inset-0 bg-green-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, getDocs, query, where } from "firebase/firestore";
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
      tarjetasConfiguradas: [], 
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
    this.fetchTarjetas(); 
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


async fetchTarjetas() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const db = getFirestore();
    
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("DEBUG - No se encontró documento de usuario con uid:", user.uid);
      this.tarjetasConfiguradas = [];
      return;
    }

   
    const userDoc = querySnapshot.docs[0];
    console.log("DEBUG - Usuario encontrado con id:", userDoc.id);

    const cardsRef = collection(db, "users", userDoc.id, "cards");
    const cardsSnapshot = await getDocs(cardsRef);

    this.tarjetasConfiguradas = cardsSnapshot.docs.map(doc => doc.data());
    console.log("DEBUG - tarjetas configuradas final:", this.tarjetasConfiguradas);

  } catch (error) {
    console.error("Error al cargar tarjetas configuradas:", error);
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



    async handleSubmit() {
      if (!this.expense.name || !this.expense.amount || !this.expense.category || !this.expense.paymentMethod) {
        this.message = "Por favor, completa todos los campos obligatorios.";
        this.messageClass = "bg-red-100 border border-red-400 text-red-600 font-semibold";
        return;
      }

    // 🔹 Validar tarjeta configurada
if (this.expense.paymentMethod === "Tarjeta de Crédito") {
  if (this.tarjetasConfiguradas.length === 0) {
    console.log("DEBUG - tarjetas vacías, forzando fetchTarjetas...");
    await this.fetchTarjetas();
  }

  const tarjetaSeleccionada = this.expense.creditCard.type?.trim().toLowerCase();

  console.log("DEBUG - tarjeta seleccionada en form:", tarjetaSeleccionada);
  console.log("DEBUG - tarjetas configuradas Firestore:", this.tarjetasConfiguradas);

  const tarjetaExiste = this.tarjetasConfiguradas.some((t) => {
    console.log("Comparando con tarjeta Firestore:", t.cardType?.trim().toLowerCase());
    return t.cardType?.trim().toLowerCase() === tarjetaSeleccionada;
  });

  console.log("DEBUG - resultado tarjetaExiste:", tarjetaExiste);

  if (!tarjetaExiste) {
    this.message = `No tenés configurada ninguna tarjeta de tipo ${tarjetaSeleccionada}.`;
    this.messageClass = "bg-yellow-100 border border-yellow-400 text-yellow-800 font-semibold";
    this.loading = false;
    return;
  }
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
