<template>
  <b-col :md="col || 6">
    <b-form-group
      :id="`input-group-${field}`"
      label="Password"
      label-for="input-password"
    >
      <ValidationProvider
        v-slot="{ errors }"
        :name="field"
        type="password"
        :rules="rule"
      >
        <b-form-input
          :id="`input-${field}`"
          type="password"
          required
          :placeholder="placeholder || ''"
          :class="errors.length ? 'border-danger' : ''"
          @input="$emit('update:modelValue', $event.target.value)"
        >
        </b-form-input>
        <span v-if="errors.length" class="text-danger">
          {{ errors[0] }}
        </span>
      </ValidationProvider>
    </b-form-group>
  </b-col>
</template>

<script>
export default {
  props: ['col', 'field', 'errors', 'rule', 'placeholder']
}
</script>
