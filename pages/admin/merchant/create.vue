<template>
  <merchant-inputs-component @form_submit="handleCreate($event)" />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import MerchantInputsComponent from '~/components/MerchantInputsComponent';

export default {
  middleware: 'auth',
  components: {
    MerchantInputsComponent,
  },
  computed: {
    ...mapGetters({
      loggedInUser: 'loggedInUser',
    }),
  },
  asyncData({ app }) {
    return {
      access_token: app.$auth.getToken('local'),
    };
  },
  methods: {
    ...mapActions({
      createMerchant: 'merchant/createMerchant'
    }),
    handleCreate(vue) {
      this.createMerchant({ token: this.access_token, params: vue.form, vue });
    },
  },
}
</script>
