<template>
  <div class="payment-calendar bg-gray-900 min-h-screen text-white p-4">

    <div
      v-if="showFloatingMessage"
      class="fixed top-5 right-5 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300"
    >
      {{ floatingMessage }}
    </div>

   
    <div
      v-if="pendingPayment"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 class="text-xl font-bold mb-4 text-gray-800">Confirmar pago</h3>
        <p class="mb-6 text-gray-600">
          ¿Estás seguro que querés completar la operación para la cuota
          {{ pendingPayment.installmentNumber }} de {{ pendingPayment.totalInstallments }} de "{{ pendingPayment.name }}"?
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="cancelTogglePayment"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            @click="confirmTogglePayment"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>

    
    <div
      v-if="expenseToDelete"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 class="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <span class="text-red-500 text-2xl mr-3"></span>
          Eliminar gasto completado
        </h3>
        <p class="mb-6 text-gray-600">
          ¿Estás seguro que querés eliminar permanentemente el gasto 
          "<strong>{{ expenseToDelete.name }}</strong>"?
          <br /><br />
          <span class="text-sm text-red-600">Esta acción no se puede deshacer.</span>
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="cancelDeleteExpense"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            @click="confirmDeleteExpense"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
             Eliminar
          </button>
        </div>
      </div>
    </div>

    
    <div
      v-if="expenseToArchive"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 class="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <span class="text-blue-500 text-2xl mr-3"></span>
          {{ expenseToArchive.archived ? 'Restaurar' : 'Archivar' }} gasto
        </h3>
        <p class="mb-6 text-gray-600">
          ¿Estás seguro que querés {{ expenseToArchive.archived ? 'restaurar' : 'archivar' }} el gasto 
          "<strong>{{ expenseToArchive.name }}</strong>"?
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="cancelArchiveExpense"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            @click="confirmArchiveExpense"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
             {{ expenseToArchive.archived ? 'Restaurar' : 'Archivar' }}
          </button>
        </div>
      </div>
    </div>

    <h2 class="text-2xl font-semibold mb-4 text-center">Calendario de pagos</h2>
    
    <div class="flex justify-between items-center mb-6">
      <button @click="previousMonth" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center">
        <span class="text-xl mr-1">&laquo;</span> Mes anterior
      </button>
      <h3 class="text-xl font-medium">{{ currentMonthName }} {{ currentYear }}</h3>
      <button @click="nextMonth" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center">
        Mes siguiente <span class="text-xl ml-1">&raquo;</span>
      </button>
    </div>

  
    <div class="flex justify-center mb-4">
      <button 
        @click="$router.push('/Configuracion-Tarjeta')" 
        class="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm flex items-center"
      >
        <span class="mr-1"></span> Configurar fechas de cierre
      </button>
    </div>
    
   
    <div class="grid grid-cols-7 gap-1 mb-4 text-center">
      <div v-for="day in weekDays" :key="day" class="font-medium py-2 bg-gray-800">
        {{ day }}
      </div>
    </div>
    
    <div class="grid grid-cols-7 gap-1">
     
      <div v-for="n in firstDayOfMonth" :key="`empty-${n}`" class="h-24 p-2 bg-gray-800 opacity-50"></div>
      
    
      <div 
        v-for="day in daysInMonth" 
        :key="day" 
        class="min-h-24 p-2 bg-gray-800 relative flex flex-col cursor-pointer"
        :class="{
          'border-2 border-green-500': isToday(day),
          'border-2 border-blue-500': isSelectedDay(day)
        }"
        @click="selectDay(day)"
      >
        <div class="flex justify-between items-start">
          <span class="font-medium">{{ day }}</span>
          <span v-if="hasPaymentsOnDay(day)" class="h-2 w-2 rounded-full bg-red-500"></span>
        </div>
        
        <div class="mt-1 flex-grow overflow-y-auto max-h-20">
          <div v-for="payment in getPaymentsForDay(day)" :key="payment.id"
              class="text-xs p-1 mb-1 rounded flex items-center"
              :class="payment.paid ? 'bg-green-900 line-through' : 'bg-red-900'">
            <input 
              type="checkbox" 
              :checked="payment.paid" 
              @change="(e) => togglePayment(e, payment)"
              class="mr-1 h-3 w-3"
              :disabled="payment.paid"
            />
            <div class="flex-grow">
              <div class="flex justify-between">
                <span class="truncate">{{ payment.name }}</span>
                <span>{{ formatCurrency(payment.amount) }}</span>
              </div>
              <div class="text-xxs text-gray-400">
                {{ payment.cardType }} - Cuota {{ payment.installmentNumber }}/{{ payment.totalInstallments }}
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="hasPaymentsOnDay(day) && !allPaidOnDay(day)" class="mt-auto pt-1">
          <button @click.stop="markDayAsPaid(day)" 
                  class="w-full text-xs px-1 py-0.5 bg-green-600 hover:bg-green-500 rounded">
            Pagar cuotas del día
          </button>
        </div>
      </div>
      
      
      <div v-for="n in (42 - daysInMonth - firstDayOfMonth) % 7" :key="`end-empty-${n}`" 
          class="h-24 p-2 bg-gray-800 opacity-50"></div>
    </div>
    
  
    <div class="mt-6 flex gap-6 text-sm justify-center">
      <div class="flex items-center">
        <div class="h-3 w-3 bg-red-900 rounded mr-1"></div>
        <span>Pago pendiente</span>
      </div>
      <div class="flex items-center">
        <div class="h-3 w-3 bg-green-900 rounded mr-1"></div>
        <span>Pago realizado</span>
      </div>
      <div class="flex items-center">
        <div class="h-3 w-3 border-2 border-green-500 rounded mr-1"></div>
        <span>Hoy</span>
      </div>
      <div class="flex items-center">
        <div class="h-3 w-3 border-2 border-blue-500 rounded mr-1"></div>
        <span>Día seleccionado</span>
      </div>
    </div>
    
   
    <div class="mt-8 bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto pr-2">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Próximos pagos</h3>
        
        
       
        <div class="flex gap-2">
          <button 
            @click="expenseFilter = 'active'"
            :class="expenseFilter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'"
            class="px-3 py-1 rounded text-sm hover:bg-blue-500"
          >
            Activos ({{ activeExpensesCount }})
          </button>
          <button 
            @click="expenseFilter = 'completed'"
            :class="expenseFilter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'"
            class="px-3 py-1 rounded text-sm hover:bg-green-500"
          >
            Completados ({{ completedExpensesCount }})
          </button>
          <button 
            @click="expenseFilter = 'all'"
            :class="expenseFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'"
            class="px-3 py-1 rounded text-sm hover:bg-purple-500"
          >
            Todos ({{ totalExpensesCount }})
          </button>
        </div>
      </div >
      
      
      <div v-if="getFilteredPayments().length === 0" class="text-center p-4 text-gray-400 ">
        No tienes {{ expenseFilter === 'active' ? 'pagos activos' : expenseFilter === 'completed' ? 'gastos completados' : 'gastos' }} próximamente.
      </div>
      
      <div v-else >
        <div v-for="payment in getFilteredPayments()" :key="payment.id + '-' + refreshKey" 
             class="mb-3 p-3 rounded-lg flex items-center justify-between"
             :class="getExpenseCompletionStatus(payment.expenseId) ? 'bg-gray-600 border-l-4 border-green-500' : 'bg-gray-700'">
        
          <div class="flex-grow">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center">
                  <span :class="getExpenseCompletionStatus(payment.expenseId) ? 'text-gray-300' : ''">
                    {{ payment.name }}
                  </span>
                  <span v-if="getExpenseCompletionStatus(payment.expenseId)" 
                        class="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full ">
                     Completado
                  </span>
                  <span v-if="getExpenseArchivedStatus(payment.expenseId)" 
                        class="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                     Archivado
                  </span>
                </div>
                <div class="text-sm text-gray-400">
                  {{ payment.cardType }} - Cuota {{ getCurrentInstallmentDisplay(payment.expenseId, payment.totalInstallments) }}
                </div>
                
             
