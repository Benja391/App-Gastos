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
    },
};
</script>

<template>
    <div class="flex flex-col mb-4">
      
        <label v-if="label" class="mb-1 text-white">{{ label }}</label>
        
       
        <input 
            :type="type"
            :placeholder="placeholder"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            class="bg-[#616160] text-white p-4 border border-[#83B1DF] rounded focus:outline-none focus:border-blue-500"
        />
    </div>
</template>
