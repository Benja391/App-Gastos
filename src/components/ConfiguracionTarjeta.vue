<template>
  
  <section class="flex items-center justify-center min-h-screen bg-[#08a04b] text-white px-4 py-10 mt-8">
 
    <div class="relative bg-white/95 backdrop-blur-sm text-gray-900 rounded-3xl  border border-white/20 w-full max-w-4xl p-8 grid gap-10 overflow-hidden  shadow-[0_8px_30px_rgba(0,0,0,0.35)]
         hover:shadow-[0_12px_45px_rgba(0,0,0,0.45)]
         transition-shadow duration-500">

      
      <BaseHeading >
        {{ editingCardId ? 'Editá tarjeta' : 'Agregá tarjeta' }}
      </BaseHeading>

     
      <form @submit.prevent="onSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
       
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Tipo de tarjeta</label>
          <select
            v-model="newCard.cardType"
            @change="validateField('cardType')"
            :class="[
              'w-full px-4 py-3 rounded-xl bg-white border-2 focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm',
              errors.cardType 
                ? 'border-red-400 focus:ring-red-100 focus:border-red-500' 
                : 'border-gray-200 focus:ring-green-100 focus:border-green-500 hover:border-gray-300'
            ]"
          >
            <option disabled value="">Seleccioná el tipo</option>
            <option value="visa">Visa</option>
            <option value="mastercard">MasterCard</option>
            <option value="amex">American Express</option>
            <option value="otra">Otra</option>
          </select>
          <p v-if="errors.cardType" class="text-sm text-red-500">{{ errors.cardType }}</p>
        </div>

       
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Nombre en la tarjeta</label>
          <input
            v-model="newCard.cardholder"
            @input="validateField('cardholder')"
            type="text"
            placeholder="Nombre y apellido"
            :class="[
              'w-full px-4 py-3 rounded-xl bg-white border-2 focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm',
              errors.cardholder 
                ? 'border-red-400 focus:ring-red-100 focus:border-red-500' 
                : 'border-gray-200 focus:ring-green-100 focus:border-green-500 hover:border-gray-300'
            ]"
          />
          <p v-if="errors.cardholder" class="text-sm text-red-500">{{ errors.cardholder }}</p>
        </div>

        
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Número de tarjeta</label>
          <input
            :value="newCard.number"
            @input="formatCardNumber"
            @blur="validateField('number')"
            type="text"
            maxlength="19"
            placeholder="0000 0000 0000 0000"
            :class="[
              'w-full px-4 py-3 rounded-xl bg-white border-2 focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm',
              errors.number 
                ? 'border-red-400 focus:ring-red-100 focus:border-red-500' 
                : 'border-gray-200 focus:ring-green-100 focus:border-green-500 hover:border-gray-300'
            ]"
          />
          <p v-if="errors.number" class="text-sm text-red-500">{{ errors.number }}</p>
        </div>

       
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Código de seguridad</label>
          <input
            v-model="newCard.securityCode"
            @input="validateField('securityCode')"
            type="text"
            maxlength="4"
            placeholder="CVV"
            :class="[
              'w-full px-4 py-3 rounded-xl bg-white border-2 focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm',
              errors.securityCode 
                ? 'border-red-400 focus:ring-red-100 focus:border-red-500' 
                : 'border-gray-200 focus:ring-green-100 focus:border-green-500 hover:border-gray-300'
            ]"
          />
          <p v-if="errors.securityCode" class="text-sm text-red-500">{{ errors.securityCode }}</p>
        </div>

     
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Fecha de vencimiento (MM/AA)</label>
          <input
            :value="newCard.expirationDate"
            @input="formatExpirationDate"
            @blur="validateField('expirationDate')"
            type="text"
            maxlength="5"
            placeholder="MM/AA"
            :class="[
              'w-full px-4 py-3 rounded-xl bg-white border-2 focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm',
              errors.expirationDate 
                ? 'border-red-400 focus:ring-red-100 focus:border-red-500' 
                : 'border-gray-200 focus:ring-green-100 focus:border-green-500 hover:border-gray-300'
            ]"
          />
          <p v-if="errors.expirationDate" class="text-sm text-red-500">{{ errors.expirationDate }}</p>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Fecha de cierre</label>
          <input
            v-model="newCard.closingDate"
            @change="validateField('closingDate')"
            type="date"
            :class="[
              'w-full px-4 py-3 rounded-xl bg-white border-2 focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm',
              errors.closingDate 
                ? 'border-red-400 focus:ring-red-100 focus:border-red-500' 
                : 'border-gray-200 focus:ring-green-100 focus:border-green-500 hover:border-gray-300'
            ]"
          />
          <p v-if="errors.closingDate" class="text-sm text-red-500">{{ errors.closingDate }}</p>
        </div>

       
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Días hasta vencimiento</label>
          <input
            v-model.number="newCard.daysUntilDue"
            @input="validateField('daysUntilDue')"
            type="number"
            min="1"
            placeholder="Ej.: 4"
            :class="[
              'w-full px-4 py-3 rounded-xl bg-white border-2 focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm',
              errors.daysUntilDue 
                ? 'border-red-400 focus:ring-red-100 focus:border-red-500' 
                : 'border-gray-200 focus:ring-green-100 focus:border-green-500 hover:border-gray-300'
            ]"
          />
          <p class="text-xs text-gray-500">Se calculará la fecha exacta de vencimiento.</p>
          <p v-if="errors.daysUntilDue" class="text-sm text-red-500">{{ errors.daysUntilDue }}</p>
        </div>
        