<div v-if="getCardClosingInfo(payment.cardType)" class="text-xs text-gray-400 mt-1">
  {{ getCardClosingInfo(payment.cardType) }}
</div>

              
                <div v-if="getExpenseCompletionStatus(payment.expenseId) && getExpenseCompletionDate(payment.expenseId)" 
                     class="text-xs text-green-400 mt-1">
                   Completado: {{ formatDateForDisplay(getExpenseCompletionDate(payment.expenseId)) }}
                </div>
              </div>

           
              <div v-if="getExpenseCompletionStatus(payment.expenseId)" class="flex gap-2 ml-4">
                <button
                  @click="archiveExpense(payment.expenseId)"
                  class="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded flex items-center"
                  :title="getExpenseArchivedStatus(payment.expenseId) ? 'Restaurar' : 'Archivar'"
                >
                   {{ getExpenseArchivedStatus(payment.expenseId) ? 'Restaurar' : 'Archivar' }}
                </button>
                <button
                  @click="deleteExpense(payment.expenseId)"
                  class="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded flex items-center"
                  title="Eliminar permanentemente"
                >
                   Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

 
      <div v-if="showArchivedExpenses && archivedExpensesCount > 0" class="mt-6 border-t border-gray-600 pt-4">
        <div class="flex justify-between items-center mb-3">
          <h4 class="text-md font-medium text-gray-300"> Gastos archivados ({{ archivedExpensesCount }})</h4>
          <button
            @click="showArchivedExpenses = false"
            class="text-gray-400 hover:text-white text-sm"
          >
            Ocultar
          </button>
        </div>
        
        <div class="space-y-3">
          <div v-for="expenseId in getArchivedExpenseIds()" :key="'archived-' + expenseId"
               class="p-3 rounded-lg bg-gray-700 border-l-4 border-blue-500">
            <div class="flex justify-between items-start">
              <div>
                <div class="font-medium text-blue-400">{{ getExpenseName(expenseId) }}</div>
                <div class="text-sm text-gray-400">
                  {{ getExpenseCardType(expenseId) }} - Archivado el: {{ formatDateForDisplay(getExpenseArchivedDate(expenseId)) }}
                </div>
                <div class="text-xs text-gray-400 mt-1">
                  Total: {{ formatCurrency(getExpenseTotal(expenseId)) }} ({{ getExpenseTotalInstallments(expenseId) }} cuotas completadas)
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="archiveExpense(expenseId)"
                  class="px-2 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded"
                  title="Restaurar"
                >
                   Restaurar
                </button>
                <button
                  @click="deleteExpense(expenseId)"
                  class="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded"
                  title="Eliminar permanentemente"
                >
                   Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    
      <div v-if="archivedExpensesCount > 0" class="mt-4 text-center">
        <button
          @click="showArchivedExpenses = !showArchivedExpenses"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
        >
             {{ showArchivedExpenses ? 'Ocultar' : 'Ver' }} archivados ({{ archivedExpensesCount }})
        </button>
      </div>
    </div>

    
    <div class="mt-8 bg-gray-800 rounded-lg p-4">
      <h3 class="text-lg font-medium mb-4">Fechas de cierre y vencimiento</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(conf, type) in cardSettings"
          :key="type"
          class="bg-gray-700 p-4 rounded-lg flex flex-col"
        >
          <span class="font-semibold capitalize">{{ type }}</span>
          <span class="text-sm text-gray-300">
            Cierre: <strong>{{ conf.closingDay || '–' }}</strong>
          </span>
          <span class="text-sm text-gray-300">
            Vencimiento: <strong>{{ conf.daysUntilDue || '–' }} días</strong>
          </span>
        </div>
      </div>
    </div>
    
    <div class="bg-green-600 text-white py-2 text-center rounded-lg hover:bg-green-500 w-64 mx-auto flex justify-center items-center mt-4">
      <button @click="$router.push('/Monto-Total')">
        Volver a monto total
      </button>
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, getDoc, onSnapshot, deleteDoc, writeBatch } from "firebase/firestore";

