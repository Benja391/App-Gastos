<script setup>
defineProps({
  to: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    default: 'verde',
  },
  size: {
    type: String,
    default: 'md', 
  }
});
</script>

<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :to="to"
    type="button"
    class="inline-flex items-center justify-center gap-2 rounded-md border font-medium transition duration-200 ease-in-out"
    :class="[
  
      {
        'px-3 py-1 text-sm': size === 'sm',
        'px-4 py-2 text-base': size === 'md',
        'px-5 py-3 text-lg': size === 'lg',
      },
     
      {
        'bg-[#15ee20b9] text-black  hover:bg-[#239232]': color === 'verde',
        'bg-gray-200 text-gray-800 border-gray-400 hover:bg-gray-300': color === 'gris',
        'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200': color === 'gris-claro',
      }
    ]"
  >
    <slot />
  </component>
</template>
