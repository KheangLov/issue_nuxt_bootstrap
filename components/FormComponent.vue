<template>
  <b-form @submit.prevent="$emit('submitted')">
    <b-row>
      <slot name="form"></slot>
    </b-row>

    <div class="text-left">
      <slot name="actions"></slot>
    </div>
  </b-form>
</template>

<script>
export default {
  emits: ['submitted'],
}
</script>