export default {
  name: "PaymentCalendar",
 
  data() {
    return {
      loading: true,
      payments: [],
      currentDate: new Date(),
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      selectedDay: null,
      weekDays: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      paymentsByDate: {},
      expensesData: {},
      refreshKey: 0,
      
      cardSettings: { 
      visa: { closingDay: null, daysUntilDue: null, fechaCierre: "", fechaVencimiento: "" },
      mastercard: { closingDay: null, daysUntilDue: null, fechaCierre: "", fechaVencimiento: "" },
      amex: { closingDay: null, daysUntilDue: null, fechaCierre: "", fechaVencimiento: "" },
      otra: { closingDay: null, daysUntilDue: null, fechaCierre: "", fechaVencimiento: "" }
      },
      
      
      floatingMessage: "",
      showFloatingMessage: false,
      
      
      pendingPayment: null,
      
    
      expenseToDelete: null,
      
     
      expenseToArchive: null,
      
   
      expenseFilter: 'active', 
      showArchivedExpenses: false,
      
      
      completedExpenseIds: new Set(),
      archivedExpenseIds: new Set(),
    };
  },
  
  computed: {
    currentMonthName() {
      return this.months[this.currentMonth];
    },
    
    daysInMonth() {
      return new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    },
    
    firstDayOfMonth() {
      return new Date(this.currentYear, this.currentMonth, 1).getDay();
    },

    activeExpensesCount() {
      return Object.keys(this.expensesData).filter(expenseId => 
        !this.getExpenseCompletionStatus(expenseId) && !this.getExpenseArchivedStatus(expenseId)
      ).length;
    },

    completedExpensesCount() {
      return Object.keys(this.expensesData).filter(expenseId => 
        this.getExpenseCompletionStatus(expenseId) && !this.getExpenseArchivedStatus(expenseId)
      ).length;
    },

    totalExpensesCount() {
      return Object.keys(this.expensesData).filter(expenseId => 
        !this.getExpenseArchivedStatus(expenseId)
      ).length;
    },

    archivedExpensesCount() {
      return Object.keys(this.expensesData).filter(expenseId => 
        this.getExpenseArchivedStatus(expenseId)
      ).length;
    }
  },
  
  mounted() {
    this.loadCardSettings();
  },

  watch: {
   
    expensesData: {
      handler(newData) {
        this.detectCompletedExpenses();
      },
      deep: true
    }
  },
  
  methods: {
   
    showMessage(message) {
      this.floatingMessage = message;
      this.showFloatingMessage = true;
      setTimeout(() => {
        this.showFloatingMessage = false;
      }, 4000);
    },


    detectCompletedExpenses() {
      Object.keys(this.expensesData).forEach(expenseId => {
        const expense = this.expensesData[expenseId];
        if (expense.creditCard) {
          const installmentsPaid = expense.creditCard.installmentsPaid || 0;
          const totalInstallments = expense.creditCard.installments || 0;
          
          if (installmentsPaid >= totalInstallments && totalInstallments > 0) {
            if (!this.completedExpenseIds.has(expenseId)) {
              this.completedExpenseIds.add(expenseId);
              
              this.markExpenseAsCompleted(expenseId);
            }
          } else {
            this.completedExpenseIds.delete(expenseId);
          }
        }
      });
    },

   
    async markExpenseAsCompleted(expenseId) {
      try {
        const db = getFirestore();
        const expenseRef = doc(db, "gastos", expenseId);
        const expense = this.expensesData[expenseId];
        
        if (!expense.completedDate) {
          await updateDoc(expenseRef, {
            completedDate: new Date().toISOString(),
            isCompleted: true
          });
          
          this.showMessage(` Gasto "${expense.name}" completado automáticamente`);
        }
      } catch (error) {
        console.error("Error al marcar gasto como completado:", error);
      }
    },

    
    getExpenseCompletionStatus(expenseId) {
      const expense = this.expensesData[expenseId];
      if (!expense || !expense.creditCard) return false;
      
      const installmentsPaid = expense.creditCard.installmentsPaid || 0;
      const totalInstallments = expense.creditCard.installments || 0;
      
      return installmentsPaid >= totalInstallments && totalInstallments > 0;
    },

   
    getExpenseArchivedStatus(expenseId) {
      const expense = this.expensesData[expenseId];
      return expense && expense.archived === true;
    },

    
    getExpenseCompletionDate(expenseId) {
      const expense = this.expensesData[expenseId];
      return expense && expense.completedDate ? expense.completedDate : null;
    },

 
    getExpenseArchivedDate(expenseId) {
      const expense = this.expensesData[expenseId];
      return expense && expense.archivedDate ? expense.archivedDate : null;
    },

   
    getExpenseName(expenseId) {
      const expense = this.expensesData[expenseId];
      return expense ? expense.name : 'Gasto desconocido';
    },

   
    getExpenseCardType(expenseId) {
      const expense = this.expensesData[expenseId];
      return expense && expense.creditCard ? expense.creditCard.type : 'N/A';
    },

   
    getExpenseTotal(expenseId) {
      const expense = this.expensesData[expenseId];
      return expense ? expense.amount : 0;
    },

    
    getExpenseTotalInstallments(expenseId) {
      const expense = this.expensesData[expenseId];
      return expense && expense.creditCard ? expense.creditCard.installments : 0;
    },

   
    getArchivedExpenseIds() {
      return Object.keys(this.expensesData).filter(expenseId => 
        this.getExpenseArchivedStatus(expenseId)
      );
    },

  
getFilteredPayments() {
  console.log("=== INICIANDO getFilteredPayments SIN FILTRO DE FECHAS ===");
  console.log("expenseFilter actual:", this.expenseFilter);
  console.log("Total payments:", this.payments.length);
  
  const paymentsByExpense = {};
  let paymentsProcessed = 0;
  let paymentsAfterFilter = 0;
  
  this.payments.forEach(payment => {
    paymentsProcessed++;
    const expenseId = payment.expenseId;
    const isCompleted = this.getExpenseCompletionStatus(expenseId);
    const isArchived = this.getExpenseArchivedStatus(expenseId);
    
    console.log(`Payment ${paymentsProcessed}:`, {
      name: payment.name,
      date: new Date(payment.date),
      expenseId: expenseId,
      isCompleted: isCompleted,
      isArchived: isArchived
    });
    
    
    if (this.expenseFilter === 'active' && (isCompleted || isArchived)) {
      console.log(`✗ Filtrado (active): ${payment.name} - completed: ${isCompleted}, archived: ${isArchived}`);
      return;
    }
    if (this.expenseFilter === 'completed' && (!isCompleted || isArchived)) {
      console.log(`✗ Filtrado (completed): ${payment.name} - completed: ${isCompleted}, archived: ${isArchived}`);
      return;
    }
    if (isArchived && this.expenseFilter !== 'all') {
      console.log(`✗ Filtrado (archived): ${payment.name}`);
      return;
    }
    
    paymentsAfterFilter++;
    console.log(`✓ Payment pasó filtros: ${payment.name}`);
    
    if (!paymentsByExpense[expenseId]) {
      paymentsByExpense[expenseId] = payment;
      console.log(`✓ Agregado como primer payment del expense: ${payment.name}`);
    } 
    else if (!payment.paid && paymentsByExpense[expenseId].paid) {
      paymentsByExpense[expenseId] = payment;
      console.log(`✓ Reemplazado payment pagado por no pagado: ${payment.name}`);
    }
    else if (!payment.paid && !paymentsByExpense[expenseId].paid &&
            new Date(payment.date) < new Date(paymentsByExpense[expenseId].date)) {
      paymentsByExpense[expenseId] = payment;
      console.log(`✓ Reemplazado por payment más cercano: ${payment.name}`);
    }
  });
  
  const result = Object.values(paymentsByExpense);
  

  
  return result.sort((a, b) => {
    const aCompleted = this.getExpenseCompletionStatus(a.expenseId);
    const bCompleted = this.getExpenseCompletionStatus(b.expenseId);
    
    if (aCompleted !== bCompleted) {
      return aCompleted ? 1 : -1;
    }
    if (a.paid !== b.paid) {
      return a.paid ? 1 : -1;
    }
    return new Date(a.date) - new Date(b.date);
  });
},

  
    deleteExpense(expenseId) {
      const expense = this.expensesData[expenseId];
      if (expense) {
        this.expenseToDelete = { id: expenseId, name: expense.name };
      }
    },

    
    async confirmDeleteExpense() {
      if (!this.expenseToDelete) return;
      
      try {
        const db = getFirestore();
        const expenseRef = doc(db, "gastos", this.expenseToDelete.id);
        await deleteDoc(expenseRef);
        
        this.showMessage(` Gasto "${this.expenseToDelete.name}" eliminado permanentemente`);
        this.expenseToDelete = null;
        await this.fetchPayments();
      } catch (error) {
        console.error("Error al eliminar gasto:", error);
        this.showMessage("Error al eliminar el gasto. Intenta nuevamente.");
      }
    },

    
    cancelDeleteExpense() {
      this.expenseToDelete = null;
    },

    
    archiveExpense(expenseId) {
      const expense = this.expensesData[expenseId];
      if (expense) {
        this.expenseToArchive = { 
          id: expenseId, 
          name: expense.name,
          archived: expense.archived || false
        };
      }
    },

    
    async confirmArchiveExpense() {
      if (!this.expenseToArchive) return;
      
      try {
        const db = getFirestore();
        const expenseRef = doc(db, "gastos", this.expenseToArchive.id);
        const newArchivedStatus = !this.expenseToArchive.archived;
        
        const updateData = {
          archived: newArchivedStatus
        };
        
        if (newArchivedStatus) {
          updateData.archivedDate = new Date().toISOString();
        } else {
          updateData.archivedDate = null;
        }
        
        await updateDoc(expenseRef, updateData);
        
        this.showMessage(` Gasto "${this.expenseToArchive.name}" ${newArchivedStatus ? 'archivado' : 'restaurado'}`);
        this.expenseToArchive = null;
        await this.fetchPayments();
      } catch (error) {
        console.error("Error al archivar gasto:", error);
        this.showMessage("Error al archivar el gasto. Intenta nuevamente.");
      }
    },

   
    cancelArchiveExpense() {
      this.expenseToArchive = null;
    },

    
    formatDateForDisplay(dateString) {
      if (!dateString) return 'N/A';
      try {
        return new Date(dateString).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      } catch (error) {
        return 'Fecha inválida';
      }
    },

    
getCardClosingInfo(cardType) {
  if (!cardType) return null;
  
  
  let cardKey;
  const normalizedCardType = cardType.toLowerCase();
  
  if (normalizedCardType.includes('visa')) {
    cardKey = 'visa';
  } else if (normalizedCardType.includes('mastercard') || normalizedCardType.includes('master')) {
    cardKey = 'mastercard';
  } else if (normalizedCardType.includes('american') || normalizedCardType.includes('amex')) {
    cardKey = 'amex';
  } else {
    cardKey = 'otra';  
  }
  
  console.log(`Mapeando tarjeta: "${cardType}" -> configuración: "${cardKey}"`);
  
  const cardConfig = this.cardSettings[cardKey];
  
  if (!cardConfig) {
    console.log(`❌ No se encontró configuración para: ${cardKey}`);
    return null;
  }
  
  if (cardConfig.closingDay && cardConfig.daysUntilDue) {
    console.log(`✅ Configuración encontrada para ${cardKey}:`, cardConfig);
    return `Cierre: día ${cardConfig.closingDay} - Vence: ${cardConfig.daysUntilDue} días después`;
  }
  
  console.log(`❌ Configuración incompleta para ${cardKey}:`, cardConfig);
  return null;
},
    
    
    selectDay(day) {
      this.selectedDay = day;
    },
    
    isSelectedDay(day) {
      return this.selectedDay === day &&
             this.currentMonth === this.currentMonth &&
             this.currentYear === this.currentYear;
    },
    
async loadCardSettings() {
  console.log("=== INICIANDO loadCardSettings ===");
  
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.log("❌ No hay usuario logueado");
      this.fetchPayments();
      return;
    }
    
    
    const db = getFirestore();
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("❌ No se encontró documento del usuario");
      this.fetchPayments();
      return;
    }
    
    const userDocId = querySnapshot.docs[0].id;
    console.log("✅ Usuario encontrado, doc ID:", userDocId);
    
    const settingsRef = doc(db, "users", userDocId, "settings", "tarjetaConfig");
    const settingsSnap = await getDoc(settingsRef);
    
    console.log("Documento existe?", settingsSnap.exists());
    
    if (settingsSnap.exists()) {
      const data = settingsSnap.data();
      console.log("✅ Datos del documento:", data);
      
      if (data.cardTypes) {
        Object.keys(data.cardTypes).forEach(cardType => {
          if (this.cardSettings[cardType]) {
            const cardData = data.cardTypes[cardType];
            
            console.log(`✅ Configurando ${cardType}:`, cardData);
            
            this.cardSettings[cardType] = {
              closingDay: cardData.closingDay || null,
              daysUntilDue: cardData.daysUntilDue || null,
              
              fechaCierre: cardData.closingDay || "",
              fechaVencimiento: cardData.daysUntilDue || ""
            };
          }
        });
        
        console.log("✅ cardSettings después de cargar:", this.cardSettings);
      }
    
    }
    
    this.fetchPayments();
    
  } catch (error) {
    console.error("❌ Error al cargar configuración de tarjetas:", error);
    this.fetchPayments();
  }
},
    

