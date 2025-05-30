<template>
  <div class="bg-gray-700 min-h-screen pt-10 py-10">
    <div class="p-10 max-w-2xl mx-auto bg-green-200 rounded-2xl shadow-xl space-y-8">
      <BaseHeading>Configuración de tarjetas</BaseHeading>

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
              class="w-full px-4 py-2 border rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
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
              class="w-full px-4 py-2 border rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <p class="text-xs text-gray-500 mt-1">Días después del cierre que vence el pago</p>
          </div>
        </div>

        <div v-if="card.closingDay && card.daysUntilDue" class="bg-blue-50 p-3 rounded-lg">
          <p class="text-sm text-blue-800">
            <strong>Vista previa:</strong> Cierra el día {{ card.closingDay }} de cada mes, 
            vence {{ card.daysUntilDue }} días después
          </p>
        </div>
      </div>

    
      <button
        @click="saveCardSettings"
        class="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
      >
        Guardar configuración
      </button>


      <transition name="fade">
        <p v-if="message" class="text-green-600 font-medium mt-4 text-center">
          {{ message }}
        </p>
      </transition>

     
      <transition name="fade">
        <div class="bg-white p-6 rounded-xl shadow-md space-y-6">
          <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">
            Resumen de tu configuración
          </h2>

          <div
            v-for="card in cardTypes"
            :key="'summary-' + card.id"
            class="border-b pb-4 last:border-b-0"
          >
            <h3 class="text-lg font-bold text-green-700 mb-2">{{ card.name }}</h3>
            <ul class="text-gray-700 space-y-1">
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
import BaseHeading from './BaseHeading.vue';

const db = getFirestore();
const userId = ref(null);
const userDocId = ref(null); 
const message = ref('');

const cardTypes = ref([
  { id: 'visa', name: 'Visa', closingDay: null, daysUntilDue: null },
  { id: 'mastercard', name: 'MasterCard', closingDay: null, daysUntilDue: null },
  { id: 'amex', name: 'American Express', closingDay: null, daysUntilDue: null },
  { id: 'otra', name: 'Otra', closingDay: null, daysUntilDue: null }
]);

const findUserDocumentId = async (uid) => {
  console.log("Buscando documento para UID:", uid);
  const q = query(collection(db, "users"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    userDocId.value = docSnap.id;
    console.log("✅ Documento encontrado:", userDocId.value);
    return true;
  } else {
    console.warn("⚠️ No se encontró documento del usuario con ese UID.");
    return false;
  }
};

const loadCardSettings = async () => {
  if (!userDocId.value) {
    console.log("❌ No hay userDocId para cargar configuración");
    return;
  }

  console.log("Cargando configuración para userDocId:", userDocId.value);
  
  const settingsRef = doc(db, "users", userDocId.value, "settings", "tarjetaConfig");
  const settingsSnap = await getDoc(settingsRef);

  if (settingsSnap.exists()) {
    const data = settingsSnap.data();
    console.log("✅ Configuración encontrada:", data);
    
    if (data.cardTypes) {
      cardTypes.value.forEach(card => {
        const savedCard = data.cardTypes[card.id];
        if (savedCard) {
          card.closingDay = savedCard.closingDay || null;
          card.daysUntilDue = savedCard.daysUntilDue || null;
        }
      });
    }
  } else {
    console.log("❌ No se encontró configuración guardada");
  }
};

const saveCardSettings = async () => {
  if (!userDocId.value) {
    console.log("❌ No hay userDocId para guardar");
    message.value = 'Error: No se pudo identificar el usuario';
    return;
  }

  console.log("Guardando configuración para userDocId:", userDocId.value);
  console.log("Datos a guardar:", cardTypes.value);

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

    console.log("✅ Configuración guardada exitosamente");
    message.value = 'Configuración guardada correctamente.';
    setTimeout(() => {
      message.value = '';
    }, 3000);
  } catch (error) {
    console.error("❌ Error al guardar:", error);
    message.value = 'Error al guardar la configuración';
  }
};

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userId.value = user.uid;
      console.log("Usuario autenticado:", user.uid);
      const found = await findUserDocumentId(user.uid);
      if (found) {
        await loadCardSettings();
      }
    } else {
      console.warn("⚠️ Usuario no autenticado");
    }
  });
});
</script>