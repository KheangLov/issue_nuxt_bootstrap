<template>
  <merchant-inputs-component
    v-if="entry && Object.keys(entry).length"
    @form_submit="handleSubmit($event)"
    :entry="entry"
  />
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import MerchantInputsComponent from '~/components/MerchantInputsComponent';

export default {
  middleware: 'auth',
  components: {
    MerchantInputsComponent,
  },
  computed: {
    ...mapGetters({
      loggedInUser: 'loggedInUser',
      getMerchant: 'merchant/getMerchant',
    })
  },
  async created() {
    await this.showMerchant({ id: this.id, token: this.access_token });
    this.$set(this, 'entry', { ..._.omit(this.getMerchant, [
        'id',
        'created_by',
        'created_at',
        'updated_by',
        'updated_at',
        'deleted_by',
        'deleted_at',
      ])
    });
  },
  async asyncData({ params: { id }, app }) {
    return {
      id,
      access_token: app.$auth.getToken('local'),
      entry: {},
      button_loaded: true,
    };
  },
  methods: {
    ...mapActions({
      updateMerchant: 'merchant/updateMerchant',
      showMerchant: 'merchant/showMerchant',
    }),
    handleSubmit(vue) {
      this.updateMerchant({ id: this.id, token: this.access_token, params: vue.form, vue });
    },
  },
}
</script>
