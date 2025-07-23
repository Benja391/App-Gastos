<script>
export default {
    name: 'MainInput',
    emits: ['update:modelValue'],
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        placeholder: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'text',
        },
        label: {
            type: String,
            default: '',
        },
        id: {
              type: String,
              default: '',
        },
    },
};
</script>

<template>
   <div class="flex flex-col mb-4">
  <label
    v-if="label"
    :for="id"
    class="mb-1 text-black"
  >
    {{ label }}
  </label>

  <input 
    :id="id"
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2"
  />
</div>
</template>