calculateDueDate(purchaseDate, cardType) {
  let cardKey;
  const normalizedCardType = cardType.toLowerCase();
  
  if (normalizedCardType.includes('visa')) {
    cardKey = 'visa';
  } else if (normalizedCardType.includes('mastercard') || normalizedCardType.includes('master')) {
    cardKey = 'mastercard';
  } else if (normalizedCardType.includes('american') || normalizedCardType.includes('amex')) {
    cardKey = 'amex';
  } else {
    cardKey = 'otra';
  }
  
  console.log(`Calculando CIERRE para: "${cardType}" -> configuración: "${cardKey}"`);
  
  const cardConfig = this.cardSettings[cardKey];
  const closingDay = cardConfig?.closingDay;
  
  console.log(`Día de cierre configurado: ${closingDay}`);
  
  if (!closingDay) {
    const date = new Date(purchaseDate);
    date.setDate(date.getDate() + 30);
    console.log("Sin configuración, usando +30 días:", date);
    return date;
  }
  
  const purchaseDate_obj = new Date(purchaseDate);
  const purchaseDay = purchaseDate_obj.getDate();
  
  
  let closingDate = new Date(purchaseDate_obj);
  closingDate.setDate(closingDay);
  
  
  if (purchaseDay > closingDay) {
    closingDate.setMonth(closingDate.getMonth() + 1);
    const daysInMonth = new Date(closingDate.getFullYear(), closingDate.getMonth() + 1, 0).getDate();
    if (closingDay > daysInMonth) {
      closingDate.setDate(daysInMonth);
    }
  }
  
  console.log(`Resultado CIERRE:`, {
    compra: purchaseDate_obj,
    cierre: closingDate 
  });
  
  return closingDate;  
},
    
   
    getCurrentInstallmentDisplay(expenseId, totalInstallments) {
      if (this.expensesData[expenseId]) {
        const cuotasPagadas = this.expensesData[expenseId].creditCard.installmentsPaid || 0;
        
        if (cuotasPagadas >= totalInstallments) {
          return `${totalInstallments}/${totalInstallments}`;
        }
        return `${cuotasPagadas}/${totalInstallments}`;
      }
      return `0/${totalInstallments}`;
    },
    
    
    getPaymentsForDay(day) {
  const dateKey = this.formatDateKey(new Date(this.currentYear, this.currentMonth, day));
  const payments = this.paymentsByDate[dateKey] || [];
  
  
  return payments.filter(payment => {
    const isExpenseCompleted = this.getExpenseCompletionStatus(payment.expenseId);
    const isExpenseArchived = this.getExpenseArchivedStatus(payment.expenseId);
    
   
    if (isExpenseArchived) return false;
    
  
    if (isExpenseCompleted) return false;
    
    return true;
  });
},
    
  
    hasPaymentsOnDay(day) {
      return this.getPaymentsForDay(day).length > 0;
    },
    
   
    allPaidOnDay(day) {
      const payments = this.getPaymentsForDay(day);
      return payments.length > 0 && payments.every(p => p.paid);
    },
    
  
    isToday(day) {
      const today = new Date();
      return day === today.getDate() && 
             this.currentMonth === today.getMonth() && 
             this.currentYear === today.getFullYear();
    },
    
   
    async togglePayment(e, payment) {
      if (payment.paid) return;

      e.target.checked = false;
      this.pendingPayment = payment;
      
      try {
        const db = getFirestore();
        const expenseId = payment.expenseId;
        const expenseRef = doc(db, "gastos", expenseId);
        const expenseSnap = await getDoc(expenseRef);
        
        if (!expenseSnap.exists()) return;
        
        const expenseData = expenseSnap.data();
        
        if (payment.installmentNumber > expenseData.creditCard.installmentsPaid) {
          this.pendingPayment = payment;
          return;
        }
      } catch (error) {
        console.error("Error al iniciar confirmación de pago:", error);
        this.showMessage("Ocurrió un error. Por favor, intenta nuevamente.");
      }
    },
    
    
    async confirmTogglePayment() {
      try {
        const payment = this.pendingPayment;
        const db = getFirestore();
        const expenseRef = doc(db, "gastos", payment.expenseId);
        await updateDoc(expenseRef, {
          "creditCard.installmentsPaid": payment.installmentNumber
        });
        console.log(`Cuota ${payment.installmentNumber} de ${payment.totalInstallments} marcada como pagada`);
        this.pendingPayment = null;
        await this.fetchPayments();
        this.$forceUpdate();
      } catch (error) {
        console.error("Error al marcar pago como pagado:", error);
        this.showMessage("Ocurrió un error al marcar el pago. Por favor, intenta nuevamente.");
      }
    },
    
    
    async cancelTogglePayment() {
      this.pendingPayment = null;
      this.selectedDay = null;
      await this.fetchPayments();
    },
    
    
    async markDayAsPaid(day) {
      try {
        const payments = this.getPaymentsForDay(day);
        const unpaidPayments = payments.filter(p => !p.paid);
        
        if (unpaidPayments.length === 0) return;
        
        const expenseUpdates = {};
        unpaidPayments.forEach(payment => {
          const expenseId = payment.expenseId;
          if (!expenseUpdates[expenseId]) {
            expenseUpdates[expenseId] = {
              expenseId,
              installmentsPaid: payment.installmentNumber,
              payment: payment
            };
          } else if (payment.installmentNumber > expenseUpdates[expenseId].installmentsPaid) {
            expenseUpdates[expenseId].installmentsPaid = payment.installmentNumber;
            expenseUpdates[expenseId].payment = payment;
          }
        });
        
        const db = getFirestore();
        
        for (const expenseId in expenseUpdates) {
          const update = expenseUpdates[expenseId];
          const expenseRef = doc(db, "gastos", expenseId);
          const expenseSnap = await getDoc(expenseRef);
          
          if (expenseSnap.exists()) {
            const expenseData = expenseSnap.data();
            
            if (update.installmentsPaid > expenseData.creditCard.installmentsPaid) {
              console.log(`Actualizando gasto ${expenseData.name}: cuotas pagadas de ${expenseData.creditCard.installmentsPaid} a ${update.installmentsPaid}`);
              await updateDoc(expenseRef, {
                "creditCard.installmentsPaid": update.installmentsPaid
              });
            }
          }
        }
        
        await this.fetchPayments();
        this.$forceUpdate();
        
      } catch (error) {
        console.error("Error al marcar pagos del día:", error);
        this.showMessage("Ocurrió un error al marcar los pagos. Por favor, intenta nuevamente.");
      }
    },
    
    
    previousMonth() {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
      this.selectedDay = null;
    },
    
    nextMonth() {
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.selectedDay = null;
    },
    
    formatDate(date) {
      return new Intl.DateTimeFormat('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }).format(date);
    },
    
    formatCurrency(value) {
      const amount = parseFloat(value);

      if (isNaN(amount)) {
        return 'Monto inválido';
      }

      return new Intl.NumberFormat('es-AR', { 
        style: 'currency', 
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    },
    
   

async fetchPayments() {
  try {
    this.loading = true;
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      this.loading = false;
      return;
    }
    
    const db = getFirestore();
    const gastosRef = collection(db, "gastos");
    const q = query(
      gastosRef, 
      where("uid", "==", user.uid),
      where("paymentMethod", "==", "Tarjeta de Crédito")
    );
    
    const querySnapshot = await getDocs(q);
    this.payments = [];
    this.paymentsByDate = {};
    this.expensesData = {};
    
    const expensesToUpdate = []; 
    
    querySnapshot.forEach((docSnapshot) => {
      const expense = docSnapshot.data();
      this.expensesData[docSnapshot.id] = expense;
      
      if (expense.creditCard && expense.creditCard.installments > 0) {
        let needsDateUpdate = false;
        const correctDates = [];
        
        for (let i = 0; i < expense.creditCard.installments; i++) {
          const isPaid = i < (expense.creditCard.installmentsPaid || 0);
          
      
          const baseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
          const cardType = expense.creditCard.type.toLowerCase();
          const purchaseDateForInstallment = new Date(baseDate);
          purchaseDateForInstallment.setMonth(baseDate.getMonth() + i);
          
          const correctDate = this.calculateDueDate(purchaseDateForInstallment, cardType);
          correctDates.push(correctDate.toISOString());
          
        
          let paymentDate;
          if (expense.creditCard.paymentDates && expense.creditCard.paymentDates[i]) {
            const savedDate = new Date(expense.creditCard.paymentDates[i]);
            const savedDay = savedDate.getDate();
            const correctDay = correctDate.getDate();
            
            if (savedDay !== correctDay) {
              console.log(`❌ Fecha incorrecta para ${expense.name} cuota ${i + 1}: día ${savedDay} debería ser día ${correctDay}`);
              needsDateUpdate = true;
              paymentDate = correctDate; 
            } else {
              paymentDate = savedDate; 
            }
          } else {
            paymentDate = correctDate;
            needsDateUpdate = true;
          }
          
          const payment = {
            id: `${docSnapshot.id}-${i}`,
            expenseId: docSnapshot.id,
            name: expense.name,
            amount: expense.creditCard.installmentAmount,
            cardType: expense.creditCard.type,
            installmentNumber: i + 1,
            totalInstallments: expense.creditCard.installments,
            date: paymentDate,
            paid: isPaid,
            budget: expense.budget,
            uid: expense.uid
          };
          
          this.payments.push(payment);
          
          const dateKey = this.formatDateKey(paymentDate);
          if (!this.paymentsByDate[dateKey]) {
            this.paymentsByDate[dateKey] = [];
          }
          this.paymentsByDate[dateKey].push(payment);
        }
        
       
        if (needsDateUpdate) {
          expensesToUpdate.push({
            id: docSnapshot.id,
            dates: correctDates
          });
        }
      }
    });
    
   
    if (expensesToUpdate.length > 0) {
      console.log(`🔧 Corrigiendo fechas para ${expensesToUpdate.length} gastos...`);
      await this.updatePaymentDatesInFirebase(expensesToUpdate);
    }
    
    this.refreshKey++;
    console.log("Pagos cargados:", this.payments.length);
    
  } catch (error) {
    console.error("Error al cargar pagos:", error);
  } finally {
    this.loading = false;
  }
},


async updatePaymentDatesInFirebase(expensesToUpdate) {
  try {
    const db = getFirestore();
    const batch = writeBatch(db);
    
    expensesToUpdate.forEach(expense => {
      const docRef = doc(db, "gastos", expense.id);
      batch.update(docRef, {
        "creditCard.paymentDates": expense.dates
      });
    });
    
    await batch.commit();
    console.log("✅ Fechas corregidas automáticamente en Firebase");
    
  } catch (error) {
    console.error("❌ Error al actualizar fechas:", error);
  }
},
    
    formatDateKey(date) {
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  console.log(`🔑 formatDateKey: ${date} -> "${key}"`);
  return key;
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


.text-xxs {
  font-size: 0.625rem;
}

.completed-expense {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.completed-expense:hover {
  opacity: 1;
}


.action-button {
  transition: all 0.2s ease;
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>