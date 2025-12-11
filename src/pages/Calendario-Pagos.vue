<template>
  <div class="payment-calendar min-h-screen bg-[#08a04b] text-gray-900 p-6 md:p-10 mt-8">
   
    <div
      v-if="showFloatingMessage"
      class="fixed top-5 right-5 bg-blue-600/90 backdrop-blur px-6 py-3 rounded-2xl shadow-xl z-50 border border-white/20 text-white font-medium"
    >
      {{ floatingMessage }}
    </div>

   
    <div
      v-if="pendingPayment || expenseToDelete || expenseToArchive"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-gray-200">
        <h3 class="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <span
            v-if="expenseToDelete"
            class="inline-block h-3 w-3 rounded-full bg-red-500"
          ></span>
          <span
            v-if="expenseToArchive"
            class="inline-block h-3 w-3 rounded-full bg-blue-500"
          ></span>
          <span v-if="pendingPayment">Confirmar pago</span>
          <span v-if="expenseToDelete">Eliminar gasto completado</span>
          <span v-if="expenseToArchive">{{ expenseToArchive.archived ? 'Restaurar' : 'Archivar' }} gasto</span>
        </h3>

        <p class="mb-6 text-gray-600 leading-relaxed">
          <span v-if="pendingPayment">
            ¿Estás seguro que querés completar la operación para la cuota
            {{ pendingPayment.installmentNumber }} de {{ pendingPayment.totalInstallments }}
            de "<strong>{{ pendingPayment.name }}</strong>"?
          </span>
          <span v-if="expenseToDelete">
            ¿Estás seguro que querés eliminar permanentemente el gasto
            "<strong>{{ expenseToDelete.name }}</strong>"?
            <br /><br />
            <span class="text-sm text-red-500">Esta acción no se puede deshacer.</span>
          </span>
          <span v-if="expenseToArchive">
            ¿Estás seguro que querés
            {{ expenseToArchive.archived ? 'restaurar' : 'archivar' }}
            el gasto "<strong>{{ expenseToArchive.name }}</strong>"?
          </span>
        </p>

        <div class="flex justify-end gap-3">
          <button
            v-if="pendingPayment"
            @click="cancelTogglePayment"
            class="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
          >
            Cancelar
          </button>
          <button
            v-if="pendingPayment"
            @click="confirmTogglePayment"
            class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow"
          >
            Confirmar
          </button>

          <button
            v-if="expenseToDelete"
            @click="cancelDeleteExpense"
            class="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
          >
            Cancelar
          </button>
          <button
            v-if="expenseToDelete"
            @click="confirmDeleteExpense"
            class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow"
          >
            Eliminar
          </button>

          <button
            v-if="expenseToArchive"
            @click="cancelArchiveExpense"
            class="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
          >
            Cancelar
          </button>
          <button
            v-if="expenseToArchive"
            @click="confirmArchiveExpense"
            class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow"
          >
            {{ expenseToArchive.archived ? 'Restaurar' : 'Archivar' }}
          </button>
        </div>
      </div>
    </div>

   
    <BaseHeading>Calendario de pagos</BaseHeading>

    
    <div class="flex justify-between items-center mb-8">
      <button
        @click="previousMonth"
        class="px-4 py-2 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow flex items-center gap-2 transition"
      >
        <span class="text-xl">&laquo;</span>
        <span class="hidden sm:inline">Mes anterior</span>
      </button>

      <h3 class="text-xl md:text-2xl font-bold text-gray-800">
        <span class="px-4 py-2 rounded-xl bg-white shadow border border-gray-200">
          {{ currentMonthName }} {{ currentYear }}
        </span>
      </h3>

      <button
        @click="nextMonth"
        class="px-4 py-2 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow flex items-center gap-2 transition"
      >
        <span class="hidden sm:inline">Mes siguiente</span>
        <span class="text-xl">&raquo;</span>
      </button>
    </div>

    <div class="flex justify-center mb-6">
      <button
        @click="$router.push('/Configuracion-Tarjeta')"
        class="px-4 py-2 rounded-xl text-sm bg-blue-600 hover:bg-blue-500 text-white shadow font-medium"
      >
        Configurá fechas de cierre
      </button>
    </div>

   
    <div class="grid grid-cols-7 gap-2 mb-4 text-center">
      <div
        v-for="day in weekDays"
        :key="day"
        class="font-semibold py-2 bg-green-100 text-green-800 uppercase tracking-wide text-xs rounded-lg"
      >
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-2">
     
      <div
        v-for="n in firstDayOfMonth"
        :key="`empty-${n}`"
        class="h-24 p-2 bg-gray-100 rounded-lg"
      ></div>

   
      <div
        v-for="day in daysInMonth"
        :key="day"
        class="min-h-24 p-3 rounded-xl border bg-white hover:shadow-md transition cursor-pointer"
        :class="{
          'ring-2 ring-emerald-500': isToday(day),
          'ring-2 ring-blue-500': isSelectedDay(day)
        }"
        @click="selectDay(day)"
      >
        <div class="flex justify-between items-start">
          <span class="font-bold text-gray-800">{{ day }}</span>
          <span
            v-if="hasPaymentsOnDay(day)"
            class="h-2.5 w-2.5 rounded-full bg-rose-500 shadow"
          ></span>
        </div>

        <div class="mt-2 space-y-1 max-h-20 overflow-y-auto">
          <div
            v-for="payment in getPaymentsForDay(day)"
            :key="payment.id"
            class="text-xs px-2 py-1 rounded-lg border flex items-center gap-2"
            :class="payment.paid 
              ? 'bg-green-100 text-green-700 line-through border-green-200' 
              : 'bg-rose-100 text-rose-700 border-rose-200'"
          >
            <input
              type="checkbox"
              :checked="payment.paid"
              @change="(e) => togglePayment(e, payment)"
              class="h-3.5 w-3.5 accent-green-600"
              :disabled="payment.paid"
            />
            <div class="flex-grow flex justify-between gap-2">
              <span class="truncate">{{ payment.name }}</span>
              <span class="font-semibold">{{ formatCurrency(payment.amount) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

<div class="mt-10 rounded-2xl p-6 bg-white border border-gray-200 shadow-md">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
    <h3 class="text-xl font-bold text-gray-800">Próximos pagos</h3>
    <div class="flex gap-2">
      <button
        @click="expenseFilter = 'active'"
        :class="expenseFilter === 'active'
          ? 'bg-green-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-green-50'"
        class="px-3 py-1.5 rounded-xl text-sm border font-medium transition"
      >
        Activos ({{ activeExpensesCount }})
      </button>
      <button
        @click="expenseFilter = 'completed'"
        :class="expenseFilter === 'completed'
          ? 'bg-green-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-green-50'"
        class="px-3 py-1.5 rounded-xl text-sm border font-medium transition"
      >
        Completados ({{ completedExpensesCount }})
      </button>
      <button
        @click="expenseFilter = 'all'"
        :class="expenseFilter === 'all'
          ? 'bg-green-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-green-50'"
        class="px-3 py-1.5 rounded-xl text-sm border font-medium transition"
      >
        Todos ({{ totalExpensesCount }})
      </button>
    </div>
  </div>

  <div v-if="getFilteredPayments().length === 0" class="text-center p-6 text-gray-500 italic">
    No tenés
    {{ expenseFilter === 'active'
      ? 'pagos activos'
      : expenseFilter === 'completed'
      ? 'gastos completados'
      : 'gastos' }} próximamente.
  </div>

  <div v-else class="space-y-3">
    <div
      v-for="payment in getFilteredPayments()"
      :key="payment.id + '-' + refreshKey"
      class="p-4 rounded-xl flex items-center justify-between border shadow-sm bg-gray-50 hover:shadow-md transition"
      :class="getExpenseCompletionStatus(payment.expenseId) ? 'border-l-4 border-emerald-500' : ''"
    >
      <div class="flex-grow">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span :class="getExpenseCompletionStatus(payment.expenseId) ? 'text-gray-500 line-through' : 'text-gray-800 font-medium'">
                {{ payment.name }}
              </span>
              <span v-if="getExpenseCompletionStatus(payment.expenseId)" class="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">Completado</span>
              <span v-if="getExpenseArchivedStatus(payment.expenseId)" class="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">Archivado</span>
            </div>
            <div class="text-sm text-gray-500">
              {{ payment.cardType }} - Cuota {{ getCurrentInstallmentDisplay(payment.expenseId, payment.totalInstallments) }}
            </div>
          </div>

          <div v-if="getExpenseCompletionStatus(payment.expenseId)" class="flex gap-2 shrink-0">
            <button
              @click="archiveExpense(payment.expenseId)"
              class="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg"
            >
              {{ getExpenseArchivedStatus(payment.expenseId) ? 'Restaurar' : 'Archivar' }}
            </button>
            <button
              @click="deleteExpense(payment.expenseId)"
              class="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs rounded-lg"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="archivedExpensesCount > 0" class="mt-6 border-t border-gray-200 pt-4">
    <div class="flex justify-between items-center mb-3">
      <h4 class="text-md font-bold text-gray-800">Gastos archivados ({{ archivedExpensesCount }})</h4>
      <button @click="showArchivedExpenses = !showArchivedExpenses" class="text-sm text-green-700 hover:underline">
        {{ showArchivedExpenses ? 'Ocultá archivados' : 'Mirá archivados' }}
      </button>
    </div>

    <div v-if="showArchivedExpenses" class="space-y-3">
      <div
        v-for="expenseId in getArchivedExpenseIds()"
        :key="'archived-' + expenseId"
        class="p-4 rounded-xl bg-gray-50 border shadow-sm"
      >
        <div class="flex justify-between items-start gap-3">
          <div>
            <div class="font-medium text-blue-600">{{ getExpenseName(expenseId) }}</div>
            <div class="text-sm text-gray-500">
              {{ getExpenseCardType(expenseId) }} - Archivado el: {{ formatDateForDisplay(getExpenseArchivedDate(expenseId)) }}
            </div>
            <div class="text-xs text-gray-400 mt-1">
              Total: {{ formatCurrency(getExpenseTotal(expenseId)) }} ({{ getExpenseTotalInstallments(expenseId) }} cuotas completadas)
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="archiveExpense(expenseId)"
              class="px-2.5 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded-lg"
            >
              Restaurar
            </button>
            <button
              @click="deleteExpense(expenseId)"
              class="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs rounded-lg"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    
    <div class="mt-10 rounded-2xl p-6 bg-white border border-gray-200 shadow-md">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Mis tarjetas</h3>
      <div v-if="cards.length === 0" class="text-center text-gray-500 italic">
        No tenés tarjetas guardadas.
      </div>
      <ul v-else class="space-y-3">
        <li
          v-for="card in cards"
          :key="card.id"
          class="p-4 bg-gray-50 rounded-xl flex justify-between items-center border shadow-sm hover:shadow-md transition"
        >
          <div>
            <div class="font-bold text-gray-800">{{ card.cardholder }}</div>
            <div class="text-sm text-gray-500">**** **** **** {{ card.number.slice(-4) }}</div>
          </div>
          <div class="text-xs text-right text-gray-500">
            <div>Cierre: <span class="font-medium text-gray-800">{{ card.closingDate || '—' }}</span></div>
            <div>Vence: <span class="font-medium text-gray-800">{{ card.dueDate || '—' }}</span></div>
          </div>
        </li>
      </ul>
    </div>

   
    <div class="mt-8 flex justify-center">
      <button
        @click="$router.push('/Monto-Total')"
        class="px-8 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-md transition"
      >
        Volvé a monto total
      </button>
    </div>
  </div>
</template>



<script>
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import BaseHeading from "../components/BaseHeading.vue";

export default {
  name: "PaymentCalendar",
  components: { BaseHeading },

  data() {
    return {
      loading: true,
      payments: [],
      currentDate: new Date(),
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      selectedDay: null,
      weekDays: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
      months: [
        "Enero","Febrero","Marzo","Abril","Mayo","Junio",
        "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
      ],
      paymentsByDate: {},
      expensesData: {},
      refreshKey: 0,

      
      cardSettings: {
        visa: { closingDay: null, daysUntilDue: null, fechaCierre: "", fechaVencimiento: "" },
        mastercard: { closingDay: null, daysUntilDue: null, fechaCierre: "", fechaVencimiento: "" },
        amex: { closingDay: null, daysUntilDue: null, fechaCierre: "", fechaVencimiento: "" },
        otra: { closingDay: null, daysUntilDue: null, fechaCierre: "", fechaVencimiento: "" }
      },

      cards: [],
      floatingMessage: "",
      showFloatingMessage: false,
      pendingPayment: null,
      expenseToDelete: null,
      expenseToArchive: null,
      expenseFilter: "active",
      showArchivedExpenses: false,
      completedExpenseIds: new Set(),
      archivedExpenseIds: new Set()
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
      return Object.keys(this.expensesData).filter(
        id => !this.getExpenseCompletionStatus(id) && !this.getExpenseArchivedStatus(id)
      ).length;
    },
    completedExpensesCount() {
      return Object.keys(this.expensesData).filter(
        id => this.getExpenseCompletionStatus(id) && !this.getExpenseArchivedStatus(id)
      ).length;
    },
    totalExpensesCount() {
      return Object.keys(this.expensesData).filter(
        id => !this.getExpenseArchivedStatus(id)
      ).length;
    },
    archivedExpensesCount() {
      return Object.keys(this.expensesData).filter(
        id => this.getExpenseArchivedStatus(id)
      ).length;
    }
  },

  
  async mounted() {
    await this.loadCards();        
    await this.loadCardSettings(); 
    await this.fetchPayments();    
  },

  watch: {
    expensesData: {
      handler() { this.detectCompletedExpenses(); },
      deep: true
    }
  },

  methods: {
    fromYMD(ymd) { 
      const [y, m, d] = ymd.split("-").map(Number);
      return new Date(y, m - 1, d, 12, 0, 0, 0);
    },
    toYMD(date) {  
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    },
    atNoon(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
    },

    showMessage(message) {
      this.floatingMessage = message;
      this.showFloatingMessage = true;
      setTimeout(() => { this.showFloatingMessage = false; }, 4000);
    },

    detectCompletedExpenses() {
      Object.keys(this.expensesData).forEach(expenseId => {
        const exp = this.expensesData[expenseId];
        if (!exp?.creditCard) return;
        const paid = exp.creditCard.installmentsPaid || 0;
        const total = exp.creditCard.installments || 0;
        if (total > 0 && paid >= total) {
          if (!this.completedExpenseIds.has(expenseId)) {
            this.completedExpenseIds.add(expenseId);
            this.markExpenseAsCompleted(expenseId);
          }
        } else {
          this.completedExpenseIds.delete(expenseId);
        }
      });
    },

    async markExpenseAsCompleted(expenseId) {
      try {
        const db = getFirestore();
        const ref = doc(db, "gastos", expenseId);
        const exp = this.expensesData[expenseId];
        if (!exp.completedDate) {
          await updateDoc(ref, { completedDate: new Date().toISOString(), isCompleted: true });
          this.showMessage(` Gasto "${exp.name}" completado automáticamente`);
        }
      } catch (e) {
        console.error("Error al marcar gasto como completado:", e);
      }
    },

    getExpenseCompletionStatus(id) {
      const exp = this.expensesData[id];
      if (!exp?.creditCard) return false;
      const paid = exp.creditCard.installmentsPaid || 0;
      const total = exp.creditCard.installments || 0;
      return total > 0 && paid >= total;
    },
    getExpenseArchivedStatus(id) {
      const exp = this.expensesData[id];
      return !!exp?.archived;
    },
    getExpenseCompletionDate(id) {
      const exp = this.expensesData[id];
      return exp?.completedDate || null;
    },
    getExpenseArchivedDate(id) {
      const exp = this.expensesData[id];
      return exp?.archivedDate || null;
    },
    getExpenseName(id) {
      return this.expensesData[id]?.name || "Gasto desconocido";
    },
    getExpenseCardType(id) {
      return this.expensesData[id]?.creditCard?.type || "N/A";
    },
    getExpenseTotal(id) {
      return this.expensesData[id]?.amount || 0;
    },
    getExpenseTotalInstallments(id) {
      return this.expensesData[id]?.creditCard?.installments || 0;
    },
    getArchivedExpenseIds() {
      return Object.keys(this.expensesData).filter(id => this.getExpenseArchivedStatus(id));
    },

    getFilteredPayments() {
      const byExpense = {};
      this.payments.forEach(p => {
        const done = this.getExpenseCompletionStatus(p.expenseId);
        const arch = this.getExpenseArchivedStatus(p.expenseId);
        if (this.expenseFilter === "active" && (done || arch)) return;
        if (this.expenseFilter === "completed" && (!done || arch)) return;
        if (arch && this.expenseFilter !== "all") return;

        if (!byExpense[p.expenseId]) byExpense[p.expenseId] = p;
        else if (!p.paid && byExpense[p.expenseId].paid) byExpense[p.expenseId] = p;
        else if (!p.paid && !byExpense[p.expenseId].paid &&
                 new Date(p.date) < new Date(byExpense[p.expenseId].date)) {
          byExpense[p.expenseId] = p;
        }
      });

      const arr = Object.values(byExpense);
      return arr.sort((a, b) => {
        const ad = this.getExpenseCompletionStatus(a.expenseId);
        const bd = this.getExpenseCompletionStatus(b.expenseId);
        if (ad !== bd) return ad ? 1 : -1;
        if (a.paid !== b.paid) return a.paid ? 1 : -1;
        return new Date(a.date) - new Date(b.date);
      });
    },

    deleteExpense(id) {
      const exp = this.expensesData[id];
      if (exp) this.expenseToDelete = { id, name: exp.name };
    },
    async confirmDeleteExpense() {
      if (!this.expenseToDelete) return;
      try {
        const db = getFirestore();
        await deleteDoc(doc(db, "gastos", this.expenseToDelete.id));
        this.showMessage(` Gasto "${this.expenseToDelete.name}" eliminado permanentemente`);
        this.expenseToDelete = null;
        await this.fetchPayments();
      } catch (e) {
        console.error("Error al eliminar gasto:", e);
        this.showMessage("Error al eliminar el gasto. Intentá nuevamente.");
      }
    },
    cancelDeleteExpense() { this.expenseToDelete = null; },

    archiveExpense(id) {
      const exp = this.expensesData[id];
      if (exp) this.expenseToArchive = { id, name: exp.name, archived: !!exp.archived };
    },
    async confirmArchiveExpense() {
      if (!this.expenseToArchive) return;
      try {
        const db = getFirestore();
        const ref = doc(db, "gastos", this.expenseToArchive.id);
        const newArchived = !this.expenseToArchive.archived;
        const payload = { archived: newArchived, archivedDate: newArchived ? new Date().toISOString() : null };
        await updateDoc(ref, payload);
        this.showMessage(` Gasto "${this.expenseToArchive.name}" ${newArchived ? "archivado" : "restaurado"}`);
        this.expenseToArchive = null;
        await this.fetchPayments();
      } catch (e) {
        console.error("Error al archivar gasto:", e);
        this.showMessage("Error al archivar el gasto. Intentá nuevamente.");
      }
    },
    cancelArchiveExpense() { this.expenseToArchive = null; },

    formatDateForDisplay(s) {
      if (!s) return "N/A";
      try {
        return new Date(s).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
      } catch { return "Fecha inválida"; }
    },

   
    getCardClosingInfo(cardType) {
      if (!cardType) return null;
      const t = (cardType || "").toLowerCase();

      const match = this.cards.find(c => {
        const ct = (c.cardType || "").toLowerCase();
        return (t.includes("visa") && ct === "visa")
          || (t.includes("master") && ct === "mastercard")
          || ((t.includes("amex") || t.includes("american")) && ct === "amex")
          || (!t.includes("visa") && !t.includes("master") && !t.includes("amex") && ct === "otra");
      });
      if (!match) return null;

      const closingDay = match.closingDate ? Number(match.closingDate.slice(8, 10)) : null;
      const daysUntilDue = match.daysUntilDue != null ? Number(match.daysUntilDue) : null;
      if (!closingDay || !daysUntilDue && daysUntilDue !== 0) return null;

      return `Cierre: día ${closingDay} - Vence: ${daysUntilDue} días después`;
    },

    selectDay(day) { this.selectedDay = day; },
    isSelectedDay(day) {
      return this.selectedDay === day &&
             this.currentMonth === this.currentMonth &&
             this.currentYear === this.currentYear;
    },

   
    async loadCardSettings() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const db = getFirestore();
        const qUser = query(collection(db, "users"), where("uid", "==", user.uid));
        const snap = await getDocs(qUser);
        if (snap.empty) return;

        const userDocId = snap.docs[0].id;
        const settingsRef = doc(db, "users", userDocId, "settings", "tarjetaConfig");
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
          const data = settingsSnap.data();
          if (data.cardTypes) {
            Object.keys(data.cardTypes).forEach(k => {
              if (!this.cardSettings[k]) return;
              const cd = data.cardTypes[k];
              this.cardSettings[k] = {
                closingDay: cd.closingDay || null,
                daysUntilDue: cd.daysUntilDue || null,
                fechaCierre: cd.closingDay || "",
                fechaVencimiento: cd.daysUntilDue || ""
              };
            });
          }
        }
      } catch (e) {
        console.error("Error al cargar configuración de tarjetas:", e);
      }
    },

  
    async loadCards() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const db = getFirestore();
        const qUser = query(collection(db, "users"), where("uid", "==", user.uid));
        const userSnap = await getDocs(qUser);
        if (userSnap.empty) return;

        const userDocId = userSnap.docs[0].id;
        const cardsSnap = await getDocs(collection(db, "users", userDocId, "cards"));
        this.cards = cardsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) {
        console.error("Error al cargar tarjetas:", e);
      }
    },

    
    calcDueFromCards(purchaseDate, cardType) {
      if (!cardType || !this.cards?.length) return new Date(purchaseDate);

      const t = String(cardType).toLowerCase();
      const card = this.cards.find(c => {
        const ct = String(c.cardType || "").toLowerCase();
        return (t.includes("visa") && ct === "visa")
          || (t.includes("master") && ct === "mastercard")
          || ((t.includes("amex") || t.includes("american")) && ct === "amex")
          || (!t.includes("visa") && !t.includes("master") && !t.includes("amex") && ct === "otra");
      });
      if (!card) return new Date(purchaseDate);

    
      const closingDOM = card.closingDate ? Number(card.closingDate.slice(8, 10)) : null;
      const daysUntilDue = card.daysUntilDue != null ? Number(card.daysUntilDue) : null;
      if (!closingDOM || (daysUntilDue == null)) return new Date(purchaseDate);

      const p = this.atNoon(new Date(purchaseDate)); 

      const daysIn = (y, m) => new Date(y, m + 1, 0).getDate();

    
      let close = new Date(p.getFullYear(), p.getMonth(), 12);
      close.setDate(Math.min(closingDOM, daysIn(close.getFullYear(), close.getMonth())));
      if (p.getDate() > closingDOM) {
        close = new Date(p.getFullYear(), p.getMonth() + 1, 12);
        close.setDate(Math.min(closingDOM, daysIn(close.getFullYear(), close.getMonth())));
      }

      const due = new Date(close);
      due.setDate(due.getDate() + daysUntilDue);
      return due;
    },

    getCurrentInstallmentDisplay(expenseId, totalInstallments) {
      const exp = this.expensesData[expenseId];
      const paid = exp?.creditCard?.installmentsPaid || 0;
      if (paid >= totalInstallments) return `${totalInstallments}/${totalInstallments}`;
      return `${paid}/${totalInstallments}`;
    },

    getPaymentsForDay(day) {
      const dateKey = this.formatDateKey(new Date(this.currentYear, this.currentMonth, day));
      const arr = this.paymentsByDate[dateKey] || [];
      return arr.filter(p => {
        const done = this.getExpenseCompletionStatus(p.expenseId);
        const arch = this.getExpenseArchivedStatus(p.expenseId);
        if (arch) return false;
        if (done) return false;
        return true;
      });
    },

    hasPaymentsOnDay(day) { return this.getPaymentsForDay(day).length > 0; },
    allPaidOnDay(day) {
      const arr = this.getPaymentsForDay(day);
      return arr.length > 0 && arr.every(p => p.paid);
    },
    isToday(day) {
      const t = new Date();
      return day === t.getDate() && this.currentMonth === t.getMonth() && this.currentYear === t.getFullYear();
    },

    async togglePayment(e, payment) {
      if (payment.paid) return;
      e.target.checked = false;
      this.pendingPayment = payment;
      try {
        const db = getFirestore();
        const ref = doc(db, "gastos", payment.expenseId);
        const snap = await getDoc(ref);
        if (!snap.exists()) return;
        const exp = snap.data();
        if (payment.installmentNumber > (exp.creditCard.installmentsPaid || 0)) {
          this.pendingPayment = payment;
          return;
        }
      } catch (err) {
        console.error("Error al iniciar confirmación de pago:", err);
        this.showMessage("Ocurrió un error. Por favor, intentá nuevamente.");
      }
    },

    async confirmTogglePayment() {
      try {
        const p = this.pendingPayment;
        const db = getFirestore();
        await updateDoc(doc(db, "gastos", p.expenseId), {
          "creditCard.installmentsPaid": p.installmentNumber
        });
        this.pendingPayment = null;
        await this.fetchPayments();
        this.$forceUpdate();
      } catch (err) {
        console.error("Error al marcar pago como pagado:", err);
        this.showMessage("Ocurrió un error al marcar el pago. Por favor, intentá nuevamente.");
      }
    },

    async cancelTogglePayment() {
      this.pendingPayment = null;
      this.selectedDay = null;
      await this.fetchPayments();
    },

    async markDayAsPaid(day) {
      try {
        const arr = this.getPaymentsForDay(day).filter(p => !p.paid);
        if (arr.length === 0) return;

        const updates = {};
        arr.forEach(p => {
          const id = p.expenseId;
          if (!updates[id]) updates[id] = { expenseId: id, installmentsPaid: p.installmentNumber, payment: p };
          else if (p.installmentNumber > updates[id].installmentsPaid) updates[id] = { expenseId: id, installmentsPaid: p.installmentNumber, payment: p };
        });

        const db = getFirestore();
        for (const id in updates) {
          const ref = doc(db, "gastos", id);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const exp = snap.data();
            if (updates[id].installmentsPaid > (exp.creditCard.installmentsPaid || 0)) {
              await updateDoc(ref, { "creditCard.installmentsPaid": updates[id].installmentsPaid });
            }
          }
        }
        await this.fetchPayments();
        this.$forceUpdate();
      } catch (err) {
        console.error("Error al marcar pagos del día:", err);
        this.showMessage("Ocurrió un error al marcar los pagos. Por favor, intentá nuevamente.");
      }
    },

    previousMonth() {
      this.currentMonth--;
      if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; }
      this.selectedDay = null;
    },
    nextMonth() {
      this.currentMonth++;
      if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; }
      this.selectedDay = null;
    },

    formatDate(date) {
      return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
    },
    formatCurrency(value) {
      const amount = parseFloat(value);
      if (isNaN(amount)) return "Monto inválido";
      return new Intl.NumberFormat("es-AR", {
        style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0
      }).format(amount);
    },


    async fetchPayments() {
      try {
        this.loading = true;
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) { this.loading = false; return; }

        const db = getFirestore();
        const gastosRef = collection(db, "gastos");
        const qy = query(
          gastosRef,
          where("uid", "==", user.uid),
          where("paymentMethod", "==", "Tarjeta de Crédito")
        );

        const querySnapshot = await getDocs(qy);
        this.payments = [];
        this.paymentsByDate = {};
        this.expensesData = {};

        const expensesToUpdate = [];

        querySnapshot.forEach(docSnapshot => {
          const expense = docSnapshot.data();
          this.expensesData[docSnapshot.id] = expense;

          if (expense.creditCard && expense.creditCard.installments > 0) {
            let needsDateUpdate = false;
            const correctDates = [];

            for (let i = 0; i < expense.creditCard.installments; i++) {
              const isPaid = i < (expense.creditCard.installmentsPaid || 0);

            
              const baseDate =
                expense.date?.toDate ? expense.date.toDate()
                  : (typeof expense.date === "string"
                      ? (expense.date.length === 10 ? this.fromYMD(expense.date) : new Date(expense.date))
                      : new Date(expense.date));

             
              const purchaseDateForInstallment = this.atNoon(new Date(baseDate));
              purchaseDateForInstallment.setMonth(purchaseDateForInstallment.getMonth() + i);

             
              const correctDate = this.calcDueFromCards(purchaseDateForInstallment, String(expense.creditCard.type || "").toLowerCase());
              correctDates.push(this.toYMD(correctDate));

           
              let paymentDate;
              if (expense.creditCard.paymentDates && expense.creditCard.paymentDates[i]) {
                const saved = expense.creditCard.paymentDates[i];
                const savedDate = typeof saved === "string" ? this.fromYMD(saved) : new Date(saved);
                const savedDay = savedDate.getDate();
                const correctDay = correctDate.getDate();
                if (savedDay !== correctDay) {
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
              if (!this.paymentsByDate[dateKey]) this.paymentsByDate[dateKey] = [];
              this.paymentsByDate[dateKey].push(payment);
            }

            if (needsDateUpdate) {
              expensesToUpdate.push({ id: docSnapshot.id, dates: correctDates });
            }
          }
        });

        if (expensesToUpdate.length > 0) {
          await this.updatePaymentDatesInFirebase(expensesToUpdate);
        }

        this.refreshKey++;
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
        expensesToUpdate.forEach(exp => {
          const ref = doc(db, "gastos", exp.id);
          batch.update(ref, { "creditCard.paymentDates": exp.dates }); 
        });
        await batch.commit();
      } catch (error) {
        console.error("Error al actualizar fechas:", error);
      }
    },

    formatDateKey(date) {
      const d = this.atNoon(new Date(date));
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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