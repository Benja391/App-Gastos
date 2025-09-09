<template>
  <div class="credit-card-details grid gap-6 w-full">

    <!-- Tipo de Tarjeta -->
    <div class="grid gap-2 w-full">
      <label for="cardType" class="block text-lg font-medium text-gray-900">
        Tipo de Tarjeta
      </label>
      <select 
        :value="cardType"
        @input="$emit('update:cardType', $event.target.value)"
        id="cardType" 
        required
        class="w-full p-3 bg-gray-200 border rounded-lg"
      >
        <option value="" disabled>Seleccione tipo de tarjeta</option>
        <option v-for="type in cardTypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
    </div>

    <!-- Cuotas -->
    <div class="grid gap-2 w-full">
      <label for="installments" class="block text-lg font-medium text-gray-900">
        Número de Cuotas
      </label>
      <div class="flex items-center gap-4 w-full">
        <input 
          type="range" 
          :value="installments"
          @input="updateInstallments($event.target.value)"
          min="1" 
          max="24" 
          step="1"
          id="installments"
          class="flex-1 bg-gray-600"
        />
        <span class="w-12 text-center bg-gray-200 rounded px-2 py-1">
          {{ installments }}
        </span>
      </div>
    </div>

    <!-- Mensaje de cuotas -->
    <div v-if="installments > 1" class="p-3 bg-gray-800 rounded-lg text-gray-300 text-sm w-full">
      <p class="flex items-center">
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
