<template>
  <fragment>
    <b-button
      v-if="submit_obj && !submit_obj.disabled"
      type="submit"
      variant="outline-primary"
      :disabled="!submit_obj.button_loaded"
      class="mr-2"
    >
      <b-icon
        icon="arrow-right-square"
        aria-hidden="true"
      >
      </b-icon>
      {{ submit_obj.text || 'Submit' }}
    </b-button>
    <b-link
      v-if="cancel_obj && !cancel_obj.disabled"
      :href="cancel_obj.link"
      class="btn btn-outline-danger"
    >
      <b-icon
        icon="x-circle"
        aria-hidden="true"
      >
      </b-icon>
      {{ cancel_obj.text || 'Cancel' }}
    </b-link>
  </fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';

export default {
  props: ['submit_obj', 'cancel_obj'],
  components: {
    Fragment,
  },
}
</script>