<div class="md:col-span-2 flex gap-3 justify-center">
  <button
    type="submit"
    class="px-8 py-3 bg-green-600 text-white rounded-2xl font-semibold shadow hover:bg-green-700 transition"
  >
    {{ editingCardId ? 'Guardar cambios' : 'Agregar tarjeta' }}
  </button>
  <button
    v-if="editingCardId"
    type="button"
    @click="cancelEdit"
    class="px-8 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold shadow hover:bg-gray-300 transition"
  >
    Cancelar
  </button>
</div>
      </form>

    
      <div v-if="newCard.closingDate && newCard.daysUntilDue" class="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
        <strong>Vista previa:</strong>
        Cierra el día {{ formatDate(newCard.closingDate) }}, vence el día {{ formatDate(computeDueDate) }}
      </div>

    

     
      <p v-if="message" class="text-green-600 font-medium text-center mt-2">{{ message }}</p>

      
<div
  v-for="card in cards"
  :key="card.id"
   class="relative rounded-2xl shadow-xl overflow-hidden text-white w-full max-w-md mx-auto p-6"
  :class="{
    'bg-gradient-to-br from-gray-800 to-gray-700': card.cardType === 'visa',
    'bg-gradient-to-br from-gray-900 to-black': card.cardType === 'mastercard',
    'bg-gradient-to-br from-sky-400 to-sky-600': card.cardType === 'amex',
    'bg-gradient-to-br from-gray-400 to-gray-600': card.cardType === 'otra'
  }"
>
 
  <div class="flex justify-between items-center mb-6">
    <img
      :src="getCardLogo(card.cardType)"
      alt="Logo tarjeta"
      class="h-10"
    />
    
  </div>

 
  <div class="text-xl font-mono tracking-widest mb-4">
    **** **** **** {{ card.number.slice(-4) }}
  </div>

 
<div class="flex justify-between text-sm uppercase tracking-wide mt-6">
  <div>
    <p class="text-gray-200 text-xs">Titular</p>
    <p class="font-semibold">{{ card.cardholder }}</p>
  </div>
  <div class="text-right">
    <p class="text-gray-200 text-xs">Vence</p>
    <p class="font-semibold">{{ card.expirationDate }}</p>
  </div>
</div>

 
<div class="mt-3 text-xs text-gray-300">
  <p>Cierre: {{ formatDate(card.closingDate) }}</p>
  <p>Vencimiento: {{ formatDate(card.dueDate) }}</p>
</div>

  
  <div class="absolute top-3 right-4 flex space-x-3 text-sm">
    <button @click="editCard(card)" class="text-blue-300 hover:text-blue-500">Editar</button>
    <button @click="cardToDelete = card" class="text-red-300 hover:text-red-500">Eliminar</button>

  </div>
</div>
    </div>
  </section>
  
<div
  v-if="cardToDelete"
  class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
>
  <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-gray-200">
    <h3 class="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
      <span class="inline-block h-3 w-3 rounded-full bg-red-500"></span>
      Eliminar tarjeta
    </h3>

    <p class="mb-6 text-gray-600 leading-relaxed">
      ¿Estás seguro que querés eliminar la tarjeta
      "<strong>{{ cardToDelete.cardType.toUpperCase() }} terminada en {{ cardToDelete.number.slice(-4) }}</strong>"?
      <br /><br />
      <span class="text-sm text-red-500">Esta acción no se puede deshacer.</span>
    </p>

    <div class="flex justify-end gap-3">
      <button
        @click="cardToDelete = null"
        class="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
      >
        Cancelar
      </button>
      <button
        @click="confirmDeleteCard"
        class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow"
      >
        Eliminar
      </button>
    </div>
  </div>
</div>
  
</template>



<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
import BaseHeading from './BaseHeading.vue'

const db = getFirestore()
const userId = ref(null)
const userDocId = ref(null)
const editingCardId = ref(null)
const newCard = ref({
  cardType: '',
  cardholder: '',
  number: '',
  securityCode: '',
  expirationDate: '',
  closingDate: '',   
  daysUntilDue: null,
  dueDate: ''       
})
const cards = ref([])
const message = ref('')
const errors = ref({})
const cardToDelete = ref(null)


function fromYMD(s) {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}

function getCardLogo(type) {
  switch (type?.toLowerCase()) {
    case "visa":
      return "/visa.png"
    case "mastercard":
      return "/mastercard.png"
    case "amex":
      return "/amex.png"
    default:
      return "/generic.png"
  }
}

function toYMD(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}



