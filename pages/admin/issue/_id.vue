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
              {{ key.replace('_', ' ') }}
            </strong>
            <span v-if="key.includes('_at')">
              {{ formatDatetime(entry[key]) }}
            </span>
            <span v-else>
              {{ entry[key] }}
            </span>
          </p>
          <p
            class="mb-3 d-flex justify-content-between"
          >
            <strong class="mr-3 text-capitalize">
              Merchant
            </strong>
            <span v-if="issue.merchant">
              <b-link
                :href="`/admin/merchant/${issue.merchant.id}`"
                class="btn btn-link p-0"
              >
                {{ issue.merchant.name }}
              </b-link>
            </span>
          </p>
          <div class="mb-3">
            <strong class="mr-3 text-capitalize">
              Description
            </strong>
            <div>
              <p v-html="issue.description">
              </p>
            </div>
          </div>
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
      issue: 'issue/getIssue',
    }),
    entry() {
      return _.omit(this.issue, ['id', 'description', 'merchant']);
    },
  },
  asyncData({ params: { id }, app }) {
    return {
      id,
      access_token: app.$auth.getToken('local'),
    };
  },
  async created() {
    await this.showIssue({ id: this.id, token: this.access_token });
  },
  methods: {
    ...mapActions({
      showIssue: 'issue/showIssue'
    }),
  },
}
</script>
