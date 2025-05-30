<template>
    <div class="credit-card-details">
      
      <div class="mb-6">
        <label for="cardType" class="block text-lg font-medium text-gray-300 mb-2">Tipo de Tarjeta</label>
        <select 
          :value="cardType"
          @input="$emit('update:cardType', $event.target.value)"
          id="cardType" 
          required
          class="w-full p-3 ml-3 bg-gray-700 border rounded-lg"
        >
          <option value="" disabled>Seleccione tipo de tarjeta</option>
          <option v-for="type in cardTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>
  
   
      <div class="mb-6">
        <label for="installments" class="block text-lg font-medium text-gray-300 mb-2">
          Número de Cuotas
        </label>
        <div class="flex items-center">
          <input 
            type="range" 
            :value="installments"
            @input="updateInstallments($event.target.value)"
            min="1" 
            max="24" 
            step="1"
            id="installments"
            class="w-3/4 bg-gray-600 ml-3"
          />
          <span class="ml-4 w-12 text-center bg-gray-700 rounded px-2 py-1">{{ installments }}</span>
        </div>
      </div>
  
    
      <div v-if="installments > 1" class="mb-4 p-3 bg-gray-800 rounded-lg text-gray-300 text-sm">
        <p class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          El pago se dividirá en {{ installments }} cuotas iguales.
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "CreditCardDetails",
    props: {
      cardType: {
        type: String,
        default: ''
      },
      installments: {
        type: [Number, String],
        default: 1
      }
    },
    data() {
      return {
        cardTypes: ["Visa", "Mastercard", "American Express", "Otras"]
      };
    },
    methods: {
      updateInstallments(value) {
        const installmentValue = parseInt(value, 10);
        this.$emit('update:installments', installmentValue);
        this.$emit('calculate-installments');
      }
    }
  };
  </script>
  