function formatCardNumber(e) {
  let val = e.target.value.replace(/\D/g, '').slice(0,16)
  newCard.value.number = val.replace(/(.{4})/g, '$1 ').trim()
  if (errors.value.number) validateField('number')
}


watch(
  () => [newCard.value.closingDate, newCard.value.daysUntilDue],
  ([close, days]) => {
    const n = Number(days)
    if (close && n > 0) {
      const d = fromYMD(close)     
      d.setDate(d.getDate() + n)
      newCard.value.dueDate = toYMD(d) 
    } else {
      newCard.value.dueDate = ''
    }
  }
)


function formatExpirationDate(e) {
  let val = e.target.value.replace(/\D/g, '').slice(0,4)
  if (val.length > 2) val = val.slice(0,2) + '/' + val.slice(2)
  newCard.value.expirationDate = val
  if (errors.value.expirationDate) validateField('expirationDate')
}


const computeDueDate = computed(() => {
  const close = newCard.value.closingDate
  const days  = Number(newCard.value.daysUntilDue)
  if (!close || !days) return ''
  const dt = fromYMD(close)
  dt.setDate(dt.getDate() + days)
  return toYMD(dt)
})


function formatDate(s) {
  if (!s) return ''
 
  if (typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = fromYMD(s)
    return d.toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', year:'numeric' })
  }
  const d = new Date(s)
  return d.toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', year:'numeric' })
}

async function confirmDeleteCard() {
  if (!cardToDelete.value) return
  await deleteDoc(doc(db, 'users', userDocId.value, 'cards', cardToDelete.value.id))
  cards.value = cards.value.filter(c => c.id !== cardToDelete.value.id)
  cardToDelete.value = null
}

async function findUserDocumentId(uid) {
  const snap = await getDocs(collection(db,'users'))
  snap.forEach(d=> { if(d.data().uid===uid) userDocId.value=d.id })
}

async function loadCards() {
  if (!userDocId.value) return
  const snap = await getDocs(collection(db,'users',userDocId.value,'cards'))
  cards.value = snap.docs.map(d=>({id:d.id,...d.data()}))
}

function validateField(field) {
  switch(field) {
    case 'cardType':        if (!newCard.value.cardType)        errors.value.cardType='Obligatorio'; else delete errors.value.cardType; break
    case 'cardholder':      if (!newCard.value.cardholder)      errors.value.cardholder='Obligatorio'; else delete errors.value.cardholder; break
    case 'number':          if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(newCard.value.number)) errors.value.number='Formato inválido'; else delete errors.value.number; break
    case 'securityCode':    if (!/^\d{3,4}$/.test(newCard.value.securityCode)) errors.value.securityCode='CVV inválido'; else delete errors.value.securityCode; break
    case 'expirationDate':  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(newCard.value.expirationDate)) errors.value.expirationDate='Formato MM/AA'; else delete errors.value.expirationDate; break
    case 'closingDate':     if (!newCard.value.closingDate)     errors.value.closingDate='Obligatorio'; else delete errors.value.closingDate; break
    case 'daysUntilDue':    if (!(Number(newCard.value.daysUntilDue)>0)) errors.value.daysUntilDue='Debe ser mayor 0'; else delete errors.value.daysUntilDue; break
  }
}

function validate() {
  ['cardType','cardholder','number','securityCode','expirationDate','closingDate','daysUntilDue'].forEach(f=>validateField(f))
  return Object.keys(errors.value).length===0
}

async function onSubmit() {
  if (!validate()) return
  
  const cardData = { ...newCard.value, dueDate: computeDueDate.value }
  const colRef = collection(db,'users',userDocId.value,'cards')

  if (editingCardId.value) {
    const docRef = doc(db,'users',userDocId.value,'cards',editingCardId.value)
    await updateDoc(docRef,cardData)
    const idx = cards.value.findIndex(c=>c.id===editingCardId.value)
    cards.value[idx] = { id:editingCardId.value, ...cardData }
    message.value='Cambios guardados'
  } else {
    const docRef = await addDoc(colRef,cardData)
    cards.value.push({id:docRef.id,...cardData})
    message.value='Tarjeta agregada'
  }

  setTimeout(()=>message.value='',2000)
  newCard.value = {
    cardType:'', cardholder:'', number:'', securityCode:'',
    expirationDate:'', closingDate:'', daysUntilDue:null, dueDate:''
  }
  editingCardId.value=null
  errors.value={}
}

function editCard(card) {
  editingCardId.value = card.id
  newCard.value = { ...card }
}

async function deleteCard(id) {
  await deleteDoc(doc(db,'users',userDocId.value,'cards',id))
  cards.value = cards.value.filter(c=>c.id!==id)
}

function cancelEdit() {
  editingCardId.value=null
  newCard.value={ cardType:'',cardholder:'',number:'',securityCode:'',expirationDate:'',closingDate:'',daysUntilDue:null, dueDate:'' }
  errors.value={}
}

onMounted(() => {
  onAuthStateChanged(getAuth(), async user=>{
    if (user) { await findUserDocumentId(user.uid); await loadCards() }
  })
})
</script>
