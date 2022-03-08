<template>
  <fragment>
    <div class="content mt-3">
      <b-row>
        <b-col md="3"></b-col>
        <b-col md="6">
          <p
            v-for="(key, index) in Object.keys(entry)"
            class="mb-3 d-flex justify-content-between"
            :key="index"
          >
            <strong class="mr-3 text-capitalize">
              {{ key }}
            </strong>
            <span v-if="key.includes('_at')">
              {{ formatDatetime(entry[key]) }}
            </span>
            <span v-else>
              {{ entry[key] }}
            </span>
          </p>
        </b-col>
        <b-col md="3"></b-col>
      </b-row>
    </div>
  </fragment>
</template>

<script>
import _ from 'lodash';
import { mapActions, mapGetters } from 'vuex';
import { Fragment } from 'vue-fragment';
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  middleware: 'auth',
  components: {
    Fragment,
    ValidationObserver,
    ValidationProvider
  },
  computed: {
    ...mapGetters({
      loggedInUser: 'loggedInUser',
      merchant: 'merchant/getMerchant',
    }),
    entry() {
      return _.omit(this.merchant, ['id']);
    },
  },
  asyncData({ params: { id }, app }) {
    return {
      id,
      access_token: app.$auth.getToken('local'),
    };
  },
  created() {
    this.showMerchant({ id: this.id, token: this.access_token });
  },
  methods: {
    ...mapActions({
      showMerchant: 'merchant/showMerchant'
    }),
  },
}
</script>
