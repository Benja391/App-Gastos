<template>
  <div class="bg-[#08a04b] min-h-screen py-10 px-4 flex justify-center mt-8">
    <div class="p-10 w-full max-w-3xl bg-white rounded-2xl shadow-2xl space-y-10">
      <BaseHeading>
        Configuración de tarjetas
      </BaseHeading>

      <div
        v-for="card in cardTypes"
        :key="card.id"
        class="space-y-6 border-b border-gray-200 pb-8"
      >
        <h2 class="text-xl font-semibold text-gray-800">{{ card.name }}</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Día de cierre (1-31)
            </label>
            <input
              v-model.number="card.closingDay"
              type="number"
              min="1"
              max="31"
              placeholder="Introduzca su día de cierre"
              class="w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <p class="text-xs text-gray-500 mt-1">El día del mes en que cierra tu tarjeta</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Días hasta vencimiento
            </label>
            <input
              v-model.number="card.daysUntilDue"
              type="number"
              min="1"
              max="60"
              placeholder="Introduzca sus días de vencimiento"
              class="w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <p class="text-xs text-gray-500 mt-1">Días después del cierre que vence el pago</p>
          </div>
        </div>

        <div
          v-if="card.closingDay && card.daysUntilDue"
          class="bg-blue-50 p-3 rounded-lg border border-blue-100"
        >
          <p class="text-sm text-blue-800">
            <strong>Vista previa:</strong> Cierra el día {{ card.closingDay }} de cada mes,
            vence {{ card.daysUntilDue }} días después
          </p>
        </div>
      </div>

      <!-- Botón guardar -->
      <button
        @click="saveCardSettings"
        class="w-55 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md mx-auto block"
      >
        Guardar configuración
      </button>

      <!-- Botón limpiar campos -->
      <button
        @click="resetFormFields"
        class="mt-2 w-55 px-6 py-2 border border-green-600 text-green-700 font-semibold rounded-xl hover:bg-green-100 transition-all duration-300 shadow-md mx-auto block"
      >
        Restablecer campos
      </button>

      <transition name="fade">
        <p v-if="message" class="text-green-600 font-medium text-center mt-4">
          {{ message }}
        </p>
      </transition>

      <!-- Resumen -->
      <transition name="fade">
        <div class="bg-gray-50 p-6 rounded-xl shadow-md space-y-6">
          <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">
            Resumen de tu configuración
          </h2>

          <div
            v-for="card in cardTypes"
            :key="'summary-' + card.id"
            class="border-b pb-4 last:border-none"
          >
            <h3 class="text-lg font-bold text-green-700 mb-2">{{ card.name }}</h3>
            <ul class="text-gray-700 space-y-1 text-sm">
              <li>
                <span class="font-medium">Día de cierre:</span>
                {{ card.closingDay || 'No definido' }}
              </li>
              <li>
                <span class="font-medium">Días hasta vencimiento:</span>
                {{ card.daysUntilDue || 'No definido' }}
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import BaseHeading from './BaseHeading.vue';

const db = getFirestore();
const userId = ref(null);
const userDocId = ref(null);
const message = ref('');
const router = useRouter();

const cardTypes = ref([
  { id: 'visa', name: 'Visa', closingDay: null, daysUntilDue: null },
  { id: 'mastercard', name: 'MasterCard', closingDay: null, daysUntilDue: null },
  { id: 'amex', name: 'American Express', closingDay: null, daysUntilDue: null },
  { id: 'otra', name: 'Otra', closingDay: null, daysUntilDue: null }
]);

const findUserDocumentId = async (uid) => {
  const q = query(collection(db, "users"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    userDocId.value = docSnap.id;
    return true;
  } else {
    return false;
  }
};

const loadCardSettings = async () => {
  if (!userDocId.value) return;

  const settingsRef = doc(db, "users", userDocId.value, "settings", "tarjetaConfig");
  const settingsSnap = await getDoc(settingsRef);

  if (settingsSnap.exists()) {
    const data = settingsSnap.data();
    if (data.cardTypes) {
      cardTypes.value.forEach(card => {
        const savedCard = data.cardTypes[card.id];
        if (savedCard) {
          card.closingDay = savedCard.closingDay || null;
          card.daysUntilDue = savedCard.daysUntilDue || null;
        }
      });
    }
  }
};

const saveCardSettings = async () => {
  if (!userDocId.value) {
    message.value = 'Error: No se pudo identificar el usuario';
    return;
  }

  const settingsRef = doc(db, "users", userDocId.value, "settings", "tarjetaConfig");

  const cardTypesObj = {};
  cardTypes.value.forEach(card => {
    cardTypesObj[card.id] = {
      name: card.name,
      closingDay: card.closingDay,
      daysUntilDue: card.daysUntilDue
    };
  });

  try {
    await setDoc(settingsRef, {
      cardTypes: cardTypesObj,
      updatedAt: new Date()
    });

    message.value = 'Configuración guardada correctamente.';
    setTimeout(() => {
      message.value = '';
      router.push('/calendario-pagos'); // 👈 Redireccionar después de guardar
    }, 1500);

  } catch (error) {
    console.error("❌ Error al guardar:", error);
    message.value = 'Error al guardar la configuración';
  }
};

// 🔄 Nueva función para limpiar todos los inputs
const resetFormFields = () => {
  cardTypes.value.forEach(card => {
    card.closingDay = null;
    card.daysUntilDue = null;
  });
};

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userId.value = user.uid;
      const found = await findUserDocumentId(user.uid);
      if (found) {
        await loadCardSettings();
      }
    }
  });
});
</script>
