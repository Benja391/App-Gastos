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
        'w-24 text-sm': size === 'sm',
        'w-40 text-base': size === 'md',
        'w-60 text-lg': size === 'lg',
      },
  
      {
        'bg-[#6ac480] text-black hover:bg-[#5db873]': color === 'verde',
        'bg-[#1e1e1e] text-white hover:bg-[#2e2e2e]': color === 'gris',
        'bg-[#3a3a3a] text-white hover:bg-[#4a4a4a]': color === 'gris-claro',
      }
    ]"
  >
    <slot />
  </component>
</template>
